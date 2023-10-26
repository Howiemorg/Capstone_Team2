function decreaseTimeByOneHour(time) {
  // Split the time string into hours and minutes
  const [hours, minutes] = time.split(':').map(Number);

  // Calculate the new time
  let newHours = hours - 1;
  let newMinutes = minutes;

  // Check for underflow
  if (newHours < 0) {
    newHours = 23; // Wrap around to 23 (11 PM)
  }

  // Ensure the time components have leading zeros if necessary
  const formattedHours = String(newHours).padStart(2, '0');
  const formattedMinutes = String(newMinutes).padStart(2, '0');

  // Return the new time in the 24-hour format
  return `${formattedHours}:${formattedMinutes}`;
}

// function listHoursBetween(start, end) {
//   // Split the start and end times into hours and minutes
//   const [startHours, startMinutes] = start.split(':').map(Number);
//   const [endHours, endMinutes] = end.split(':').map(Number);

//   // Initialize an array to store the list of hours
//   const hoursList = [];

  

//   return hoursList;
// }

function listHoursBetween(start, end) {
  // Split the start and end times into hours and minutes
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':');
  
  // Initialize an array to store the list of hours
  const hoursList = [];
  for(let i = startHours; i <= endHours; i++){
     let new_hour = i
     if(new_hour === 24){
         new_hour = 0
     }
     new_hour = String(new_hour).padStart(2, '0');
     hoursList.push(`${new_hour}:${endMinutes}`)
  }
  
  return hoursList;
}

function getScore(a, halfHourDictionary){
  let s = 0
  a.forEach(key => {
    s += halfHourDictionary[key]
  })
  return s
}


let halfHourDictionary = {};

for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 60) {
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    halfHourDictionary[time] = 0;
  }
}

let wakeUpTime = '08:00';
let sleepTime = '24:00';

// let circadianRhythmWork = [1,1,2,5,5,5,5,5,4,4,3,3,2,2,2,3,3,4,4,5,5,5,5,3,3,2,2,1,1];
let circadianRhythmWork = [1,3,5,5,4,3,2,2,2,3,5,5,5,2,2,1];
let events = [{
  start: '09:00',
  stop: '11:00'
},
{
  start: '14:00',
  stop: '15:00'
},
{
  start: '19:00',
  stop: '21:00'
},
]

let i = 0;

for (const time in halfHourDictionary) {
  if (time >= wakeUpTime && time <= sleepTime) {
    if(i >= circadianRhythmWork.length){
        break;
    }
    halfHourDictionary[time] = circadianRhythmWork[i];
    i++;
  }
}

console.log(halfHourDictionary);


// go through and get all the free intervals in which it is empty
const avaiable_intervals = []
let begin = "00:00";
events.forEach(event => {
  avaiable_intervals.push(
    {
      start: begin,
      end: decreaseTimeByOneHour(event.start)
    }
  )
  begin = event.stop
})
if(begin != "23:00"){
  avaiable_intervals.push({
    start:begin,
    end: "23:00"
  })
}


console.log(avaiable_intervals)

let task_time = 2
//Find the best time interval for each available time
let best_intervals = []
avaiable_intervals.forEach(interval => {
    let keys = listHoursBetween(interval.start, interval.end);
    // console.log(keys)
    r = task_time-1
    for(let l = 0; r < keys.length; l++){
      console.log(keys[l], keys[r], getScore(keys.slice(l,r+1), halfHourDictionary))
      best_intervals.push([getScore(keys.slice(l,r+1), halfHourDictionary), [keys[l], keys[r]]]);
      r++
    }
    console.log("")
})
best_intervals.sort((a,b) => b[0] - a[0])
console.log(best_intervals)

