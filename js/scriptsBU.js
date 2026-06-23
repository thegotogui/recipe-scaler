//* Spit out a timestamp to indicate when the page was loaded. This is useful for debugging and version control purposes. *//

// Get the current date and time
const now = new Date();

// Format it as a readable string
const formatted = now.toLocaleString();

// Output to the console
console.log("Page loaded at:", formatted);

versionIt(' Master Script', "Master Script Version 18-10-25 - Added date and time stamper to indicate when the page was loaded. Version 01-03 - 25 - Added version declaration.")

// console.log(``);

function versionIt(code, versionNote) {
	console.log(`%c${code} File Version Info: 
%c${versionNote} %o`, "font-style: bold; background-color:yellow; color:black", "color:white");
}

function getObj(node) {
	return document.getElementById(node);
}

function initializeIt(pageTitle, imageSource) {
	var iconInsert = `<img src="greyholder.svg" width="50" height="50" class="d-inline-block align-top" alt="" id="pageIcon">`;

	if (pageTitle == "TapTimer") {
		iconInsert = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 384 384" width="64px" style="enable-background:new 0 0 50 50;" xml:space="preserve">
<style type="text/css">
	.backRedCircle{fill:#F85D48;}
	.clockFace{fill:#E3EDF8;}
	.minuteHand {fill: #415C6D;}
	.hourHand {fill: #415C6D;}
	.secondHand {fill: #415C6D;}
	.tickMarks{fill:#00AADF;}
	.centerCircle {fill:#415C6D;}
</style>
<circle class="backRedCircle" cx="192" cy="192" r="182"/>
<circle class="clockFace" cx="192" cy="192" r="158"/>
<path class="tickMarks" d="M197.4,70c0,0.2,0,0.5,0,0.7c-0.3,3.9-2.5,6.2-6,6.1c-3.3-0.1-5.6-2.3-5.7-6c-0.1-5.7-0.1-11.4,0-17
	c0.1-3.9,2.5-6.2,6-6.1c3.3,0.1,5.5,2.4,5.7,6c0.1,2.8,0,5.7,0,8.5C197.4,64.8,197.4,67.4,197.4,70z"/>
<path class="tickMarks" d="M312.7,197.8c-3.7-0.2-6-2.4-6-5.7c-0.1-3.5,2.2-5.9,6.1-5.9c5.7-0.1,11.4-0.1,17,0c3.7,0.1,6,2.4,6,5.6
	c0.1,3.5-2.3,5.8-6.1,6c-2.8,0.1-5.7,0-8.5,0S315.6,197.9,312.7,197.8z"/>
<path class="tickMarks" d="M185.8,328.7c-0.4-5.1-0.2-10.4-0.1-15.5c0-4.3,2.1-6.7,5.6-6.8c3.7-0.1,6,2.4,6,6.8c0.1,5.2,0.3,10.4-0.1,15.5
	c-0.2,2.2,0.2,7.1-5.7,7.1C185.6,335.8,186,330.9,185.8,328.7z"/>
<path class="tickMarks" d="M70.3,186.2c3.9,0.2,6.2,2.5,6.1,5.9c-0.1,3.3-2.3,5.6-6,5.7c-5.7,0.1-11.4,0.1-17,0c-3.9-0.1-6.2-2.5-6.1-5.9
	c0.1-3.3,2.4-5.5,6-5.7c2.8-0.1,5.7,0,8.5,0C64.6,186.2,67.4,186.1,70.3,186.2z"/>
<path class="minuteHand" id="pMinuteHand" d="M202.85,192.4h-22.56c0.45-26.98-0.48-87.04,0.04-114.09c0.12-7.93,4.96-12.86,11.97-12.63
	c6.73,0.24,11.18,5.59,10.98,13.17L202.85,192.4z"/>
<path class = "hourHand" id="pHourHand" d = "M 180 192 l 0 -84 c 0 -6 5 -11 12 -11 c 7 0 12 5 12 11 l 0 84 z"/>
<path class = "secondHand" id="pSecondHand" d = "m 198 65 v 111 H 186 v -111 c 0 -3 2 -6 6 -6 c 4 0 6 3 6 6 z"/>

<circle class="centerCircle" cx="192" cy="192" r="20"/>
</svg>`
	}

	if (pageTitle == "Weight") {
		iconInsert = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 384 384" width="64px" style="enable-background:new 0 0 384 384;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#B1EAF1;}
	.st1{fill:#26C6DA;}
	.st2{fill:#4ECFE1;}
	.st3{fill:#09ADC2;}
	.st4{fill:#FDFDFD;}
	.st5{fill:#717275;}
</style>
<g id="Scale">
	<g>
		<g>
			<path class="st0" d="M60.5,366.1c-9.6,0-17.5-5.8-17.5-15.7c0-10.9,11.4-188,12.7-196.2c2.7-15.4,16.2-27.6,31.6-28.9l206,0.3
				c7.7,0,13.5,2.7,19.1,6.9c9,7.2,13.5,16.7,14.1,28.7c0.8,16.5,11.2,173.9,11.9,187.2c0.3,3.5-0.3,6.9-2.1,9.8
				c-3.7,6.1-9,8-16.5,8H60.5z"/>
			<path class="st1" d="M88.4,125.8c10.9-0.5,194.4-0.8,205.3,0c0.5,0.8,1.6,0.8,2.4,1.3c13.5,4.8,23.1,17.8,23.6,32.1
				c0.5,9.3,11.9,190.6,11.2,194.6c-1.3,6.1-5.3,10.1-10.9,12.5c-0.5,0-260.5,0.3-260.7,0c-4.8,0-9-10.4-8.8-17.5
				c0.3-7.2,10.4-175.5,11.7-190.4c1.1-13,7.7-23.1,19.4-29.5C83.9,127.6,86,126.8,88.4,125.8z"/>
			<path class="st2" d="M366.1,25.9c-0.5,3.7-26.6,52.3-26.6,52.3c-1.1,2.4-2.7,3.2-5,3.2c-6.9-0.3-281.7-0.5-288.9-0.3
				c-2.1,0-2.4-1.3-3.2-2.7c0,0-26.8-51-26.6-52.3C132.5,25.9,249.3,25.9,366.1,25.9z"/>
			<path class="st3" d="M68.5,80.9c81.8,0,163.3,0,245.1,0c-3.5,4.8-7.2,9.6-10.6,14.3c-1.1,1.6-2.7,1.6-4.2,1.6h-80.2
				c-3.2,0-3.7,1.1-3.5,3.7c0.3,6.4,0,6.4,6.1,8c13.8,3.5,26.3,9,38,17.3c0.5,0.8,1.1,0.5,1.9,0.5c3.2,3.5,7.2,5.8,10.6,9
				c7.2,6.4,13.5,13.3,18.9,20.7c10.1,14.3,17,30,20.4,47.3c2.4,11.7,2.9,23.1,1.9,35c-1.3,16.2-5.8,31.6-13.5,45.9
				c-8.2,15.4-19.1,28.4-32.7,39c-14.1,11.2-30,18.9-47.5,23.1c-12.7,2.9-25.5,3.5-38.5,2.4c-10.6-0.8-21-2.9-31.1-6.6
				c-15.4-5.6-29.2-13.8-41.2-25s-21.5-24.2-28.4-39c-5.3-10.9-8.5-22.6-9.8-34.5c-0.8-7.2-1.3-14.6-1.1-21.8
				c0.5-14.9,3.7-29.2,9.6-43c6.9-16.2,17-30.3,30-42.2c3.2-2.9,6.6-5.8,10.4-8.2c1.1-0.5,2.1-1.1,2.4-2.4c1.3,0,2.4-0.8,3.5-1.6
				c12.2-8,25.5-13.5,39.8-16.7c2.1-0.5,2.7-1.3,2.7-3.2c0-7.4,0-7.4-7.2-7.4H83.3c-2.1,0-3.5-0.5-4.8-2.4
				C75.1,89.7,71.7,85.4,68.5,80.9z M191.1,108.3c-65.6,0-118.7,52.8-118.7,118.7c0,65.3,52.8,118.4,118.4,118.4
				c65.3,0,118.4-52.8,118.4-118.2C309.6,161.6,256.5,108.3,191.1,108.3z"/>
			<path class="st0" d="M366.1,25.9H15.6c-2.1,0-4,0-6.1,0c-4,0-6.6-2.7-6.6-6.6c0-2.1,0-4.2,0-6.4C3.1,9.2,5.3,7.1,9,6.8
				c1.1,0,360.8,0,360.8,0c7.4,0,9,1.6,9,8.8c0,1.1,0,1.9,0,2.9c0,5-2.4,7.4-7.4,7.4C369.6,25.9,367.7,25.9,366.1,25.9z"/>
			<path class="st0" d="M331.1,341.7"/>
			<path class="st3" d="M282.2,366.3c12.2,0,24.7,0,36.9,0c0,3.7,0,7.2,0,10.9c0,1.6-0.3,2.4-2.1,2.4h-32.1c-2.1,0-2.1-0.8-2.1-2.4
				L282.2,366.3z"/>
			<path class="st3" d="M62.6,366.3c12.2,0,24.7,0,36.9,0c-0.8,3.5-0.5,7.2-0.3,10.6c0,1.9-0.5,2.7-2.7,2.4c-10.6,0-21,0-31.3,0
				c-2.1,0-2.7-0.8-2.7-2.7C62.9,373.3,62.6,369.8,62.6,366.3z"/>
			<path class="st0" d="M261,125.8c-0.5-0.3-1.3,0.3-1.9-0.5c0.5,0,1.3,0,1.9,0C261,125.5,261,125.8,261,125.8z"/>
			<polygon class="st3" points="66.9,80.9 66.9,80.9 67.1,80.9 			"/>
			<path class="st4" d="M191.1,108.3c65.3,0,118.4,53.4,118.2,119c0,65.3-53.1,118.2-118.4,118.2c-65.6,0-118.7-53.1-118.4-118.4
				C72.4,161.1,125.6,108.3,191.1,108.3z"/>
			<path class="st5" d="M240,144.4c-1.9,0-3.7-1.9-2.7-3.5c2.4-4.5,4.8-8.8,7.4-13c0.8-1.3,2.1-1.6,3.5-0.8s2.1,2.1,1.3,3.5
				c-2.4,4.2-4.8,8.5-7.4,12.7C241.3,144.1,240.8,144.4,240,144.4z"/>
			<path class="st5" d="M134.3,127.4c1.3,0,2.1,0.8,2.7,1.9c2.1,3.7,4.2,7.4,6.6,11.2c0.8,1.6,0.8,3.2-0.8,4.2
				c-1.6,1.1-3.2,0.3-4-1.3c-2.1-3.7-4.5-7.7-6.6-11.4C130.9,129.5,132.2,127.4,134.3,127.4z"/>
			<path class="st5" d="M302.9,224.3c1.9,0,2.9,0.5,2.9,2.4s-1.1,2.9-2.9,2.9c-4.5,0-9,0-13.5,0c-1.6,0-2.9-1.1-2.9-2.7
				c0-1.9,1.1-2.7,2.9-2.7H302.9z"/>
			<path class="st5" d="M240.5,309.5c1.3,0,2.1,0.8,2.7,1.9c2.1,3.7,4.2,7.4,6.4,10.9c1.1,1.6,1.1,3.2-0.8,4.2s-3.2,0-4-1.6
				c-2.1-3.7-4.2-7.2-6.4-10.9C237.1,311.6,238.1,309.5,240.5,309.5z"/>
			<path class="st5" d="M194.1,332.6c0,2.1,0,4.5,0,6.6c0,1.9-1.1,3.2-2.9,3.2c-1.6,0-2.7-1.3-2.7-2.9c0-4.5,0-9,0-13.5
				c0-1.6,1.1-2.9,2.7-2.9c1.9,0,2.9,1.1,2.9,3.2C194.1,328.4,194.1,330.5,194.1,332.6z"/>
			<path class="st5" d="M187.7,114.9c0-1.9,0.8-2.9,2.7-2.9c1.9,0,2.9,1.1,2.9,2.7v13.8c0,1.6-1.1,2.9-2.9,2.7
				c-1.6,0-2.7-1.3-2.7-2.9V114.9z"/>
			<path class="st5" d="M78.8,230.4c-1.9,0-3.2-0.8-3.2-2.9c0-1.9,1.3-2.7,3.2-2.7c4.2,0,8.8,0,13,0c1.9,0,3.2,0.8,3.2,2.7
				c0,2.1-1.3,2.9-3.2,2.9H78.8z"/>
			<path class="st5" d="M93.7,286.4c-1.3,0-2.1-0.5-2.7-1.9c-0.5-1.1-0.3-2.1,0.8-2.9c4.2-2.7,8.8-5,13.3-7.7c1.3-0.8,2.4,0,3.2,1.3
				c0.8,1.1,0.8,2.4-0.3,3.2c-4.5,2.7-8.8,5.3-13.3,7.7C94.2,286.4,94,286.4,93.7,286.4z"/>
			<path class="st5" d="M135.1,327.6c-2.1,0-3.5-2.1-2.4-4l6.9-12.2c0.8-1.6,2.4-1.9,4-0.8c1.3,0.8,1.6,2.1,0.8,3.7l-6.9,12.2
				C137,327,135.9,327.6,135.1,327.6z"/>
			<path class="st5" d="M290.7,170.7c0,1.1-0.8,1.9-1.6,2.7c-3.7,2.1-7.4,4.5-11.2,6.4c-1.6,1.1-3.5,1.1-4.2-1.1
				c-1.1-1.9,0.3-2.9,1.6-4c3.7-2.1,7.4-4.2,11.2-6.4C288.6,167.2,291,168.5,290.7,170.7z"/>
			<path class="st5" d="M107.8,179.5c-0.8,1.9-1.7,2.3-3.8,1.3c-4.2-2.1-8.2-4.8-12.5-7.2c-1.3-0.8-1.9-2.1-1.1-3.7
				c0.8-1.6,2.1-1.9,3.5-1.1l12.7,7.4C107.8,176.8,108.6,177.6,107.8,179.5z"/>
			<path class="st5" d="M276.4,273.1c0.6,0.2,1.9,0.8,1.9,0.8l10.6,6.1c1.6,1.1,2.7,2.4,1.6,4.2s-2.7,1.9-4.2,0.8
				c-3.7-2.1-7.4-4.2-10.9-6.4c-1.3-0.8-2.1-1.9-1.6-3.5C274,273.9,275.8,273,276.4,273.1z"/>
			<path class="st5" d="M267.9,151.5c0,1.1-0.5,1.9-1.3,2.4c-2.7,2.7-5.6,5.6-8.2,8.5c-1.3,1.3-2.9,1.9-4.5,0.3
				c-1.3-1.3-0.8-2.9,0.5-4.2c2.9-2.9,5.8-5.8,8.8-8.8c0.8-0.8,2.1-1.3,3.2-0.8C267.6,149.4,268.1,150.2,267.9,151.5z"/>
			<path class="st5" d="M100.6,249.3c2.1-0.5,2.9,0.8,3.2,2.1c0.5,1.3-0.3,2.7-1.3,3.2c-4.5,1.3-9,2.7-13.8,3.7
				c-1.3,0.3-2.4-0.5-2.9-2.1c-0.3-1.3,0-2.7,1.3-3.2L100.6,249.3z"/>
			<path class="st5" d="M211.3,136.4c1.1-4.2,2.4-8.8,3.7-13.3c0.5-1.3,1.9-1.9,3.2-1.3s2.4,1.6,1.9,2.9c-1.1,4.5-2.4,9.3-3.7,13.8
				c-0.5,1.3-1.9,1.9-3.2,1.3C212.1,139.3,211.3,138.5,211.3,136.4z"/>
			<path class="st5" d="M168.6,136.4c0,2.4-0.5,3.5-2.1,3.7s-2.7-0.5-3.2-2.1c-1.3-4.2-2.4-8.5-3.5-12.7c-0.5-1.6,0.3-2.7,1.9-3.2
				c1.6-0.5,2.9,0,3.5,1.6C166.4,128.4,167.5,132.7,168.6,136.4z"/>
			<path class="st5" d="M281.4,247.7l13,3.7c1.3,0.5,2.1,1.6,1.6,2.9c-0.3,1.6-1.3,2.7-2.9,2.1l-13.5-3.5c-1.3-0.5-1.9-2.1-1.4-3.4
				C278.7,248,279.6,247.7,281.4,247.7z"/>
			<path class="st5" d="M269.2,301.3c0,2.1-2.1,4-4,2.7l-10.6-10.4c-0.8-0.8-0.5-2.1,0.5-3.2c0.8-0.8,2.1-1.1,2.9-0.5l10.9,10.6
				C269.2,300.8,269.2,301.3,269.2,301.3z"/>
			<path class="st5" d="M115.2,150.2c1.1,0,1.7,0.6,2.4,1.3l8.2,8c1.3,1.3,2.1,2.9,0.5,4.5c-1.1,1.1-2.9,1.2-4.5-0.3l-8.5-8.5
				c-1.1-1.1-1.3-2.1-0.8-3.5C113.1,150.5,114.1,150.2,115.2,150.2z"/>
			<path class="st5" d="M281.4,204.9c-2.1,0.3-3.2-0.5-3.5-2.1c-0.3-1.3,0.3-2.7,1.6-2.9c4.7-1.4,9-2.6,13.5-3.7
				c1.3-0.3,2.4,0.5,2.9,1.9c0.5,1.6-0.3,2.9-1.6,3.2C289.6,202.8,285.1,203.8,281.4,204.9z"/>
			<path class="st5" d="M89.2,198c3.7,1.1,8.2,2.1,12.7,3.5c1.6,0.5,2.1,1.9,1.6,3.2c-0.5,1.6-1.6,2.1-3.2,1.9
				c-4.2-1.1-8.5-2.1-12.7-3.5c-1.6-0.5-2.4-1.6-2.1-3.2C85.7,198.5,86.8,197.7,89.2,198z"/>
			<path class="st5" d="M161.7,329.4l3.7-13.3c0.5-1.6,1.9-1.9,3.5-1.6c1.3,0.5,2.1,1.6,1.9,2.9l-3.5,13c-0.5,1.6-1.4,2.2-3.2,1.9
				S161.2,331.3,161.7,329.4z"/>
			<path class="st5" d="M213.2,317.8c-0.6-2.1,0.5-3.2,2.1-3.7c1.3-0.3,2.7,0.5,2.9,1.9c1.3,4.2,2.7,8.8,3.7,13
				c0.5,1.6-0.5,2.7-1.9,3.2c-1.6,0.5-2.9-0.3-3.2-1.6L213.2,317.8z"/>
			<path class="st5" d="M116.8,305.8c-1.3,0-2.1-0.5-2.7-1.3c-0.8-1.1-0.8-2.2,0.3-3.2l9.6-9.6c1.1-1.1,2.4-1.1,3.5,0
				c1.1,1.1,1.6,2.4,0.5,3.5l-10.4,10.4C117.6,305.5,117.2,305.8,116.8,305.8z"/>
		</g>
	</g>
	<circle class="st0" cx="190.6" cy="227.7" r="76.7"/>
</g>
<g id="Dial">
	<path class="st5" d="M185,253c-1.6,0-1.9-0.5-1.6-2.1c0.5-3.2,0.8-6.6,1.6-10.1c0.3-1.6,0-2.4-1.3-3.5c-7.7-5.6-7.2-15.9,0.8-21
		c1.3-0.8-0.8-1.9-0.8-3.2c0.5-11.7,0.8-74.1,0.8-74.1H198c0,0,0.3,62.7,0.8,74.1c0,1.6-2.1,2.4-0.8,3.2c8.2,5,8.5,15.4,0.8,21
		c-1.3,1.1-1.6,1.9-1.3,3.5c0.5,3.2,0.8,6.6,1.6,10.1c0.3,1.6,0,2.1-1.6,2.1H185z"/>
</g>
</svg>`
	}

	weightIcon = `<img class="icon" src="./app_icons/scale.svg" width="30px;" style="cursor: pointer;"></img>`;

	document.getElementById("navHead").innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark" style="padding:8px; display: flex; align-items: center; background-color: #2C3E50 !important;">
        <a class="navbar-brand" style="padding-left: 15px;" href="index.html">
        ${iconInsert}         
            <span id="pageTitle" class="pageTitle" style="font-family: 'Helvetica', sans-serif; font-size: 2.2rem; color: #F8F9FA;">Pasta/Protein Calculator</span>
        </a>

        <div class="jumpButtons">
            <div class="icons" onclick="linkJump(1)"><img class="icon" src="./app_icons/piechart.svg" width="30px;"
                    style="cursor: pointer;"></div>
            <div class="icons" onclick="linkJump(2)">${weightIcon}
            </div>
            <div class="icons" onclick="linkJump(3)"><img class="icon" src="./app_icons/martini.svg" width="30px;" style="cursor: pointer;">
            </div>
            <div class="clockicons" onclick="linkJump(4)">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 384 384" style="height:32px; width:auto; enable-background:new 0 0 30 30;" xml:space="preserve">
<style type="text/css">
	.backRedCircle{fill:#F85D48;}
	.clockFace{fill:#E3EDF8;}
	.minuteHand {fill: #415C6D;}
	.hourHand {fill: #415C6D;}
	.secondHand {fill: #415C6D;}
	.tickMarks{fill:#00AADF;}
	.centerCircle {fill:#415C6D;}
</style>
<circle class="backRedCircle" cx="192" cy="192" r="182"/>
<circle class="clockFace" cx="192" cy="192" r="158"/>
<path class="tickMarks" d="M197.4,70c0,0.2,0,0.5,0,0.7c-0.3,3.9-2.5,6.2-6,6.1c-3.3-0.1-5.6-2.3-5.7-6c-0.1-5.7-0.1-11.4,0-17
	c0.1-3.9,2.5-6.2,6-6.1c3.3,0.1,5.5,2.4,5.7,6c0.1,2.8,0,5.7,0,8.5C197.4,64.8,197.4,67.4,197.4,70z"/>
<path class="tickMarks" d="M312.7,197.8c-3.7-0.2-6-2.4-6-5.7c-0.1-3.5,2.2-5.9,6.1-5.9c5.7-0.1,11.4-0.1,17,0c3.7,0.1,6,2.4,6,5.6
	c0.1,3.5-2.3,5.8-6.1,6c-2.8,0.1-5.7,0-8.5,0S315.6,197.9,312.7,197.8z"/>
<path class="tickMarks" d="M185.8,328.7c-0.4-5.1-0.2-10.4-0.1-15.5c0-4.3,2.1-6.7,5.6-6.8c3.7-0.1,6,2.4,6,6.8c0.1,5.2,0.3,10.4-0.1,15.5
	c-0.2,2.2,0.2,7.1-5.7,7.1C185.6,335.8,186,330.9,185.8,328.7z"/>
<path class="tickMarks" d="M70.3,186.2c3.9,0.2,6.2,2.5,6.1,5.9c-0.1,3.3-2.3,5.6-6,5.7c-5.7,0.1-11.4,0.1-17,0c-3.9-0.1-6.2-2.5-6.1-5.9
	c0.1-3.3,2.4-5.5,6-5.7c2.8-0.1,5.7,0,8.5,0C64.6,186.2,67.4,186.1,70.3,186.2z"/>
<path class="minuteHand" id="hMinuteHand" d="M202.85,192.4h-22.56c0.45-26.98-0.48-87.04,0.04-114.09c0.12-7.93,4.96-12.86,11.97-12.63
	c6.73,0.24,11.18,5.59,10.98,13.17L202.85,192.4z"/>
<path class = "hourHand" id = "hHourHand" d = "M 180 192 l 0 -84 c 0 -6 5 -11 12 -11 c 7 0 12 5 12 11 l 0 84 z"/>
<path class = "secondHand" id = "hSecondHand" d = "m 195 65 v 111 H 187 v -111 c 0 -2.5 1.5 -4 4 -4 c 2.5 0 4 1.5 4 4 z"/>

<circle class="centerCircle" cx="192" cy="192" r="20"/>
</svg>
            </div>
            <div class="icons" onclick="linkJump(5)"><img class="icon" src="./app_icons/NaCl.svg" width="30px;"
                    style="cursor: pointer;"></div>
            <div class="icons" onclick="linkJump(6)"><img class="icon" src="./app_icons/conversions.svg" width="30px;"
                    style="cursor: pointer;"></div>
            <div class="icons" onclick="linkJump(7)"><img class="icon" src="./app_icons/butter.svg" width="30px;" style="cursor: pointer;">
            </div>
            <div class="icons" onclick="linkJump(8)"><img class="icon" src="./app_icons/flavor4.svg" width="30px;" style="cursor: pointer;">
            </div>
            <div class="icons" onclick="linkJump(9)"><img class="icon" src="./app_icons/recipeCard.svg" width="30px;" style="cursor: pointer;">
            </div>
            <div class="icons" onclick="linkJump(10)"><img class="icon" src="./app_icons/rationer.svg" width="30px;" style="cursor: pointer;">
            </div>
            <div class="icons" onclick="linkJump(11)"><img class="icon" src="./app_icons/adjuster.svg" width="30px;" style="cursor: pointer;">
            </div>
        </div>

        <div class="dropdown" style="margin: 0px 15px 0px auto; text-align: end;">
        </div>
    </nav>`;


	document.getElementById("pageTitle").innerHTML = pageTitle;

	// Test to see if there is a pageIcon present on the page. If not, it means we're in the timer module which brings its own icon with it. So don't set it.
	if (document.getElementById("pageIcon")) {
		document.getElementById("pageIcon").src = imageSource;
	}
}

function linkJump(which) {
	console.log(which);
	switch (which) {
		case 1:
			window.open("./scaler.html", '_blank').focus();
			break;

		case 2:
			window.open("./weight.html", '_blank').focus();
			break;

		case 3:
			window.open("./tinicalc.html", '_blank').focus();
			break;

		case 4:
			window.open("./taptimer.html", '_blank').focus();
			break;

		case 5:
			window.open("./saltratio.html", '_blank').focus();
			break;

		case 6:
			window.open("./newconversions.html", '_blank').focus();
			break;

		case 7:
			window.open("./butter.html", '_blank').focus();
			break;

		case 8:
			window.open("./flavor.html", '_blank').focus();
			break;

		case 9:
			window.open("./recipeCard.html", '_blank').focus();
			break;

		case 10:
			window.open("./rationer.html", '_blank').focus();
			break;

		case 11:
			window.open("./adjuster.html", '_blank').focus();
			break;

		default:
			break;
	}
}

setInterval(() => {
	let rightNow = new Date();
	let hours = rightNow.getHours();
	let minutes = rightNow.getMinutes();
	let seconds = rightNow.getSeconds();

	if (hours > 12) {
		hours -= 12;
	}

	// If logHours =0, this means it's 12-something a.m. Manually set logHours equal to 12
	if (hours == 0) {
		hours = 12;
	}

	// * Rotate the clock hands
	// Hours
	// let rotationValuesH, rotationValuesM, rotationValuesS;

	// We're assuming that in all cases, the icon version of the clock is present, so we're going
	// to go ahead and do the math(s) and update the parts
	let rotationValuesH = `rotate(${(hours * 30) + (minutes / 2)}, 192, 192)`
	let rotationValuesM = `rotate(${(minutes * 6) + (seconds / 10)}, 192, 192)`
	let rotationValuesS = `rotate(${(seconds * 6)}, 192, 192)`
	if (document.getElementById("hHourHand")) {
		document.getElementById("hHourHand").setAttribute("transform", rotationValuesH);
		document.getElementById("hMinuteHand").setAttribute("transform", rotationValuesM);
		document.getElementById("hSecondHand").setAttribute("transform", rotationValuesS);
	}
	// This might or might not be the timer page so, if the large icon is present, update it.
	if (document.getElementById("pHourHand")) {
		document.getElementById("pHourHand").setAttribute("transform", rotationValuesH);
		document.getElementById("pMinuteHand").setAttribute("transform", rotationValuesM);
		document.getElementById("pSecondHand").setAttribute("transform", rotationValuesS);
	}
}
)
