let halfHourDictionary = {};

for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    halfHourDictionary[time] = 0;
  }
}

let wakeUpTime = '07:30';
let sleepTime = '22:00';

let circadianRhythmWork = [1,1,2,5,5,5,5,5,4,4,3,3,2,2,2,3,3,4,4,5,5,5,5,3,3,2,2,1,1];

let i = 0;

for (const time in halfHourDictionary) {
  if (time >= '07:30' && time <= '22:00') {
    if(i >= circadianRhythmWork.length){
        break;
    }
    halfHourDictionary[time] = circadianRhythmWork[i];
    i++;
  }
}

console.log(halfHourDictionary);