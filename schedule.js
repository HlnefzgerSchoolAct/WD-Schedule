// schedule.js
// School schedule logic and display

const regularSchedule = [
  { name: "1st", start: "08:00", end: "09:35" },
  { name: "2nd", start: "09:45", end: "11:15" },
  { name: "3rd", start: "11:25", end: "12:50" },
  { name: "C Lunch", start: "12:50", end: "13:15" },
  { name: "4th", start: "13:25", end: "14:55" }
];

const wednesdaySchedule = [
  { name: "1st", start: "08:00", end: "09:00" },
  { name: "Homeroom", start: "09:05", end: "09:40" },
  { name: "2nd", start: "09:45", end: "10:40" },
  { name: "3rd", start: "10:45", end: "11:50" },
  { name: "C Lunch", start: "11:50", end: "12:15" },
  { name: "4th", start: "12:20", end: "13:15" }
];

function getScheduleForToday() {
  const today = new Date();
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  if (today.getDay() === 3) {
    return wednesdaySchedule;
  }
  return regularSchedule;
}

function parseTime(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentPeriod(now, schedule) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  for (const period of schedule) {
    const start = parseTime(period.start);
    const end = parseTime(period.end);
    if (minutes >= start && minutes < end) {
      return { ...period, endMinutes: end };
    }
  }
  return null;
}

function getNextPeriod(now, schedule) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  for (const period of schedule) {
    const start = parseTime(period.start);
    if (minutes < start) {
      return period;
    }
  }
  return null;
}

function updateDisplay() {
  const now = new Date();
  const schedule = getScheduleForToday();
  const currentPeriod = getCurrentPeriod(now, schedule);
  const currentTimeElem = document.getElementById("currentTime");
  const currentPeriodElem = document.getElementById("currentPeriod");
  const countdownElem = document.getElementById("countdown");
  const noteElem = document.getElementById("note");

  // Format current time
  currentTimeElem.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (currentPeriod) {
    currentPeriodElem.textContent = currentPeriod.name + " Period";
    // Countdown
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const endMinutes = currentPeriod.endMinutes;
    let secondsLeft = (endMinutes - nowMinutes) * 60 - now.getSeconds();
    if (secondsLeft < 0) secondsLeft = 0;
    const min = Math.floor(secondsLeft / 60);
    const sec = secondsLeft % 60;
    countdownElem.textContent = `${min}:${sec.toString().padStart(2, '0')} left`;
    noteElem.textContent = "";
  } else {
    // Not in a period
    const next = getNextPeriod(now, schedule);
    currentPeriodElem.textContent = "No class in session";
    countdownElem.textContent = next ? `Next: ${next.name} at ${next.start}` : "School day is over";
    noteElem.textContent = "";
  }
}

setInterval(updateDisplay, 1000);
updateDisplay();
