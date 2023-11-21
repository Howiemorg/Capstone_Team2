function timeIndex(time) {
  // Split the time string into hours and minutes
  const [hours, minutes, seconds] = time.split(":").map(Number);

  // Return the new time in the 24-hour format
  return hours * 2 + (minutes === 30);
}

function getScore(a) {
  let s = 0;
  for (let num of a) {
    if (num === 0) {
      return 0;
    }
    s += num;
  }
  return s;
}
function isConflicting(
  recommendedLowerBound,
  recommendedUpperBound,
  lowerBound,
  upperBound
) {
  return !(
    recommendedUpperBound < lowerBound || recommendedLowerBound > upperBound
  );
}

function get_available_intervals(events, circadian_rhythm) {
  const available_intervals = [];
  let begin = circadian_rhythm.findIndex((score) => score > 0);
  events.forEach((event) => {
    if (timeIndex(event.event_start_time) - 1 >= begin) {
      available_intervals.push({
        start: begin,
        end: timeIndex(event.event_start_time),
      });
      begin = timeIndex(event.event_end_time);
    } else {
      begin = timeIndex(event.event_end_time);
    }
  });
  const start_sleep = circadian_rhythm.findIndex(
    (score, idx) => idx >= begin && score == 0
  );
  if (begin != 48) {
    available_intervals.push({
      start: begin,
      end: start_sleep != -1 ? start_sleep : 48,
    });
  }
  return available_intervals;
}

function get_best_time_intervals(
  available_intervals,
  curr_task,
  circadian_rhythm
) {
  let task_time = curr_task.estimate_completion_time;
  let best_intervals = [];

  available_intervals.forEach((interval) => {
    let r = interval.start + task_time;
    for (let l = interval.start; r <= interval.end; l++) {
      const score = getScore(circadian_rhythm.slice(l, r));
      if (!score) {
        r++;
        continue;
      }
      best_intervals.push([score, l, r]);
      r++;
    }
  });
  best_intervals.sort((a, b) => b[0] - a[0]);
  return best_intervals;
}

const stringToDate = (string_date) => {
  console.log(typeof string_date);
  console.log(string_date);
  const date = new Date(string_date.substring(0, 10));
  date.setDate(date.getDate());
  date.setHours(string_date.substring(11, 13));
  date.setMinutes(string_date.substring(14, 16));
  date.setSeconds(string_date.substring(17, 19));
  return date;
};

const generateWeeklyArray = (tasks, startDate) => {
  let tasks_per_day = {};

  for (const task of tasks) {
    tasks_per_day[task.task_id] = [];
    // console.log(task.task_start_date.toString())
    // console.log(typeof(task.task_start_date.toString()))
    const taskStartDate = task.task_start_date;
    const taskDueDate = task.task_due_date;
    console.log(taskStartDate, taskDueDate);
    let avg_time =
      task.estimate_completion_time /
      (
        Math.floor((taskDueDate.getTime() - taskStartDate.getTime()) /
          (24 * 60 * 60 * 1000)) +
        1
      ).toFixed(0);
    
    avg_time = Math.floor(avg_time / 30) + (avg_time % 30 > 0)
    let total_time = 0;
    for (let i = 0; i < 7; ++i) {
      const currDay = new Date();
      currDay.setDate(startDate.getDate() + i);
      const start = new Date(currDay);
      start.setHours(23);
      start.setMinutes(59);
      start.setSeconds(59);
      currDay.setHours(0);
      currDay.setMinutes(0);
      currDay.setSeconds(0);
      if (taskStartDate <= start && taskDueDate >= currDay) {
        tasks_per_day[task.task_id].push(avg_time);
        total_time += (avg_time * 30);
      } else {
        tasks_per_day[task.task_id].push(0);
      }
      if (currDay.getDay() == 6 || total_time >= task.estimate_completion_time) {
        break;
      }
    }
  }
  // return dates;
  return tasks_per_day;
};

const algorithm = (
  events,
  tasks,
  circadian_rhythm,
  reschedule_value,
  start_date
) => {
  returnEvents = [];
  // console.log(typeof(start_date))
  const startDate = stringToDate(start_date);
  const task_time_per_day = generateWeeklyArray(tasks, startDate);

  for (let i = 0; i < 7; ++i) {
    const curr_day = new Date();
    curr_day.setDate(startDate.getDate() + i);

    const daily_events = events.filter((event) => {
      // console.log(event_date)
      return event.event_date.getDate() == curr_day.getDate();
    });

    tasks.sort((a, b) => {
      a.priority_level =
        curr_day.toDateString() == a.task_due_date.toDateString()
          ? 4
          : a.priority_level;
      b.priority_level =
        curr_day.toDateString() == b.task_due_date.toDateString()
          ? 4
          : b.priority_level;
      if (a.priority_level == b.priority_level) {
        const a_due_date = a.task_due_date;
        const b_due_date = b.task_due_date;
        if (a_due_date.toDateString() == b_due_date.toDateString()) {
          return (
            task_time_per_day[b.task_id][i] - task_time_per_day[a.task_id][i]
          );
        }
        return a_due_date.getTime() - b_due_date.getTime();
      }
      return b.priority_level - a.priority_level;
    });

    let available_intervals = get_available_intervals(
      daily_events,
      circadian_rhythm
    );
    console.log(available_intervals);

    const already_recommended = [];
    const already_scheduled = [];
    const new_events = [];
    for (const task of tasks) {
      task.estimate_completion_time = task_time_per_day[task.task_id][i];
      let curr_task_recommendations = get_best_time_intervals(
        available_intervals,
        task,
        circadian_rhythm
      );

      let best_available_times = [];
      //pick first one that is not already reccommended
      for (const rec of curr_task_recommendations) {
        let conflicting = false;
        for (const already_recommended_t of already_recommended) {
          if (
            isConflicting(
              rec[1],
              rec[2],
              already_recommended_t.start,
              already_recommended_t.end
            )
          ) {
            conflicting = true;
            break;
          }
        }
        if (!conflicting) {
          best_available_times.push({
            score: rec[0],
            start: rec[1],
            end: rec[2],
          });
        }
      }

      console.log(best_available_times.length);
      if (best_available_times.length == 0) {
        break;
      }

      const best_time =
        best_available_times[reschedule_value % best_available_times.length];

      new_events.push({
        name: task.task_name,
        score: best_time.score,
        time: `${Math.floor(best_time.start / 2)}:${
          best_time.start % 2 ? "30" : "00"
        } - ${Math.floor(best_time.end / 2)}:${
          best_time.end % 2 ? "30" : "00"
        }`,
      });

      returnEvents.push([
        task.task_name,
        `${Math.floor(best_time.start / 2)}:${
          best_time.start % 2 ? "30" : "00"
        }:00`,
        `${Math.floor(best_time.end / 2)}:${
          best_time.end % 2 ? "30" : "00"
        }:00`,
        task.user_id,
        task.task_id,
        curr_day,
        task.priority_level,
      ]);

      // console.log(query);

      already_recommended.push({ start: best_time.start, end: best_time.end });
      daily_events.push({
        event_start_time: `${Math.floor(best_time.start / 2)}:${
          best_time.start % 2 ? "30" : "00"
        }:00`,
        event_end_time: `${Math.floor(best_time.end / 2)}:${
          best_time.end % 2 ? "30" : "00"
        }:00`,
      });
      already_scheduled.push(task.task_id);
    }

    const tasks_not_scheduled = tasks.filter(
      (task) => !already_scheduled.includes(task.task_id) && task_time_per_day[task.task_id][i]
    );

    const free_time = get_available_intervals(daily_events, circadian_rhythm);

    let ith_available_interval = 0;

    //free time 
    for (let ith_task = 0; ith_task < tasks_not_scheduled.length; ++ith_task) {
      const task = tasks_not_scheduled[ith_task];
      for (
        ;
        ith_available_interval < free_time.length;
        ++ith_available_interval
      ) {
        const free_time_for_interval =
          free_time[ith_available_interval].end -
          free_time[ith_available_interval].start;
        let time_left =
          task_time_per_day[tasks_not_scheduled[ith_task].task_id][i];
        if (time_left < free_time_for_interval) {
          task_time_per_day[tasks_not_scheduled[ith_task].task_id][i] = 0;
          returnEvents.push([
            task.task_name,
            `${Math.floor(free_time[ith_available_interval].start / 2)}:${
              free_time[ith_available_interval].start % 2 ? "30" : "00"
            }:00`,
            `${Math.floor(
              (free_time[ith_available_interval].start + time_left) / 2
            )}:${
              Math.floor(free_time[ith_available_interval].start + time_left) % 2
                ? "30"
                : "00"
            }:00`,
            task.user_id,
            task.task_id,
            curr_day,
            task.priority_level,
          ]);
          free_time[ith_available_interval].start += time_left;
          break;
        } else {
          returnEvents.push([
            task.task_name,
            `${Math.floor(free_time[ith_available_interval].start / 2)}:${
              free_time[ith_available_interval].start % 2 ? "30" : "00"
            }:00`,
            `${Math.floor(free_time[ith_available_interval].end / 2)}:${
              free_time[ith_available_interval].end % 2 ? "30" : "00"
            }:00`,
            task.user_id,
            task.task_id,
            curr_day,
            task.priority_level,
          ]);
          task_time_per_day[tasks_not_scheduled[ith_task].task_id][i] =
            (time_left - free_time_for_interval);
          if (time_left === free_time_for_interval) {
            ith_available_interval++;
            break;
          }
        }
      }
      if (ith_available_interval === free_time.length) {
        for (; ith_task < tasks_not_scheduled.length; ++ith_task) {
          if(tasks_not_scheduled[ith_task].task_due_date.toDateString() == curr_day.toDateString()){
            continue;
          }
          task_time_per_day[tasks_not_scheduled[ith_task].task_id][i + 1] +=
            task_time_per_day[tasks_not_scheduled[ith_task].task_id][i];
        }
        break;
      }
    }

    console.log("Done");
    console.log(new_events);
    // return new_events;

    if (curr_day.getDay() == 6 || reschedule_value) {
      break;
    }
  }

  console.log();
  return returnEvents;
};

// algorithm(events, tasks, circadian_rhythm, 0, selected_date);

module.exports = algorithm;
