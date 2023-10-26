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

function listHoursBetween(start, end) {
    // Split the start and end times into hours and minutes
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":");

    // Initialize an array to store the list of hours
    const hoursList = [];
    for (let i = startHours; i <= endHours; i++) {
        let new_hour = i;
        if (new_hour === 24) {
            new_hour = 0;
        }
        new_hour = String(new_hour).padStart(2, "0");
        hoursList.push(`${new_hour}:${endMinutes}`);
    }

    return hoursList;
}

function getScore(a, halfHourDictionary) {
    let s = 0;
    a.forEach((key) => {
        s += halfHourDictionary[key];
    });
    return s;
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
let circadian_rhythm = [
    0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 5, 5, 4, 3, 2, 2, 2, 3, 5, 5, 5, 2, 2, 1,
];

let events = [
    {
        event_block_id: 13,
        event_name: "BIO331",
        event_start_time: "09:00:00",
        event_end_time: "10:00:00",
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
  {
      user_id: 1,
      task_id: 5,
      task_name: "Work on Masterpiece",
      task_start_date: "2023-10-31T05:00:00.000Z",
      task_due_date: "2023-11-02T05:00:00.000Z",
      progress_percent: 0,
      priority_level: 3,
      estimate_completion_time: 60,
      completion_date: null,
  },
  {
      user_id: 1,
      task_id: 9,
      task_name: "Studying",
      task_start_date: "2023-10-31T05:00:00.000Z",
      task_due_date: "2023-11-02T05:00:00.000Z",
      progress_percent: 0,
      priority_level: null,
      estimate_completion_time: 120,
      completion_date: null,
  },
  {
      user_id: 1,
      task_id: 8,
      task_name: "Studying",
      task_start_date: "2023-10-31T05:00:00.000Z",
      task_due_date: "2023-11-02T05:00:00.000Z",
      progress_percent: 0,
      priority_level: null,
      estimate_completion_time: 60,
      completion_date: null,
  },
];

let available_intervals = get_available_intervals(events);

tasks.forEach(task => {
  const width = (task.estimate_completion_time/60)-1
  console.log(width)
  let best_intervals
})

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
module.exports = get_available_intervals