const pg = require("pg");
const conString = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: process.env.DB_SSL === "true",
};
var client = new pg.Client(conString);
client.connect();

function decreaseTimeByOneHour(time) {
  // Split the time string into hours and minutes
  const [hours, minutes, seconds] = time.split(":").map(Number);

  // Calculate the new time
  let newHours = hours - 1;

  // Check for underflow
  if (newHours < 0) {
    newHours = 23; // Wrap around to 23 (11 PM)
  }
  // Return the new time in the 24-hour format
  return newHours;
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
function isConflicting(number, lowerBound, upperBound) {
  return number >= lowerBound && number <= upperBound;
}

function get_available_intervals(events) {
  const available_intervals = [];
  let begin = 0;
  events.forEach((event) => {
    if (decreaseTimeByOneHour(event.event_start_time) >= begin) {
      available_intervals.push({
        start: begin,
        end: decreaseTimeByOneHour(event.event_start_time),
      });
      begin = parseInt(event.event_end_time.split(":")[0]);
    } else {
      begin = parseInt(event.event_end_time.split(":")[0]);
    }
  });
  if (begin != 23) {
    available_intervals.push({
      start: begin,
      end: 23,
    });
  }
  return available_intervals;
}

function get_best_time_intervals(available_intervals, curr_task, circadian_rhythm) {
  let task_time = curr_task.estimate_completion_time / 60;
  let best_intervals = [];

  available_intervals.forEach((interval) => {
    let r = interval.start + task_time - 1;
    for (let l = interval.start; r <= interval.end; l++) {
      const score = getScore(circadian_rhythm.slice(l, r + 1));
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

function algorithm(events, tasks, circadian_rhythm, reschedule_value) {
  tasks.sort((a, b) => {
    if (a.priority_level == b.priority_level) {
      return b.estimate_completion_time - a.estimate_completion_time;
    }
    return b.priority_level - a.priority_level;
  });

  let available_intervals = get_available_intervals(events);
  console.log(available_intervals);

  const already_recommended = [];
  const new_events = [];
  tasks.forEach((task) => {
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
            already_recommended_t.start,
            already_recommended_t.end
          ) ||
          isConflicting(
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
    const best_time =
      best_available_times[reschedule_value % best_available_times.length];
    console.log(best_available_times.length)
    new_events.push({
      name: task.task_name,
      score: best_time.score,
      time: `${best_time.start}:00 - ${best_time.end + 1}:00`,
    });

    const query = {
        text: 'INSERT INTO Events (event_name, event_start_time, event_end_time, reminder_id, user_id, task_id, work_done_pct, repetition_duration, repetition_days, repetition_frequency, event_date, priority_level, regen_count, max_reschedule) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        values: [task.task_name, `${best_time.start}:00:00`, `${best_time.end + 1}:00:00`, 'NULL', task.user_id, task.task_id, 0, 'NULL','NULL','NULL', task.task_start_date, task.priority_level, 0, 0],
    };
    
    console.log(query)

    already_recommended.push({ start: best_time.start, end: best_time.end });
  });

  console.log("Done");
  console.log(new_events);

  // let task_time = 2
  // //Find the best time interval for each available time
  // let best_intervals = []
  // avaiable_intervals.forEach(interval => {
  //     let keys = listHoursBetween(interval.start, interval.end);
  //     // console.log(keys)
  //     r = task_time-1
  //     for(let l = 0; r < keys.length; l++){
  //       console.log(keys[l], keys[r], getScore(keys.slice(l,r+1), halfHourDictionary))
  //       best_intervals.push([getScore(keys.slice(l,r+1), halfHourDictionary), [keys[l], keys[r]]]);
  //       r++
  //     }
  //     console.log("")
  // })
  // best_intervals.sort((a,b) => b[0] - a[0])

  console.log();
}

let events = [
  {
    event_block_id: 13,
    event_name: "BIO331",
    event_start_time: "09:00:00",
    event_end_time: "23:00:00",
    reminder_id: null,
    user_id: 1,
    task_id: null,
    work_done_pct: null,
    repetition_duration: {
      minutes: 50,
    },
    repetition_days: [1, 3, 5],
    repetition_frequency: "Weekly",
    event_date: "2023-10-31T05:00:00.000Z",
  },
  {
    event_block_id: 11,
    event_name: "ART335",
    event_start_time: "10:00:00",
    event_end_time: "12:00:00",
    reminder_id: null,
    user_id: 1,
    task_id: null,
    work_done_pct: null,
    repetition_duration: {
      hours: 1,
      minutes: 30,
    },
    repetition_days: [1, 3, 5],
    repetition_frequency: "Weekly",
    event_date: "2023-10-31T05:00:00.000Z",
  },
  {
    event_block_id: 14,
    event_name: "Study Colory Theory",
    event_start_time: "12:00:00",
    event_end_time: "13:00:00",
    reminder_id: null,
    user_id: 1,
    task_id: 7,
    work_done_pct: null,
    repetition_duration: {
      minutes: 30,
    },
    repetition_days: [1, 3, 5],
    repetition_frequency: "Weekly",
    event_date: "2023-10-31T05:00:00.000Z",
  },
  {
    event_block_id: 12,
    event_name: "ART482",
    event_start_time: "14:00:00",
    event_end_time: "15:00:00",
    reminder_id: null,
    user_id: 1,
    task_id: null,
    work_done_pct: null,
    repetition_duration: {
      hours: 1,
    },
    repetition_days: [2, 4],
    repetition_frequency: "Weekly",
    event_date: "2023-10-31T05:00:00.000Z",
  },
];

const tasks = [
  //   {
  //     user_id: 1,
  //     task_id: 5,
  //     task_name: "Work on Masterpiece",
  //     task_start_date: "2023-10-31T05:00:00.000Z",
  //     task_due_date: "2023-11-02T05:00:00.000Z",
  //     progress_percent: 0,
  //     priority_level: 4,
  //     estimate_completion_time: 60,
  //     completion_date: null,
  //   },
  //   {
  //     user_id: 1,
  //     task_id: 9,
  //     task_name: "Studying",
  //     task_start_date: "2023-10-31T05:00:00.000Z",
  //     task_due_date: "2023-11-02T05:00:00.000Z",
  //     progress_percent: 0,
  //     priority_level: 2,
  //     estimate_completion_time: 120,
  //     completion_date: null,
  //   },
  {
    user_id: 1,
    task_id: 8,
    task_name: "CSCE 121",
    task_start_date: "2023-10-31T05:00:00.000Z",
    task_due_date: "2023-11-02T05:00:00.000Z",
    progress_percent: 0,
    priority_level: 4,
    estimate_completion_time: 60,
    completion_date: null,
  },
];

let circadian_rhythm = [
    0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 5, 5, 4, 3, 2, 2, 2, 4, 5, 5, 5, 2, 2, 1,
  ];

algorithm(events, tasks, circadian_rhythm, 12);

module.exports = get_available_intervals;
