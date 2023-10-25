CREATE TABLE "users"
(
  user_id              SERIAL PRIMARY KEY,               -- Unique ID for the record
  user_first_name VARCHAR(255) NOT NULL,
  user_last_name  VARCHAR(255) NOT NULL,
  user_email      VARCHAR(255) NOT NULL,
  user_password   VARCHAR(255) NOT NULL
); 

CREATE TABLE User_Weekly_Metrics (
  "user_id" INT PRIMARY KEY REFERENCES users(user_id),
  week TIMESTAMP,
  start_sleep_time TIME,
  end_sleep_time TIME,
  red_task_percentage FLOAT,
  orange_task_percentage FLOAT,
  blue_task_percentage FLOAT,
  green_task_percentage FLOAT,
  num_reschedule INT,
  work_done_per_hour FLOAT
);
CREATE TABLE Tasks (
    "user_id" INT REFERENCES users(user_id),
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    task_start_date DATE,
    task_due_date DATE,
    progress_percent INTEGER,
    priority_level INTEGER,
    estimate_completion_time FLOAT
);

CREATE TABLE Events (
    event_block_id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_start_time TIME,
    event_end_time TIME,
    reminder_id INT REFERENCES reminders(reminder_id),
    user_id INT REFERENCES users(user_id),
    task_id INT REFERENCES tasks(task_id),
    work_done_pct FLOAT,
    repetition_duration INTERVAL,
    repetition_days INTEGER[],
    repetition_frequency VARCHAR(255),
    event_date DATE
);

CREATE TABLE reminders (
  reminder_id SERIAL PRIMARY KEY,            -- Primary Key
  time_before_event FLOAT,
  days_before_event INT,
  "user_id" INT REFERENCES users(user_id)      -- Foreign Key
);
ALTER TABLE reminders
ADD COLUMN event_block_id INT,
ADD CONSTRAINT fk_event_block FOREIGN KEY (event_block_id) REFERENCES events(event_block_id);


