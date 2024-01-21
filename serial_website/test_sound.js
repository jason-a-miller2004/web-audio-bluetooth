/**
 * Contains all sound playing functionality for 
 * Web-Audio-Bluetooth Project
 */
const OSC_LENGTH = 200
const SILENCE = -100000
const SILENCE_LENGTH = 200
const START_END_BUFFER = 2000
const BASE_LENGTH = 5  //shortest length you can get sound to play is 5 ms
const osc = new Tone.Oscillator(440, "sine").toDestination();

// init Tone.js to work around browser limits
function initSound() {
  let context = (window.AudioContext || window.webkitAudioContext) ?
    new (window.AudioContext || window.webkitAudioContext)() : null;

  // Decide on some parameters
  let allowBackgroundPlayback = false; // default false, recommended false
  let forceIOSBehavior = false; // default false, recommended false
  // Pass it to unmute if the context exists... ie WebAudio is supported
  if (context)
  {
    // If you need to be able to disable unmute at a later time, you can use the returned handle's dispose() method
    // if you don't need to do that (most folks won't) then you can simply ignore the return value
    let unmuteHandle = unmute(context, allowBackgroundPlayback, forceIOSBehavior);

  }
}

function makelongsound(){
  initSound();

  Tone.start().then(() => {
  osc.start();

  const slide = document.getElementById("myRange");
  let sliderDiv = document.getElementById("sliderAmount");

  slide.oninput = function() {
    sliderDiv.innerHTML = this.value;
    osc.volume.value = this.value;
  }
  })
}

function testPlay(dbLevel, numSamples) {
    startRecord();
    setTimeout(() => stopRecord(true), recordLength * 1000);
    volumes = new Array(numSamples)
    volumes.fill(dbLevel)
    playMessage(volumes);

}

// given a string input, plays out the encoded sound
function playEncoding() {
  initSound();

  Tone.start().then(() => {
    let message = document.getElementById("textPlay").value;
    let sound_message = encodemessage(message);
    console.log(sound_message);
    playMessage(sound_message);
  });
}

function analysis(start, finish) {
  if(analyzing) {
    return;
  }
  
  analyzing = true;
  let amplitudes = [];
  amplitudes.push(SILENCE);
  for(let i = start; i <= finish; i++) {
    amplitudes.push(i);
  }

  osc.start();
  osc.mute = true;
  setTimeout(() => {
    analysisLoop(amplitudes, 0);
  }, 3000);
}

// if currently analyzing data uses the following loop to
// change sounds
function analysisLoop(amplitudes, currentAmp) {
  //init oscillator
  initSound();
  Tone.start().then(() => {
    console.log(amplitudes[currentAmp]);
    if(amplitudes[currentAmp] == SILENCE) {
      osc.mute = true;
    } else {
      osc.volume.value = amplitudes[currentAmp];
    }
      startRecord();

      setTimeout(() => {
        let data = stopRecord(false);
        analyzeRecord(amplitudes[currentAmp], data);

        currentAmp++;

        if (currentAmp < amplitudes.length){
          analysisLoop(amplitudes, currentAmp);
        } else {
          showAnalysis();
          osc.stop();
          analyzing = false;
        }
      }, analyzeLength * 1000);
  });
}

/* takes in a list of volumes to play and converts it to format to be played

EX: [-20, -20, -20] would play the following sounds
SILENCE: START_END_BUFFER ms, SOUND (-20): OSC_LENGTH, SILENCE: SILENCE_LENGTH,
SOUND (-20): OSC_LENGTH, SILENCE: SILENCE_LENGTH, SOUND (-20): OSC_LENGTH
SILENCE: START_END_BUFFER 
*/
function playMessage(volume_list){
  let i =0;
  let bufferMessage = new Array(volume_list.length * OSC_LENGTH / BASE_LENGTH + (volume_list.length - 1) * SILENCE_LENGTH / BASE_LENGTH + START_END_BUFFER * 2 / BASE_LENGTH)
  let index = 0
  for(index = 0; index < START_END_BUFFER / BASE_LENGTH; index++) {
    bufferMessage[index] = SILENCE
  }

  for(let i = 1; i < volume_list.length * 2; i++) {
    if(i % 2 == 0) {
      for(let j = 0; j < SILENCE_LENGTH / BASE_LENGTH; j++) {
        bufferMessage[index] = SILENCE
        index++
      }
    } else {
        for(let j = 0; j < OSC_LENGTH / BASE_LENGTH; j++) {
          bufferMessage[index] = volume_list[Math.floor(i / 2)];
          index++
        }
    }
  }

  while(index < bufferMessage.length) {
    bufferMessage[index] = SILENCE
    index++
  }

  arrayPlay(bufferMessage)
   
}

//stops the oscillator from making any noise
function stop() {
  osc.stop();
}

// given a formatted sound message plays the sound
function arrayPlay(bufferMessage) {
  let i = 0;
  Tone.start().then(() => {
    osc.start();

      let myInterval = setInterval( () => {
        if(i>=bufferMessage.length){
          clearInterval(myInterval);
          osc.stop();
        }
        else{
          if(bufferMessage[i] == SILENCE) {
            osc.mute = true;
          }
          else if(Math.ceil(bufferMessage[i]) != osc.volume.value) {
            osc.volume.value = Math.ceil(bufferMessage[i]);
          }
          
          i++;
        }
        },BASE_LENGTH);
  })
}


//Function to fix audio not playing bug in Tone.js
"use strict";function unmute(i,e,n){var t;function d(n,i,e,t,d){for(var o=0;o<i.length;++o)n.addEventListener(i[o],e,{capture:t,passive:d})}function o(n,i,e,t,d){for(var o=0;o<i.length;++o)n.removeEventListener(i[o],e,{capture:t,passive:d})}function a(){}void 0===e&&(e=!1),void 0===n&&(n=!1),void 0!==document.hidden?t={hidden:"hidden",visibilitychange:"visibilitychange"}:void 0!==document.webkitHidden?t={hidden:"webkitHidden",visibilitychange:"webkitvisibilitychange"}:void 0!==document.mozHidden?t={hidden:"mozHidden",visibilitychange:"mozvisibilitychange"}:void 0!==document.msHidden&&(t={hidden:"msHidden",visibilitychange:"msvisibilitychange"});var c=navigator.userAgent.toLowerCase(),u=n||0<=c.indexOf("iphone")&&c.indexOf("like iphone")<0||0<=c.indexOf("ipad")&&c.indexOf("like ipad")<0||0<=c.indexOf("ipod")&&c.indexOf("like ipod")<0||0<=c.indexOf("mac os x")&&0<navigator.maxTouchPoints,A=!0;function s(){var n=!(!e&&(t&&document[t.hidden]||u&&!document.hasFocus()));n!==A&&(A=n,b(!1),h())}function l(){s()}function r(n){n&&n.target!==window||s()}function h(){var n;A?"running"!==i.state&&"closed"!==i.state&&k&&(n=i.resume(),n&&n.then(a,a).catch(a)):"running"===i.state&&(n=i.suspend(),n&&n.then(a,a).catch(a))}function v(n){n&&n.unmute_handled||(n.unmute_handled=!0,h())}t&&d(document,[t.visibilitychange],l,!0,!0),u&&d(window,["focus","blur"],r,!0,!0),d(i,["statechange"],v,!0,!0),i.onstatechange||(i.onstatechange=v);var g=null;function m(n,i){for(var e=i;1<n;n--)e+=i;return e}var f="data:audio/mpeg;base64,//uQx"+m(23,"A")+"WGluZwAAAA8AAAACAAACcQCA"+m(16,"gICA")+m(66,"/")+"8AAABhTEFNRTMuMTAwA8MAAAAAAAAAABQgJAUHQQAB9AAAAnGMHkkI"+m(320,"A")+"//sQxAADgnABGiAAQBCqgCRMAAgEAH"+m(15,"/")+"7+n/9FTuQsQH//////2NG0jWUGlio5gLQTOtIoeR2WX////X4s9Atb/JRVCbBUpeRUq"+m(18,"/")+"9RUi0f2jn/+xDECgPCjAEQAABN4AAANIAAAAQVTEFNRTMuMTAw"+m(97,"V")+"Q==";function b(n){var i;u&&(A?n&&(g||(i=document.createElement("div"),i.innerHTML="<audio x-webkit-airplay='deny'></audio>",g=i.children.item(0),g.controls=!1,g.disableRemotePlayback=!0,g.preload="auto",g.src=f,g.loop=!0,g.load()),g.paused&&(i=g.play(),i&&i.then(a,p).catch(p))):p())}function p(){g&&(g.src="about:blank",g.load(),g=null)}var w=["click","contextmenu","auxclick","dblclick","mousedown","mouseup","touchend","keydown","keyup"],k=!1;function y(){k=!0,b(!0),h()}return d(window,w,y,!0,!0),{dispose:function(){p(),t&&o(document,[t.visibilitychange],l,!0,!0),u&&o(window,["focus","blur"],r,!0,!0),o(window,w,y,!0,!0),o(i,["statechange"],v,!0,!0),i.onstatechange===v&&(i.onstatechange=null)}}}