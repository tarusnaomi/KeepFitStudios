const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { render } = require("ejs");

const connection = mysql.createConnection({
  database: "keepfit",
  host: "localhost",
  user: "root",
  password: "",
});
const app = express();
app.use(cookieParser());
app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "dogss",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 },
  })
);
app.use((req, res, next) => {
  const protectedRoutes = ["/profile", "/progress", "/update-profile"];
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
    next();
  } else if (protectedRoutes.includes(req.path)) {
    let path = req.path;
    if (Object.keys(req.query).length > 0) {
      const queryString = new URLSearchParams(req.query).toString();
      path += `?${queryString}`;
    }
    res.cookie("redirectHistory", path, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.redirect("/login?message=login");
  } else {
    next();
  }
});
app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
app.post("/signup", (req, res) => {
  if (req.body.pass === req.body.confirmPass) {
    connection.query(
      `SELECT email FROM users WHERE email = '${req.body.email}'`,
      [req.body.email],
      (sqlError, emailData) => {
        if (sqlError) {
          console.log(sqlError);
          res.status(500).render("signup.ejs", {
            error: true,
            errMessage: "Server Error: Contact Admin if this persists.",
            prevInput: req.body,
          });
        } else {
          if (emailData.length > 0) {
            res.render("signup.ejs", {
              error: true,
              errMessage: "Email Already Exists. Login",
              prevInput: req.body,
            });
          } else {
            let sqlStatement = `INSERT INTO users(email,password,first_name,last_name,birthdate,height,weight,username,phone) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            connection.query(
              sqlStatement,
              [
                req.body.email,
                bcrypt.hashSync(req.body.pass, 5),
                req.body.first_name,
                req.body.last_name,
                req.body.birthdate,
                req.body.height,
                req.body.weight,
                req.body.username,
                req.body.phone,
              ],
              (sqlErr) => {
                if (sqlErr) {
                  console.log(sqlErr);
                  res.status(500).render("signup.ejs", {
                    error: true,
                    errMessage: "Server Error: Contact Admin if this persists.",
                    prevInput: req.body,
                  });
                } else {
                  res.status(304).redirect("/login?signupSuccess=true");
                }
              }
            );
          }
        }
      }
    );
  } else {
    res.render("signup.ejs", {
      error: true,
      errMessage: "Password and Confirm Password do not match!",
      prevInput: req.body,
    });
  }
});
app.get("/login", (req, res) => {
  const message = req.query.message;
  res.render("login.ejs", { message });
});
app.post("/login", (req, res) => {
  const loginStatement = `SELECT * FROM users WHERE email = '${req.body.email}'`;
  connection.query(loginStatement, (sqlErr, userData) => {
    if (sqlErr) {
      console.log(sqlErr.message);
      res.status(500).render("login.ejs", {
        error: true,
        message: "Server Error, Contact Admin if this persists!",
        prevInput: req.body,
      });
    } else {
      console.log(userData);
      if (userData.length == 0) {
        res.status(401).render("login.ejs", {
          error: true,
          message: "Email or Password Invalid",
          prevInput: req.body,
        });
      } else {
        if (bcrypt.compareSync(req.body.pass, userData[0].password)) {
          req.session.user = userData[0];
          if (req.cookies.redirectHistory) {
            let redirectPath = req.cookies.redirectHistory;
            res.clearCookie("redirectHistory");
            res.redirect(redirectPath);
          } else {
            res.redirect("/");
          }
        } else {
          res.status(401).render("login.ejs", {
            error: true,
            message: "Email or Password Invalid",
            prevInput: req.body,
          });
        }
      }
    }
  });
});
app.get("/profile", (req, res) => {
  res.render("profile.ejs");
});
app.post("/profile", (req, res) => {
  const { goals } = req.body;
  const user_id = req.session.user_id;
  const sql = `UPDATE users SET goals = ? WHERE user_id = ?`;
  connection.query(sql, [goals, user_id], (err) => {
    if (err) {
      console.log(err);
      res.status(500).render("500.ejs", {
        message: "Server Error: Contact Admin if this persists",
      });
    } else {
      console.log(`Updated goal "${goals}" for user with ID ${user_id}`);
      res.redirect("/");
    }
  });
});
app.get("/update-profile", (req, res) => {
  res.render("updateprofile.ejs", { user: req.session.user });
});
app.post("/update-profile", (req, res) => {
  if (req.body.pass === req.body.confirmPass) {
    connection.query(
      `SELECT email FROM users WHERE email = ? AND user_id != ?`,
      [req.body.email, req.session.userId],
      (sqlEr) => {
        if (sqlEr) {
          console.log(sqlEr);
          res.status(500).render("updateprofile.ejs", {
            error: true,
            errMessage: "Server Error: Contact Admin if this persists.",
            prevInput: req.body,
          });
        } else {
          let sqlSt = `UPDATE users SET email = ?, password = ?, first_name = ?, last_name = ?, birthdate = ?, height = ?, weight = ?, username = ?, phone = ? WHERE user_id = ?`;
          connection.query(
            sqlSt,
            [
              req.body.email,
              bcrypt.hashSync(req.body.pass, 5),
              req.body.first_name,
              req.body.last_name,
              req.body.birthdate,
              req.body.height,
              req.body.weight,
              req.body.username,
              req.body.phone,
              req.session.userId,
            ],
            (sqlErr) => {
              if (sqlErr) {
                console.log(sqlErr);
                res.status(500).render("updateprofile.ejs", {
                  error: true,
                  errMessage: "Server Error: Contact Admin if this persists.",
                  prevInput: req.body,
                });
              } else {
                req.session.user = {
                  id: req.session.userId,
                  email: req.body.email,
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  birthdate: req.body.birthdate,
                  height: req.body.height,
                  weight: req.body.weight,
                  username: req.body.username,
                  phone: req.body.phone,
                };
                res.status(200).redirect("/profile");
              }
            }
          );
        }
      }
    );
  } else {
    res.render("updateprofile.ejs", {
      error: true,
      errMessage: "Password and Confirm Password do not match!",
      prevInput: req.body,
    });
  }
});
app.get("/progress", (req, res) => {
  res.render("progress.ejs");
});
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
app.get("/about", (req, res) => {
  res.render("about.ejs");
});
app.get("/workouts", (req, res) => {
  const workoutsQuery = `SELECT * FROM workouts`;
  connection.query(workoutsQuery, (err, workouts) => {
    if (err) {
      res.status(500).render("500.ejs", {
        message: "Server Error: Contact Admin if this persists",
      });
    } else {
      res.render("workouts.ejs", { workouts: workouts });
    }
  });
});
app.get("/exercises", (req, res) => {
  const exercisesQuery = `SELECT * FROM exercises`;
  connection.query(exercisesQuery, (exErr, exercises) => {
    if (exErr) {
      console.log(exErr);
      res.status(500).render("500.ejs", {
        message: "Server Error: Contact Admin if this persists",
      });
    } else {
      res.render("exercises.ejs", { exercises: exercises });
    }
  });
});
app.get("/exercises/:category", (req, res) => {
  const category = req.params.category;
  const sql = "SELECT * FROM Exercises WHERE category = ?";
  connection.query(sql, [category], (err, result) => {
    if (err) {
      throw err;
    }
    res.render("exercises", { exercises: result, category: category });
  });
});
app.get("/gainmuscle", (req, res) => {
  const categoryGainMuscle = `SELECT * FROM exercises`;
  connection.query(categoryGainMuscle, (sqlErrr, exercise) => {
    if (sqlErrr) {
      console.log(sqlErrr.message);
      res.status(500).render({
        error: true,
        message: "Server Error, Contact Admin if this persists!",
        prevInput: req.body,
      });
    } else {
      res.render("gainmuscle.ejs", { exercises: exercise });
    }
  });
});
app.get("/training", (req, res) => {
  const trainingQuery = `SELECT * FROM exercises`;
  const workoutQuery = `SELECT * FROM workouts`;
  connection.query(trainingQuery, (sqlEr, exercises) => {
    if (sqlEr) {
      console.log(sqlEr.message);
      res.status(500).render("training.ejs", {
        error: true,
        message: "Server Error, Contact Admin if this persists!",
        prevInput: req.body,
      });
    } else {
      connection.query(workoutQuery, (sqlE, workouts) => {
        if (sqlE) {
          console.log(sqlE.message);
          res.status(500).render("training.ejs", {
            error: true,
            message: "Server Error, Contact Admin if this persists!",
            prevInput: req.body,
          });
        } else {
          res.render("training.ejs", {
            exercises: exercises,
            workouts: workouts,
          });
        }
      });
    }
  });
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
app.get("*", (req, res) => {
  res.render("404.ejs");
});

app.listen(8030, () => console.log("Server running on port 8030"));
