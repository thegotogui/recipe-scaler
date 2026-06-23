var time,
  ttime,
  snapTime,
  timer = 0,
  timeStamp,
  grabbed,
  recordSpan = 0,
  timerGo = false,
  tminutes = 0,
  tseconds = 0,
  thours = 0,
  minutes = 0,
  seconds = 0,
  hours = 0,
  spanStart,
  spanStop;

function startUp() {
  document.getElementById("notes").innerHTML =
    localStorage.getItem("eventList");
  startClock();
}

function startTime() {
  document.getElementById(
    "notes"
  ).innerHTML += `<div class="event">Timer Started at ${time}</div>`;
  grabTime();
}

function toClipboard() {
  /* Get the text field */
  var copyText = document.getElementById("notes");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);
}

function resetAll() {
  var r = confirm("Reset the timer?");
  if (r == true) {
    timerGo = false;
    var x = document.getElementById("notes").innerHTML;
    localStorage.setItem("eventListBU", x);
    document.getElementById("notes").innerHTML = "";
    document.getElementById("event").value = "";
    tminutes = 0;
    tseconds = 0;
    thours = 0;
  }
}

function startClock() {
  var myVar = setInterval(getTime, 1000);
}

// Increment the clock
function getTime() {
  // If the timer is running, do all the things
  if (timerGo) {
    timer += 1;
    recordSpan += 1;
    thours = Math.floor(timer / 3600);
    tminutes = Math.floor((timer - thours * 3600) / 60);
    tseconds = timer - (tminutes * 60 + thours * 3600);
  }

  // Whether or not the clock is running, update the clock.
  var today = new Date();
  var x = today.getHours();
  hours = x.toString();

  if (hours > 12) {
    hours = hours - 12;
  }

  x = today.getMinutes();
  minutes = x.toString();

  x = today.getSeconds();
  seconds = x.toString();

  tminutes = tminutes.toString();
  thours = thours.toString();
  tseconds = tseconds.toString();

  if (thours.length < 2) {
    thours = "0" + thours;
  }
  if (tminutes.length < 2) {
    tminutes = "0" + tminutes;
  }
  if (tseconds.length < 2) {
    tseconds = "0" + tseconds;
  }
  if (hours.length < 2) {
    hours = "0" + hours;
  }
  if (minutes.length < 2) {
    minutes = "0" + minutes;
  }
  if (seconds.length < 2) {
    seconds = "0" + seconds;
  }

  time = `${hours}:${minutes}:${seconds}`;
  ttime = `${thours}:${tminutes}:${tseconds}`;
  // console.log(`time ${time} ttime ${ttime}`);

  document.getElementById("theClock").innerHTML = `${time} ${ttime}`;
}

// When the first keystroke is entered into the event field, we want to grab THAT point in time
function grabTime() {
  if (!grabbed) {
    // If the time hasn't already been grabbed, grab the current count
    timeStamp = ttime; // Grab the current timer value
    grabbed = true; // Set a flag that the starting timecode has been grabbed (so it doesn't update it each time)

    recordSpan = 0; // Reset the timer /  counter that decides whether or not to put an ending timecode on the event.
  }
  timerGo = true;
}

// Record the event
// Something has officially and completely been entered in the event field AND the enter key was typed. Now grab the event, make some formatting decisions, and log it.
function getEvent() {
  var text = document.getElementById("event").value;
  spanStart = "";
  spanStop = "";
  if (text.indexOf("!") == 0) {
    spanStart = '<span class="alertfg alertbg">';
    spanStop = "</span>";
  }
  if (text.indexOf("*") == 0) {
    spanStart = "<span>&nbsp;&nbsp;";
    spanStop = "</span>";
  }

  if (recordSpan < 5) {
    document.getElementById(
      "notes"
    ).innerHTML += `<div class="event">${time}  ${timeStamp}: ${spanStart}${text}${spanStop}</div>`;
  } else {
    document.getElementById(
      "notes"
    ).innerHTML += `<div class="event">${time}  ${timeStamp} - ${ttime}: ${text}</div>`;
  }

  // Stash the updated list of events to local storage just in case the page is refreshed.
  var x = document.getElementById("notes").innerHTML;
  localStorage.setItem("eventList", x);
  document.getElementById("event").value = "";

  grabbed = false;
}
