-- Insert data into the Users table
INSERT INTO Users (username, email, password, first_name, last_name, birthdate, height, weight,goals)
VALUES
('john_doe', 'john@example.com', 'password123', 'John', 'Doe', '1990-05-15', 180, 75),
('jane_smith', 'jane@example.com', 'abc123', 'Jane', 'Smith', '1988-12-10', 165, 60),
('bob_jackson', 'bob@example.com', 'pass456', 'Bob', 'Jackson', '1995-08-20', 175, 80);

-- Insert data into the Exercises table
INSERT INTO Exercises (name, description, muscle_group)
VALUES
('Push-up', 'Bodyweight exercise targeting chest, shoulders, and triceps.', 'Chest, Shoulders, Triceps'),
('Squat', 'Lower body exercise targeting quadriceps, hamstrings, and glutes.', 'Quadriceps, Hamstrings, Glutes'),
('Pull-up', 'Upper body exercise targeting back and biceps.', 'Back, Biceps'),
('Plank', 'Core stability exercise targeting abdominal muscles.', 'Abdominals'),
('Dumbbell Shoulder Press', 'Strength exercise targeting shoulder muscles.', 'Shoulders');

('Lunges', 'Lower body exercise for glutes, quads, and hamstrings.', 'Quadriceps, Hamstrings, Glutes'),
('Row', 'Back exercise targeting upper back and biceps.', 'Back, Biceps'),
('Dips', 'Bodyweight exercise for chest, triceps, and shoulders.', 'Chest, Triceps, Shoulders'),
('Bicep Curl', 'Bicep isolation exercise to build muscle mass.', 'Biceps'),
('Tricep Extension', 'Tricep isolation exercise to build muscle mass.', 'Triceps'),
('Calf Raise', 'Exercise to strengthen calf muscles.', 'Calves');


-- Insert data into the Workouts table
INSERT INTO Workouts (user_id, name, description, date)
VALUES
(1, 'Full Body Workout', 'A comprehensive workout targeting all major muscle groups.', '2024-02-01'),
(2, 'Leg Day', 'Focus on lower body exercises for strength and hypertrophy.', '2024-02-05'),
(3, 'Upper Body Strength Training', 'Exercises to build strength and muscle in the upper body.', '2024-02-10');
INSERT INTO Workouts (user_id, name, description, date)
VALUES
(1, 'Full Body Workout', 'A comprehensive workout targeting all major muscle groups.', '2024-02-01'),
(2, 'Leg Day', 'Focus on lower body exercises for strength and hypertrophy.', '2024-02-05'),
(3, 'Upper Body Strength Training', 'Exercises to build strength and muscle in the upper body.', '2024-02-10'),


(1, 'Core Challenge', 'A workout focused on core strength and stability.', '2024-02-15'),
(2, 'Cardio & Conditioning', 'Cardiovascular exercise for overall fitness.', '2024-02-20'),
(3, 'Push & Pull Workout', 'Exercises focused on pushing and pulling motions.', '2024-02-25');


-- Insert data into the Workout_Exercises table
INSERT INTO Workout_Exercises (workout_id, exercise_id, sets, reps, weight)
VALUES
(1, 1, 3, 12, NULL), -- Push-ups
(1, 2, 4, 10, NULL), -- Squats
(1, 4, 3, NULL, NULL), -- Planks
(2, 2, 5, 8, NULL), -- Squats
(2, 3, 4, 6, NULL), -- Pull-ups
(3, 1, 4, 10, NULL), -- Push-ups
(3, 5, 3, 8, 20); -- Dumbbell Shoulder Press
-- Additional Exercises for Workout 1 (Full Body Workout)
(1, 7, 3, 10, NULL), -- Lunges
(1, 8, 3, 8, NULL), -- Rows
(1, 9, 3, NULL, NULL), -- Dips

-- Additional Exercises for Workout 2 (Leg Day)
(2, 6, 4, 12, NULL), -- Romanian Deadlift (focuses hamstrings)
(2, 10, 3, 15, NULL), -- Calf Raise

-- Additional Exercises for Workout 3 (Upper Body Strength Training)
(3, 4, 3, 12, NULL), -- Bicep Curl
(3, 11, 3, 10, NULL); -- Tricep Extension

-- Add column 'category' to the Exercises table
ALTER TABLE Exercises
ADD COLUMN category VARCHAR(255);

-- Update Exercises with categories
UPDATE Exercises
SET category = 'Strength Training'
WHERE name IN ('Push-up', 'Squat', 'Pull-up', 'Plank', 'Dumbbell Shoulder Press');

UPDATE Exercises
SET category = 'Leg Day'
WHERE name = 'Lunges';

UPDATE Exercises
SET category = 'Back and Biceps'
WHERE name = 'Row';

UPDATE Exercises
SET category = 'Upper Body'
WHERE name = 'Dips';

UPDATE Exercises
SET category = 'Arm Isolation'
WHERE name IN ('Bicep Curl', 'Tricep Extension');

UPDATE Exercises
SET category = 'Calves'
WHERE name = 'Calf Raise';

-- Add column 'category' to the Workouts table
ALTER TABLE Workouts
ADD COLUMN category VARCHAR(255);

-- Update Workouts with categories
UPDATE Workouts
SET category = 'Full Body'
WHERE name = 'Full Body Workout';

UPDATE Workouts
SET category = 'Leg Day'
WHERE name = 'Leg Day';

UPDATE Workouts
SET category = 'Upper Body'
WHERE name = 'Upper Body Strength Training';

UPDATE Workouts
SET category = 'Core'
WHERE name = 'Core Challenge';

UPDATE Workouts
SET category = 'Cardio'
WHERE name = 'Cardio & Conditioning';

UPDATE Workouts
SET category = 'Push & Pull'
WHERE name = 'Push & Pull Workout';
