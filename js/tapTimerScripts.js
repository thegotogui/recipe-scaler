var continueIt = false, // Flag to specify whether the clock is currently running or not.
    currentCount = 0, // What to start counting from. Assume zero by default.
    originalCount = 0, // Stores the original or initial value of the timer for scaling the pie chart
    maxMins = 3600, // Maximum number of seconds the timer will continue after zeroing out.
    maxMinsText = "1 hour", // Message to be displayed about the expiration timing out because I'm too lazy to do it a better way.
    minutes, seconds, plusMinus, time,
    newtimer = true, // Assume we are working with a new, rather than an already running, timer
    fromZero = true, // Assume that we are counting up from zero unless the user enters a time value.
    fromZeroTimer = false, // This flag is uniquely set when a count-UP timer is started. It's used to switch the color of the timespan buttons
    titleSet = false, // Has the user set a title? (THIS MAY BE DEPRECATED)
    logNoteComment, startTime, endTime, textLog = "",
    docTitle, previousTitle = "",
    zeroed, // This variable notes that, while the clock is at zero, it was PUT at zero rather than counted down to zero which avoids a chime
    pauseTimeHours, pauseTimeMinutes, pauseTimeSeconds, pauseDHours, pauseDMinutes, pauseDSeconds, pausedDuration,
    message, suffix = "", // The actual contents of the log are specified with these two variables which sit on either side of the timestamp.
    expiration = false,
    textLogVisible = false, //By default, the text version of the log should not be visible
    divVis = "", // This variable holds the status of the visibility of the pause clock
    pauseClock = 0, // Specifies ???????????????
    clockColor = "white", // Holds the color of the clock's digits which can change depending on status
    previousAdd = "0", // This variable stores the last amount added to the clock so that it can be subtracted if accidentally added
    textMessage, // Holds the unformatted version of a given status
    clockMode = true, // Specifies if the clock should display the current time or behave as a timer

    cHours, // Analog Clock Independent Time Variables
    cMinutes, // Analog Clock Independent Time Variables
    cSeconds, // Analog Clock Independent Time Variables

    prevCHours, // Stores previous analog clock values to minimize updates
    prevCMinutes, // Stores previous analog clock values to minimize updates
    prevCSeconds, // Stores previous analog clock values to minimize updates

    addStatus = true, // This determines what happens when a timer value is added while the clock is running. False, replaces the countdown, True simply adds it on.
    amPm, // Self-explanatory
    checkBax = false,
    timeMessage,
    colonedHours, // Contains the current hours followed by a colon
    previousLap = 0, // Stores the state of the current timer to be subtracted from the current count after a "lap"
    tapWait = 0, // tracks whether the timer is in REPLACE amount of time or ADD amount of time
    firstRun = true, // Flag indicates whether this is the first time THIS timer has run and whether it should extract the timer log from local storage
    buttonAddStatus = true, // Set the default behavior of the buttons to ADD time to the counter rather than replace it.
    resetPrompt = true, // Specifies whether clicking reset should ask for a confirmation. This is disabled in certain situations.
    logPrompt = true,
    timerAmount = 0,
    loopMode = false,
    oldLoop = false,
    reminderPrompt = true,
    expirationSound = 1,
    expirationAudio = "./media/ToneWobble.mp3",
    reminderAudio = "./media/ToneWobble.mp3",
    loopAudio = "./media/quack.mp3",
    autostart = true, // Stores whether or not the timer should start after X seconds (stored in autoDelay) after no other value has been entered
    autoDelay = 3000, // Number of miliseconds to wait before automatically starting
    logCounter = 2, // Used to number the log entries so that among other things, the loop function only leaves one entry.
    prevMinutes = 100,
    analogClockVis = true,
    digitalClockVis = true,
    clockPath = "mondaine/",
    boopCount = 10, // Flag decremented from 2 that prevents the alert from playing twice within the same second
    firstClockPass = true; // This is a flag to start the second hand at the right position until 12 position, then set to false and perform a normal cycle


// This initializes several things including two buttons for open/close of preferences
// This starts or stops the timer
function timerStartUp() {
    startClock();
    // Add an event listener for Show modal
    document.getElementById("prefs").addEventListener('click', () => outerModal.style.display = 'block');
    // document.getElementById("prefs").addEventListener('click', () => console.log("Prefs"));

    // Add an event listener for Hide modal
    document.getElementById("close").addEventListener('click', () => outerModal.style.display = 'none');
    // document.getElementById("close").addEventListener('click', () => console.log("Close"));

    updateToggleAdd();
    getPreferences(0);
}

function togglePrefs(which) {
    if (which == 1) {
        outerModal.classList.add('show-modal')
    } else {
        outerModal.classList.remove('show-modal')
    }
}



// Toggles which variety of clock is visible;' analog or digital
function toggleAnalog(which) {

    if (which == 1) {
        analogClockVis = !analogClockVis;
        var thing = document.getElementById("analogClock").classList;
        if (analogClockVis) {
            thing.remove("hideMe");
        } else {
            thing.add("hideMe");
        }
    } else if (which == 2) {

        digitalClockVis = !digitalClockVis;
        var thing = document.getElementById("theClock").classList;
        if (digitalClockVis) {
            thing.remove("hideMe");
        } else {
            thing.add("hideMe");
        }
    }
}

// This generally starts the time-of-day clock, and potentially all of the other mini variants.
function startClock() {
    var myVar = setInterval(getTime, 1000);
}



// Strightforward "get the time and put it in variables"

function getTime() {

    if (newtimer && clockMode) {
        var today = new Date();
        let hours = today.getHours();
        if (hours > 12) {
            hours = hours - 12;
        }
        minutes = today.getMinutes();
        seconds = today.getSeconds();

        drawAnalogClock();
    }
}


function getPreferences(mode) {

    if (mode == 0) {

        // See if resetConf exists in local storage. If it is not null, then grab various settings from local storage.
        var conf = localStorage.getItem("resetConf");
        if (conf != null) {
            resetPrompt = (localStorage.getItem("resetConf") == "true");
            document.getElementById("resetConf").checked = resetPrompt;

            logPrompt = (localStorage.getItem("logConf") == "true");
            document.getElementById("logConf").checked = logPrompt;

            reminderPrompt = (localStorage.getItem("reminderConf") == "true");
            document.getElementById("reminderConf").checked = reminderPrompt;

            autostart = (localStorage.getItem("autostart") == "true");
            document.getElementById("autostart").checked = autostart;

            expirationAudio = localStorage.getItem("expirationAudio");
            reminderAudio = localStorage.getItem("reminderAudio");
            loopAudio = localStorage.getItem("loopAudio");

            document.getElementById("expSound").selectedIndex = Number(localStorage.getItem("expirationAudioIndex"));
            document.getElementById("remSound").selectedIndex = Number(localStorage.getItem("reminderAudioIndex"));
            document.getElementById("loopSound").selectedIndex = Number(localStorage.getItem("loopAudioIndex"));

            // If the timer has JUST been opened, grab any existing log info from local storage
            if (firstRun) {
                document.getElementById("timeTape").innerHTML = localStorage.getItem("logTape");
                textLog = localStorage.getItem("logTapeTxt");
                firstRun = false;
            }

            // Check to see if the timer is being loaded from elsewhere (in this case, sous vide).
            var handOff = localStorage.getItem("handOff");

            if (handOff == "1") {
                localStorage.setItem("handOff", "0");
                document.getElementById("timerTitle").value = localStorage.getItem("handoffTitle");
                previousTitle = "somethingotherthanuntitled"; // This tricks the log function into putting the new title at the BOTTOM of the log
                logIt('title', 10);
                var handoffTime = localStorage.getItem("handoffTime");
                handoffTime = Number(handoffTime);
                setTime(handoffTime);
                // startStop(); // StartStop function is disabled for now. Timer will "load" time, but will not automatically start
            }

        } else {
            // If we get here, it means this is the first time the app has ever run in this browser and local storage items need to be set
            console.log('FIRST TIME CALLER');

            localStorage.setItem("expirationAudio", expirationAudio);
            localStorage.setItem("expirationAudioIndex", "0");

            localStorage.setItem("reminderAudio", reminderAudio);
            localStorage.setItem("reminderAudioIndex", "0");

            localStorage.setItem("loopAudio", loopAudio);
            localStorage.setItem("loopAudioIndex", "0");

            localStorage.setItem("resetConf", true);
            document.getElementById("resetConf").checked = true;

            localStorage.setItem("logConf", true);
            document.getElementById("logConf").checked = true;

            localStorage.setItem("reminderConf", true);
            document.getElementById("reminderConf").checked = true;

            localStorage.setItem("autostart", false);
            document.getElementById("autostart").checked = false;
        }
    }

    // Handles changes in preferences
    if (mode == 1) {
        resetPrompt = (document.getElementById("resetConf").checked);
        localStorage.setItem("resetConf", resetPrompt);
        // console.log(resetPrompt);

        logPrompt = (document.getElementById("logConf").checked);
        localStorage.setItem("logConf", logPrompt);
        // console.log(logPrompt);

        reminderPrompt = (document.getElementById("reminderConf").checked);
        localStorage.setItem("reminderConf", reminderPrompt);
        // console.log(reminderPrompt);

        autostart = (document.getElementById("autostart").checked);
        localStorage.setItem("autostart", autostart);
        // console.log(autostart);
    }
}


function soundChoice(which) {

    // Expiration sound choice
    if (which == 1) {
        var temp = document.getElementById("expSound").selectedIndex;
        console.log(temp);

        switch (temp) {
            case 0:
                expirationAudio = "./media/tonewobble.mp3";
                break;
            case 1:
                expirationAudio = "./media/vibra.mp3";
                break;
            case 2:
                expirationAudio = "./media/boops.mp3";
                break;
            case 3:
                expirationAudio = "./media/mwah.wav";
                break;
            case 4:
                expirationAudio = "./media/champ.mp3";
        }
        localStorage.setItem("expirationAudioIndex", temp);
        localStorage.setItem("expirationAudio", expirationAudio);
    }

    // Reminder Audio 
    if (which == 2) {

        var temp = document.getElementById("remSound").selectedIndex;
        console.log(temp);

        switch (temp) {
            case 0:
                reminderAudio = "./media/tonewobble.mp3";
                break;
            case 1:
                reminderAudio = "./media/vibra.mp3";
                break;
            case 2:
                reminderAudio = "./media/boops.mp3";
                break;
            case 3:
                reminderAudio = "./media/mwah.wav";
                break;
            case 4:
                reminderAudio = "./media/champ.mp3";
        }
        localStorage.setItem("reminderAudioIndex", temp);
        localStorage.setItem("reminderAudio", reminderAudio);
    }

    // Loop audio setting
    if (which == 3) {

        var temp = document.getElementById("loopSound").selectedIndex;
        console.log(temp);
        switch (temp) {
            case 0:
                loopAudio = "./media/quack.mp3";
                break;
            case 1:
                loopAudio = "./media/pop.mp3";
                break;
            case 2:
                loopAudio = "./media/champ.mp3";
        }
        localStorage.setItem("loopAudioIndex", temp);
        localStorage.setItem("loopAudio", loopAudio);
    }
}

function clink(which) {
    switch (which) {
        case 1:
            var audio = new Audio(expirationAudio)
            audio.play();
            break;
        case 2:
            var audio = new Audio(reminderAudio)
            audio.play();
            break;
        case 3:
            var audio = new Audio(loopAudio)
            audio.play();
        default:
            break;
    }
}

function hideShowPause() {

    divVis = document.getElementById("pauseClockDiv");
    // Inverts the visibility of the Pause Clock

    if (divVis.style.display == "none") {
        document.getElementById("extract").innerHTML = '<i class="fas fa-angle-right"></i>&nbsp;&nbsp;Pause Clock';
        divVis.style.display = "block";
    } else {
        document.getElementById("extract").innerHTML = '<i class="fas fa-angle-down"></i>&nbsp;&nbsp;Pause Clock';
        divVis.style.display = "none";
    }
}

var thePulse = setInterval(clockPulse, 500);

function clockPulse() {
    // Core "pulse" for the clock, runs every half-second.

    // Start by getting the current time
    rightNow = new Date().getTime();

    // If a value has been entered, but no other value has been added to the timer for 4 seconds,
    // automatically start the clock 
    if (tapWait > 0 && newtimer && rightNow - tapWait > autoDelay && autostart) {
        startStop();
    }

    // If the clock is running, do something. If continueIt is true, the clock is running.
    if (continueIt) {

        // If fromZero ISN'T set, we're counting DOWN.
        // Take endTime and subtract rightNow (the current date and time), /1000 to get the number of seconds LEFT
        if (!fromZero) {
            var temp = (endTime - rightNow) / 1000;
            currentCount = Math.floor(temp);
        }
        // If we are starting from zero, count UP
        // Take rightNow and subtract the start time, /1000 to get the number of seconds ELAPSED
        else {
            var temp = (rightNow - startTime) / 1000;
            currentCount = Math.floor(temp);
        }

        // If continueIt is NOT true, the clock is paused. Add .5 second to the start and end time AND increment pauseclock
    } else {
        endTime += 500;
        startTime += 500;

        // If this is NOT a new clock, and since the clock is paused, add a half-second to the pause clock
        if (!newtimer) {
            pauseClock += .5;

            // If the clock has been paused for less than an hour, update the clock.
            if (pauseClock < 3600) {
                updatePauseClock(1);
            } else {
                //If MORE than an hour, log the reason and reset the whole thing, bypassing the confirmation dialog box.
                message = "Paused for more than an hour";
                suffix = "";
                logIt();
                hardReset();
            }
        }
    }

    // Update the changes before proceeding
    updateIt("all");

    // If the clock has counted down below the lowest threshold allowed, stop and expire the timer
    if (currentCount < (-1 * maxMins)) {
        // First, stop  counting
        clearInterval(thePulse);

        // Next, replace the digits in the clock with EXPIRED
        var tc = document.getElementById("theClock");

        // Set background, border, text colors, and cursor of clearlog and reset buttons
        tc.innerHTML = "EXPIRED";
        tc.color = "black";
        tc.background = "grey";

        var cl = document.getElementById("clearLog").style;
        cl.background = "yellow";
        cl.border = "red";
        cl.cursor = "pointer";

        var ra = document.getElementById("resetAll").style;
        ra.background = "red";
        ra.cursor = "pointer";

        var ss = document.getElementById("startStop");
        if (autostart) {
            ss.innerHTML = "<i class='fas fa-bolt fa-lg'></i>&nbsp;&nbsp;Start";
        } else {
            ss.innerHTML = "<i class='fas fa-play fa-lg'></i>&nbsp;&nbsp;Start";
        }

        ss.style.background = "green";
        ss.style.border = "red";
        ss.style.color = "white";

        // Log that the counter expired IF this is the first time through.
        if (continueIt) {
            message = "Expired after ";
            suffix = maxMinsText
            logIt(`Expired`, 20);
        };

        // Set the flag to continue counting to false
        continueIt = false;

        // Flag that an expiration has taken place
        expiration = true;
    }
};

function updatePauseClock(onOff) {
    // If the paused clock is "on" (visible), update it accordingly
    if (onOff = 1) {
        var tempMinutes = Math.floor(pauseClock / 60);
        tempMinutes = tempMinutes.toString();
        tempMinutes = tempMinutes.padStart(2, '0');

        // Strip out the number of whole minutes from the span and put the rest in pauseDSeconds
        var tempSeconds = Math.floor(pauseClock - (tempMinutes * 60));
        tempSeconds = tempSeconds.toString();
        tempSeconds = tempSeconds.padStart(2, '0');

        // Set the document title to the paused duration
        var x = "Paused for: " + tempMinutes + ":" + tempSeconds;
        document.title = x;
        // Set the contents of the Paused Clock to the same thing
        document.getElementById("pauseClock").innerHTML = x;
    }
}

// Set the timer to a value
function setTime(timeAmt) {

    // First, confirm that:
    // 1. The clock is not already running
    // AND
    // 2. The fromZero flag is not set to 1
    // If both are true â€“ running and from zero â€“ the clock is already counting up and the buttons should not do anything.

    // if (fromZero && !newtimer) {

    // } else {
    // The timespan is passed to the function and added to the existing value of countFronm

    //tapWait grabs the current time and, if the time exceeds three seconds, it starts the clock in the core loop
    rightNow = new Date().getTime();
    tapWait = rightNow;

    // First, see whether the addStatus flag is set.
    // If it is NOT, then the end time is the digit clicked FROM RIGHT NOW
    if (!addStatus) {
        // Start by getting the current time
        endTime = rightNow + (timeAmt * 1000);
        currentCount = timeAmt;
        // If the addStatus IS set, then add the digit clicked to the currentCount
    } else {
        currentCount += timeAmt;
        endTime += (timeAmt * 1000);
    }

    // Store the original count volume to draw the pie chart
    originalCount = currentCount;

    updateIt("all");
    fromZero = false;
    previousAdd = timeAmt;
    clockMode = false;
    clockColor = "white";

    // If the timer is currently running, and an additional value is entered, log that info to the log.
    if (continueIt) {

        switch (timeAmt) {
            case 5:
                message = "5 seconds added";
                break;
            case 30:
                message = "30 seconds added";
                break;
            case 60:
                message = "1 Minute added";
                break;
            case 120:
                message = "2 Minutes added";
                break;
            case 300:
                message = "5 Minutes added";
                break;
            case 1200:
                message = "20 Minutes added";
                break;
        }
        suffix = "";
        logIt("LogAdd", 15);
    }
}

// Convert the log into a copy/paste-able version
function textizeLog() {
    textLogVisible = !textLogVisible;

    var tte = document.getElementById('theTextArea');
    if (textLogVisible) {
        tte.innerHTML = textLog;
        tte.style.display = "block";
    } else {
        tte.style.display = "none";
    }
}


function lapIt() {
    var lapTime = currentCount - previousLap;
    getHMS(lapTime);
    message = `<b>Lap @</b> ${hours}:${minutes}:${seconds}`
    textMessage = `Lap @ ${hours}:${minutes}:${seconds}`;

    suffix = "";
    logIt("Lap @", 40);

    // Store the currentCount value to be subtracted from the next lap.
    previousLap = currentCount;
}


// Reset the timer(s) but leave the log. resetPrompt specifies whether the confirmation dialog should be skipped
function resetItAll() {
    // if (!continueIt && !newtimer) { Disabling the NewTimer check because it prevents reset by the handoff function. Keeping JIC.
    if (!continueIt) {
        if (resetPrompt && currentCount > 0) {
            var r = confirm("Reset the timer?");
            if (r == true) {
                hardReset();
            }
        } else {
            hardReset();
        }
    }
}


function hardReset() {

    //Set previous values to something absurd to force a clock update
    prevCHours = 100;
    prevCMinutes = 100;
    prevCSeconds = 100;

    //Set previous minutes value to something absurd to force a clock update
    prevMinutes = 100;

    // Reset loop mode
    loopMode = false;
    oldLoop = false;

    // Reset the fromZeroTimer flag
    fromZeroTimer = false;

    // Set zeroed to 0 so that the chime can play again
    zeroed = 0;

    // Set the clock back to time-of-day mode and set the digit colors to white
    clockMode = true;
    clockColor = "white";

    // Turn the hour hand back to opaque
    document.getElementById("hourHand").setAttribute("fill", "rgba(0,0,0,1");
    setClockColor();

    // Reset the timer that starts the clock after three seconds if a button isn't pressed.
    tapWait = 0;

    // Return the background to smoky black
    document.getElementById("theClock").style.background = "rgba(0, 0, 0, .7)";

    // Hide and reset the pause clock
    document.getElementById("pauseClockDiv").display = "none";
    pauseClock = 0;

    // Log that a reset has taken place
    message = `<span style="color: rgb(220, 0, 0); font-weight: bold;">Reset - </span>`;
    suffix = '';
    logIt("Reset", 0);

    // Reset the counter
    currentCount = 0;

    // Assume, unless time is entered, that the timer will be counting UP from zero
    fromZero = true;

    // Return functionality to add time spans rather than replace them, then update button text and icon accordingly
    addStatus = true;
    updateToggleAdd()

    // Update the clock and buttons accordingly
    updateIt("all");

    updateNumberButs();

    var ss = document.getElementById("startStop");
    if (autostart) {
        ss.innerHTML = "<i class='fas fa-bolt fa-lg'></i>&nbsp;&nbsp;Auto";
    } else {
        ss.innerHTML = "<i class='fas fa-play fa-lg'></i>&nbsp;&nbsp;Start";
    }
    ss = document.getElementById("startStop").style;
    ss.background = "rgb(23, 103, 23)";
    ss.border = "rgb(13, 47, 127)";
    ss.color = "white";


    // Set background, border, text colors, and cursor of clearlog and reset buttons
    var cl = document.getElementById("clearLog");

    cl.background = "yellow";
    // cl.border = "red";
    cl.cursor = "pointer";

    var ra = document.getElementById("resetAll").style;
    ra.background = "rgb(208, 47, 47)";
    ra.cursor = "pointer";
    newtimer = true;
    expiration = false;
    document.getElementById('timerTitle').value = "";
}


function updateNumberButs() {
    // If we are counting UP, turn the number buttons grey
    var fieldsList = ["twenty", "five", "two", "one", "thirty", "fives"];
    var count = fieldsList.length;
    for (i = 0; i < count; i++) {
        if (fromZeroTimer) {
            document.getElementById(fieldsList[i]).style.background = "rgb(109, 109, 109)";
            document.getElementById(fieldsList[i]).style.borderColor = "white";
        } else {
            document.getElementById(fieldsList[i]).style.background = "rgb(47, 99, 186)";
            document.getElementById(fieldsList[i]).style.borderColor = "#007bff";
        }
    }
}

function toggleLoop() {
    loopMode = !loopMode;
    updateIt();
}

function startStopIt() {

    // If we're starting something, and fromZero is true, this is a countup timer. Flag it as such.
    if (fromZero) {
        fromZeroTimer = true;
    }

    // Update the color of the timespan buttons depending on the kind of timer (up = grey, down = blue)
    updateNumberButs();

    // Store the duration if the timer is just starting up.
    if (!oldLoop) {
        timerAmount = currentCount;
        console.log("Amount " + timerAmount);
        oldLoop = true;
    }

    // Whatever it's doing, it's not a clock so turn off clock
    clockMode = false;

    // If the timer has not expired, change things
    if (!expiration) {

        // First, Invert the status of the continueIt
        continueIt = !continueIt;

        // Then, change the colors of the clock to reflect that status, yellow digits for paused, white for running
        if (continueIt) {
            clockColor = "white";
            setClockColor();
            pauseClock = 0;

        } else {
            clockColor = "yellow";
            setClockColor();
        }
        setStatus();
    }
}

function setClockColor() {
    document.getElementById("theClock").style.color = clockColor;
}

function setStatus() {

    var ss = document.getElementById("startStop").style;
    var ra = document.getElementById("resetAll").style;
    var cl = document.getElementById("clearLog").style;

    //PAUSE STATUS-----------------------------------------------
    if (!continueIt) {
        // If paused, show the pause timer

        // Set text label of StartStop button to Resume
        document.getElementById("startStop").innerHTML = '<i class="fas fa-play"></i>&nbsp;&nbsp;Resume';

        // Set background, border, and text colors of StartStop button
        ss.background = "rgb(23, 103, 23)";

        // ss.border = "red";
        ss.color = "white";

        // Set background, border, text colors, and cursor of clearlog and reset buttons
        cl.background = "yellow";
        cl.cursor = "pointer";
        ra.background = "rgb(208 , 47, 47)";
        ra.cursor = "pointer";

        // Log the current status in the timetape window
        logIt("Paused", 40);

        //RESUME STATUS-----------------------------------------------
    } else {

        // Set background, border, and text colors of StartStop button
        document.getElementById("startStop").innerHTML = '<i class="fas fa-pause"></i>&nbsp;&nbsp;Pause';
        ss.background = "yellow";
        ss.border = "goldenrod";
        ss.color = "black";

        // Set background, border, text colors, and cursors of clearlog and reset buttons
        cl.background = "grey";
        cl.border = "darkgrey";
        cl.cursor = "not-allowed";
        ra.background = "grey";
        ra.border = "darkgrey";
        ra.cursor = "not-allowed";

        // newtimer specifies whether the timer should think of itself as starting or resuming
        // Once the timer has been started in any way, newtimer is set to false to reflect correct messaging in the log (starting vs resuming)
        if (newtimer) {
            startTime = new Date().getTime();
            endTime = startTime + (currentCount * 1000);

            // If we've started the timer, it is no longer a new timer.
            newtimer = false;

            // If fromZero is false, update the log that we are counting DOWN rather than up
            if (!fromZero) {

                makeTimeMessage();

                message = `<b>Countdown Started</b> from ${timeMessage}`;
                textMessage = `Countdown Started from ${timeMessage}`;
                suffix = "";
                logIt("Countdown", 0);

            } else {
                message = `<span style="color: rgb(15, 180, 0); font-weight: bold;">Timer Started</span>`;
                textMessage = "Timer Started";
                suffix = "";
                logIt("Countup", 0);
            }

        } else {
            message = `<span style="color: rgb(15, 180, 0); font-weight: bold;">Resumed</span>`;
            textMessage = "Resumed";
            suffix = "";
            logIt("Resumed", 20);
        }
    }
}


// Log it!
function logIt(status, padIt) {

    if (status == "title") {
        message = "Title Changed";
        suffix = "";
    }

    // Grab the name of the timer from the text field (if any)
    docTitle = document.getElementById('timerTitle').value;

    // If this is the first time a title is being entered, it should PRECEDE the existing log entries
    if (previousTitle == "" && docTitle != "") {
        var temp = document.getElementById("timeTape").innerHTML;
        document.getElementById("timeTape").innerHTML = `<h3>${docTitle}</h3>` + temp;
        previousTitle = docTitle;

        temp = textLog;
        textLog = docTitle + "\n" + temp;
    }

    // If this is not the first time a title has been entered/changed, it should just be added like any other log entry
    if (docTitle != previousTitle && docTitle != "") {
        document.getElementById("timeTape").innerHTML += `<h3>${docTitle}</h3>`;
        textLog += docTitle + '\n';
        previousTitle = docTitle;
    }

    // Grab the current date
    var today = new Date();

    // Make time meaningless
    time = "";

    // Break out hours, minutes, and seconds and pad an initial zero for single digits.
    var logHours = today.getHours()

    if (logHours > 11) {
        amPm = " pm";
    } else {
        amPm = " am";
    }

    // If hours is greater than 12 (pm), subtract 12 from the hours.
    if (logHours > 12) {
        logHours -= 12;
    }

    // If logHours =0, this means it's 12-something a.m. Manually set logHours equal to 12
    if (logHours == 0) {
        logHours = 12;
    }

    logHours = logHours.toString();
    time = logHours.padStart(2, '0');

    var logMinutes = today.getMinutes();
    logMinutes = logMinutes.toString();
    time = time + ":" + logMinutes.padStart(2, '0');

    var logSeconds = today.getSeconds();
    logSeconds = logSeconds.toString();

    time = time + ":" + logSeconds.padStart(2, '0') + amPm;


    // Depending on what kind of timer is happening (count up or count down), change verbiage in the log accordingly

    // If it's paused, 
    if (status == "Paused") {
        pausedTime = today.getTime();

        makeTimeMessage();
        // If we're NOT counting up, log "Timer paused with X remaining"
        if (!fromZero) {

            message = `<span style="color: yellow; font-weight: bold;">Paused</span> with ${timeMessage}`;
            if (plusMinus != "-") {
                textMessage = `Paused with ${timeMessage}`;
                suffix = "remaining"
            } else {
                textMessage = `Paused at ${timeMessage}`;
                suffix = "past expiration"
            }
            //padIt controls 
            padIt = 20;
            // If we ARE counting up, log "Timer paused with X remaining"
        } else {
            message = `<span style="color: yellow; font-weight: bold;">Paused</span> at ${timeMessage}`;
            textMessage = `Paused at ${timeMessage}`;

            suffix = "";
            padIt = 20;
        }
    }

    if (status == "Resumed") {
        resumedTime = today.getTime();

        // This whole section calculates how LONG the timer was paused and then creates readable digits out of that info.
        // Get the number of elapsed milliseconds and convert to seconds
        var lapsedTime = (resumedTime - pausedTime) / 1000;

        // First, get the number of hours - 3600 seconds per hour stripping away decimals
        pauseDHours = Math.floor(lapsedTime / 3600);

        // Now, subtract hours from the lapsed timespan
        lapsedTime -= (pauseDHours * 3600);

        // Now, get the number of minutes from the elapsed time and round to nearest second
        pauseDMinutes = Math.floor(lapsedTime / 60);

        // Strip out the number of whole minutes from the span and put the rest in pauseDSeconds
        pauseDSeconds = Math.floor(lapsedTime - (pauseDMinutes * 60));


        // Convert all values to strings for potentially adding a leading zero.
        pauseDMinutes = pauseDMinutes.toString();
        pauseDSeconds = pauseDSeconds.toString();
        pauseDHours = pauseDHours.toString();
        pausedDuration = "";

        // If there is a valid number of HOURS in the timespan, include it in the description along with a colon separator
        if (pauseDHours != "0") {
            pausedDuration = pauseDHours.padStart(2, '0') + ":"
        }

        // If there is a valid number of MINUTES in the timespan, include it in the description along with a colon separator
        if (pauseDMinutes != "0") {
            pausedDuration = pauseDMinutes.padStart(2, '0');
        }

        // Regardless of hours and minutes, display seconds with a colon.
        pausedDuration += ":" + pauseDSeconds.padStart(2, '0');

        // Append additional informaton to the status
        message += " after " + pausedDuration;
        textMessage += " after " + pausedDuration;
        suffix = "";
    }

    if (message != null && message.includes("Reset")) {
        makeTimeMessage();
        message += ` ${timeMessage}`;
    }


    // The first two checks for newtimer and status:
    // 1. Prevents the logging of a change of the title beyond just the title itself (i.e. no timestamp necessary)
    // 2. Allows the addition of a manual note regardless of whether the timer is running.
    // Would recommend making this more explicit
    if (message != null) {
        if (!newtimer || status == "Note") {

            //Grab a nice, fat, unique time stamp for the div as well as the JS call to delete it should that ever be needed.
            temp = new Date();
            logID = temp.getTime();

            // Grab the timer tape div
            var timeTapeDiv = document.getElementById("timeTape");

            // Create a new div
            var theEntry = document.createElement("div");

            // Assign the timestamp to the ID of the new div
            theEntry.id = logID;

            // Create a span that holds the icon and delete action
            var theSpan = document.createElement("span");

            // Populate the innerHTML with the icon
            theSpan.innerHTML = `<i class="fas fa-times-circle padicon" style="margin-left: ${padIt}; cursor: pointer;"></i>`;

            // Create the deleteLog call
            var y = `deleteLog(${logID});`;

            // Assign the deleteLog call to the onClick attribute of the span
            theSpan.setAttribute("onclick", y);

            theEntry.appendChild(theSpan);

            var secondHalf = document.createElement("span");
            secondHalf.innerHTML = `${time} ${message} ${suffix}`
            theEntry.appendChild(secondHalf);
            timeTapeDiv.appendChild(theEntry);

            localStorage.setItem("logTape", document.getElementById("timeTape").innerHTML);
            localStorage.setItem("logTapeTxt", textLog);
        }
    }
    logCounter++;
}

function deleteLog(id) {
    var x = document.getElementById(id);
    x.remove();
}

// This function takes the current timer value, either counting up or down, and hides/shows
// the various categories (hours, minutes, seconds) if they are non-zero along with colon separators
function makeTimeMessage() {
    timeMessage = ":" + seconds;

    if (minutes != "") {
        timeMessage = minutes + timeMessage;
        if (hours != "00") {
            timeMessage = hours + ":" + timeMessage;
        }
    }
    timeMessage = plusMinus + timeMessage;
}

// Manually enters a note in the log
function logANote(which) {
    if (which == 0) {
        logNoteComment = prompt("What's the note?", logNoteComment);
    } else {
        logNoteComment = "Time Noted!";
    }

    makeTimeMessage()
    if (logNoteComment != null || logNoteComment != "") {
        console.log(logNoteComment);
        status = "Note";
        message = `<b>Note:</b> ${logNoteComment} `;
        textMessage = `Note:  ${logNoteComment}`;

        // If a message is created while the app is in clock mode, don't add the time on to the end of the comment.
        if (!clockMode) {
            message += `at ${timeMessage}`;
            textMessage += `at ${timeMessage}`;
        }
        if (!newtimer) {
            var indent = 40;
        } else {
            var indent = 0;
        }
    }
    logIt(status, indent);
}

// Erases both logs
function clearLogs() {
    if (!continueIt) {
        if (logPrompt) {
            var r = confirm("Erase the log?");
        } else {
            var r = true;
        }
        if (r == true) {
            document.getElementById("timeTape").innerHTML = ``;
            document.getElementById('theTextArea').innerHTML = "";
            textLog = "";
            localStorage.setItem("logTape", "");
            localStorage.setItem("logTapeTxt", "");
        }
    }
    //Reset log counter
    logCounter = 1;
}

// Converts the currentCount value to hours, minutes, and seconds
function getHMS(timeValue) {
    hours = Math.floor(Math.abs(timeValue / 3600));
    temp = Math.abs(timeValue) - (hours * 3600);
    minutes = Math.floor(Math.abs(temp / 60));
    seconds = Math.abs(temp - (minutes * 60));

    // Add leading zeroes and colons for separators
    padTime();
}


function updateIt(upMode) {

    // Update the pause clock button status

    if (upMode == "pc" || upMode == "all") {
        divVis = document.getElementById("pauseClockDiv").style.display;

        if (divVis == "none") {
            document.getElementById("extract").innerHTML = '<i class="fas fa-angle-right"></i>&nbsp;&nbsp;Pause Clock';
        } else {
            document.getElementById("extract").innerHTML = '<i class="fas fa-angle-up"></i>&nbsp;&nbsp;Pause Clock';
        }
    }

    if (clockMode) {
        // document.getElementById("labeler").innerHTML = '<i class="fas fa-clock" id="clockAnalog"></i><img src="./assets/img/clockdigits.png" alt="" id="clockDigital">&nbsp;&nbsp;Clock';
    } else {
        // document.getElementById("labeler").innerHTML = '<i class="fas fa-hourglass"></i>&nbsp;&nbsp;Timer';
    }


    // Label the loop button according to its status.
    if (upMode == "lm" || upMode == "all") {
        if (loopMode) {
            document.getElementById("loopButton").innerHTML = "<i class='fas fa-toggle-on fa-lg'></i>&nbsp;&nbsp;Loop";
        } else {
            document.getElementById("loopButton").innerHTML = "<i class='fas fa-toggle-off fa-lg'></i>&nbsp;&nbsp;Loop";
        }
    }

    if (clockMode) {
        var today = new Date();
        // today = "Sun Aug 30 2020 09:56:56 GMT-0400 (Eastern Daylight Time)";

        if (clockColor != "rgb(200, 200, 200)") {
            console.log('Clock Color Update!');
            clockColor = "rgb(200, 200, 200)";
            setClockColor();
        }

        // Break out hours, minutes, and seconds and pad an initial zero for single digits.
        minutes = today.getMinutes();
        seconds = today.getSeconds();
        hours = today.getHours();

        // If the hour is greater than 11 (am), set the am/pm flag to pm, otherwise, am.
        if (hours > 11) {
            amPm = " pm";
        } else {
            amPm = " am";
        }

        // If hours is greater than 12 (pm), subtract 12 from the hours.
        if (hours > 12) {
            hours -= 12;
        }

        // If hours =0, this means it's 12-something a.m. Manually set hours equal to 12
        if (hours == 0) {
            hours = 12;
        }

        // Update the analog clock with the values before text processing for the numeric display
        drawAnalogClock();

        // Pad the single digits in the minutes field with a 0.
        minutes = pad(minutes);

        // Blank out the plusMinus widget
        plusMinus = "";

        document.getElementById("theClock").innerHTML = `${plusMinus} ${hours}:${minutes}<span style='font-size: 46pt'>${amPm} </span>`;


    } else {

        // We are not in clock mode, Toto
        // Don't need am/pm in timer mode
        amPm = "";

        // Convert the current count to HH:MM:SS format
        getHMS(currentCount);

        // If the timer is below zero, color the background appropriately
        // And just for safety, ensure the digits are the correct color

        var clockStyle = document.getElementById("theClock").style;
        if (currentCount < 1 && !newtimer && !fromZero) {
            clockStyle.color = clockColor;
            clockStyle.background = "red";
        } else {
            clockStyle.color = clockColor;
            clockStyle.background = "rgba(0, 0, 0, .7)";
        }

        // Tag negative values as such
        if (currentCount < 0) {
            plusMinus = "-";
        } else {
            plusMinus = "";
        }

        // If the clock is not stopped AND we are not counting up from zero, test the countdown
        if (continueIt && !fromZero) {

            // If the count has reached at, or below, zero and the clock hasn't simply been reset to zero, play the chime, and log the completion, and set zeroed to 1 so it only plays once.
            if (currentCount <= 0 && zeroed != 1) {

                // If we're in loop mode, set the chime to the loop audio file. Otherwise, use the reminder audio
                if (loopMode) {
                    audio = new Audio(loopAudio);
                    //Play that audio, yo!
                    audio.play();

                } else {
                    audio = new Audio(reminderAudio);
                    console.log("No Loop");
                    //Play that audio, yo!
                    audio.play();
                }

                // If loopMode is enabled, play the chime, but re-load the current count to start over.
                if (loopMode) {

                    // Get "right now"
                    rightNow = new Date().getTime();

                    // Make the end time of the timer rightnow + whatever the timer amount was converted to miliseconds
                    endTime = rightNow + (timerAmount * 1000);

                    // Log that a loop has taken place
                    message = `Loop of ${timerAmount} seconds completed`;
                    suffix = "";
                    console.log(message, suffix);
                    logIt();

                } else {

                    // Otherwise, message that the timer completed and flag that zero has been reached.
                    message = "Timer Completed";
                    logIt("Completed");
                    zeroed = 1;
                }
            }
        }

        //If the clock is still running, and we're below zero, chime every thirty seconds up to five times
        if (continueIt) {

            // Decrement the counter each time to help prevent double boops.
            boopCount--;

            // If the current count is at one of five values below zero AND the counter is less than or equal to zero, play the sound.
            if ((currentCount == -30 || currentCount == -60 || currentCount == -90 || currentCount == -120 ||
                currentCount == -150) && boopCount <= 0) {
                var audio = new Audio(reminderAudio);
                audio.play();

                // This value is decremented to keep the expiration chime from playing more than once within a second
                // since the core clock runs every half-second.
                boopCount = 10;
            }
        }


        // Update the clock readout
        // If the time is less than one hour, omit the digits and colon for hours.
        if (hours != "00") {
            colonedHours = hours + ":";
        } else {
            var colonedHours = "";
        }

        // Regardless of the KIND of clock this is, update the display accordingly.
        // Update the big clockface
        document.getElementById("theClock").innerHTML = plusMinus + colonedHours + minutes + ":" + seconds;

        // Render the Mondaine clock
        drawAnalogClock();

    }

    // Update the page title with the current time so that the browser tab shows the time
    if (continueIt && !newtimer) {
        document.title = plusMinus + colonedHours + minutes + ":" + seconds;
    }

    if (newtimer) {
        var ss = document.getElementById("startStop");
        if (autostart) {
            ss.innerHTML = "<i class='fas fa-bolt fa-lg'></i>&nbsp;&nbsp;Start";
        } else {
            ss.innerHTML = "<i class='fas fa-play fa-lg'></i>&nbsp;&nbsp;Start";
        }
    }

    // If this is a new timer, include the name as well as the digits.
    if (newtimer && !clockMode) {
        document.title = "TapTimer! - " + plusMinus + colonedHours + minutes + ":" + seconds;
    }

    if (clockMode) {
        // minutes = pad(minutes);
        document.title = hours + ":" + minutes + " TapTimer!";

    } // End of NOT in ClockMode
}


function drawAnalogClock(params) {

    var rotationValues = `rotate(${(hours * 30) + (minutes / 2)}, 100, 100)`
    document.getElementById("hourHand").setAttribute("transform", rotationValues);

    rotationValues = `rotate(${(minutes * 6) + (seconds / 10)}, 100, 100)`
    document.getElementById("minuteHand").setAttribute("transform", rotationValues);

    rotationValues = `rotate(${(seconds * 6)}, 100, 100)`
    document.getElementById("secondHand3").setAttribute("transform", rotationValues);
}

// These two functions add a leading 0 digit to time segments below 10
function padTime() {
    hours = pad(hours);
    minutes = pad(minutes);
    seconds = pad(seconds);
}

function pad(n) {
    if (n < 10) {
        n = '0' + n
    }
    return n;
}



// Toggles and updates whether clicking the time spans should ADD to the running clock or REPLACE the current remaining time
// Default is to ADD
function toggleAdd() {
    addStatus = !addStatus;
    updateToggleAdd();
}

function updateToggleAdd() {
    var fieldsList = ["twenty", "five", "two", "one", "thirty", "fives"];

    if (addStatus) {
        var butLabels = ["+20m", "+5m", "+2m", "+1m", "+30s", "+5s",]
        document.getElementById("checkBaxlbl").innerHTML = '<i class="fas fa-times"></i>';
    } else {

        var butLabels = ["20m", "5m", "2m", "1m", "30s", "5s",]
        document.getElementById("checkBaxlbl").innerHTML = '<i class="fas fa-plus"></i>';
    }

    for (i = 0; i < fieldsList.length; i++) {
        document.getElementById(fieldsList[i]).innerText = butLabels[i];
        if (continueIt && fromZero) {
            document.getElementById(fieldsList[i]).style.background = "rgb(109, 109, 109)";
            document.getElementById(fieldsList[i]).style.borderColor = "white";
        }
    }
}

// Undo (subtract) the last amount of time added to the clock
function undoAdd() {
    // Adding any time to the clock assumes that it will count DOWN rather than up. 
    // If the clock is at zero once the addition is undone, then the clock should be able to count up from zero.
    currentCount -= previousAdd;
    if (currentCount == 0) {
        fromZero = true;
    }
}