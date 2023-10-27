INSERT INTO users (user_first_name, user_last_name, user_email, user_password)
VALUES ('Anna', 'Artist', 'anna@art.edu', 'iloveart');

INSERT INTO Events (event_name, event_start_time, event_end_time, reminder_id, user_id, task_id, work_done_pct, repetition_duration, repetition_days, repetition_frequency, event_date)
VALUES
    ('ART335', '10:00:00', '11:30:00', NULL, 1, NULL, NULL, '1 hour 30 minutes', '{1, 3, 5}', 'Weekly', '2023-10-31');

INSERT INTO Events (event_name, event_start_time, event_end_time, reminder_id, user_id, task_id, work_done_pct, repetition_duration, repetition_days, repetition_frequency, event_date)
VALUES
    ('ART482', '14:00:00', '15:00:00', NULL, 1, NULL, NULL, '1 hour', '{2,4}', 'Weekly', '2023-10-31');

INSERT INTO Events (event_name, event_start_time, event_end_time, reminder_id, user_id, task_id, work_done_pct, repetition_duration, repetition_days, repetition_frequency, event_date)
VALUES
    ('BIO331', '9:00:00', '9:50:00', NULL, 1, NULL, NULL, '50 minutes', '{1, 3, 5}', 'Weekly', '2023-10-31');

-- Insert task 1
INSERT INTO Tasks (user_id, task_name, task_start_date, task_due_date, progress_percent, priority_level, estimate_completion_time)
VALUES (1, 'Work on Masterpiece', '2023-10-31', '2023-11-2', 0, 3, 20.0);

-- Insert task 2
INSERT INTO Tasks (user_id, task_name, task_start_date, task_due_date, progress_percent, priority_level, estimate_completion_time)
VALUES (1, 'Finish Human Figure assignment', '2023-10-30', '2023-11-01', 0, 4, 10.0);

-- Insert task 3
INSERT INTO Tasks (user_id, task_name, task_start_date, task_due_date, progress_percent, priority_level, estimate_completion_time)
VALUES (1, 'Study Color Theory', '2023-10-30', '2023-11-3', 0, 2, 30.0);