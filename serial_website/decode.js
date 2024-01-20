"use strict";

let decodeTotal = 0;
let decodeSize = 0;
let detectionBuffer = [];
let soundPlaying = false;

const detectionSwitch = 10.0;
const detectLength = 20; //check for 20 data points

const ENCODE = {
    "a": -10,
    "b": -9,
    "c": -8,
    "d": -7,
    "e": -6,
    "f": -5,
    "g": -4,
    "h": -3,
    "i": -2,
    "j": -1,
    " ": 0
}

const DECODE = {
    "a": 28.0,
    "b": 35.0,
    "c": 42.0,
    "d": 46.0,
    "e": 52.0,
    "f": 59.0,
    "g": 64.0,
    "h": 70.0,
    "i": 80.0,
    "j": 88.0,
    " ": 98.0
}

function encodemessage(message) {
    let sound_array = []
    for(let i = 0; i < message.length; i++) {
        sound_array.push(ENCODE[message[i]]);
    }

    console.log(sound_array);
    return sound_array;
}

function startDecipher() {
    startRecord();
    document.getElementById("decoded").textContent = "Decoded output: ";
    detectionBuffer = [];
    deciphering = true;
}

function stopDecipher() {
    stopRecord(true);
    deciphering = false;
}

function decipher(value) {
    detectionBuffer.push(value);
    if(detectionBuffer.length > detectLength) {
        detectionBuffer.shift();
        let detectRMS = rmsCalc(detectionBuffer);

        if(!soundPlaying) {
            soundPlaying = (detectRMS > detectionSwitch);

            //make sure detectionBuffer does not trigger for at least 25 values
            if(soundPlaying) {
                detectionBuffer = Array(detectLength).fill(Number.MAX_VALUE);
            }
        } else if(detectRMS < detectionSwitch) {
            soundPlaying = false;
            let decodeRMS = decodeTotal / decodeSize;
            console.log(`decode total ${decodeTotal} decode Size ${decodeSize}`)
            let letter = findLetter(decodeRMS);
            console.log("decodeRMS: " + decodeRMS + " letter: " + letter);
            let outputParagraph = document.getElementById("decoded");
            outputParagraph.textContent += letter;
            
            decodeTotal = 0;
            decodeSize = 0;
            detectionBuffer = Array(detectLength).fill(ampAdjust); //reset detectionBuffer to silence
        } else {
            decodeTotal += Math.abs(ampAdjust - value);
            decodeSize++;
        }
    }
}

function rmsCalc(buffer) {
    let RMS = 0;
        for(let i = 0; i < buffer.length; i++) {
            RMS += Math.abs(ampAdjust - buffer[i]);
        }

        RMS = RMS / buffer.length;
        return RMS;
}

function findLetter(rms) {
    let keys = Object.keys(DECODE);
    let foundLetter = false;
    let index = keys.length;
    let letter = "";
    while(index >= 0 && !foundLetter) {
        index--;
        let rmsFind = DECODE[keys[index]];
        foundLetter = rmsFind < rms;
    }

    if(foundLetter) letter = keys[index];

    return letter;
}