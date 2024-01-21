/**
 * Receives input from microcontroller in Web-Audio-Bluetooth project
 * Provides support for a serial plotter, recording data, recording analysis
 * as well as various helper functions
 */

"use strict";

// all possible data operations
let recording = false;
let plotting = false;
let analyzing = false;
let deciphering = false;

// record global variables and consts
const recordLength = 10; // in seconds
let recordData = [];

// serial plotter global vars and consts
const serialPlotLength = 500; // amount of data per frame
const serialPlotterUpdate = 50; // in ms
let pauseSerialPlot = false;
let serialPlotData = [];

// analysis global vars and consts
const analyzeLength = 5; // in seconds
const snipLength = 100;
const ampAdjust = 244; // center of data
let tableData = [];

window.addEventListener("load", init);

// Opens web serial connection on load
function init() {
    document.querySelector("#connect").addEventListener('click', async () => {
        const port = await navigator.serial.requestPort();
        try {
            // Wait for the serial port to open.
            document.getElementById("serialConnect").style.visibility = "visible";
            document.getElementById("start").style.visibility = "hidden";
            await port.open({ baudRate: 115200 }); 
        }
        catch {
            console.log("Could not connect to port")
        }

        while (port.readable) {
            const textDecoder = new TextDecoderStream();
            port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable
                .pipeThrough(new TransformStream(new LineBreakTransformer()))
                .getReader();
            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        // Allow the serial port to be closed later.
                        reader.releaseLock();
                        break;
                    }
                    if (value) {
                        processValue(value);
                    }
                }
            } 
            catch (error) {
                console.log("read error: " + error);
            }
        }
    });
}

// value handling function
function processValue(value) {
    let val = parseInt(value);
    if(isNaN(val)) {
        console.log(`microcontroller output: ${value}`);
    } else {
        if(recording) record(value);
        if(plotting) addToPlot(value);
        if(deciphering) decipher(value);
    }    
}

// starts recording
function startRecord() {
    console.log("starting record");
    recordData = [];
    recording = true;
}

// ends recording
// returns array of data
function stopRecord(visible) {
    console.log("stopping record");
    recording = false;
    if(visible) {
        visualizeRecord(recordData);
    }

    return recordData;
} 

// helper function to see noise in sound signal when no sound is playing
function calcAvgNoise() {
    startRecord();
    setTimeout(() => {
        let arr = stopRecord(false);
        console.log(arr);
        let avg = 0;
        for(let i = 0; i < arr.length; i++) {
            avg += arr[i];
        }
        console.log(avg / arr.length);
    }, 500);
}

//creates visual graph of recording that we just took
function visualizeRecord(data) {
    console.log(data);
    let TESTER = document.getElementById('tester');
    TESTER.innerHTML = "";
    TESTER.style.visibility = 'visible';
    let x = [];
    for (let i = 0; i < data.length; i++) {
        x.push(i);
    }
	Plotly.newPlot( TESTER, [{
	x: x,
	y: data,
    mode: 'lines',
    type: 'scatter'}],
    {
        title: "Recorded Audio Data" ,
        xaxis: {
            title: 'Audio Sample Number'
        },
        yaxis: {
            title: 'Audio Sample Value'
        }
    });
}

// given recorded data analyzes and provides stats
// adds it to analysisTable
function analyzeRecord(dbLevel, data) {
    console.log("analyzing: " + dbLevel + "db");
    let RMS = 0;
    let snipAvg = 0;
    let snips = [];
    let startRead = 2000;
    //shifted over 2000 to account for lag in serial writing
    //e.g still writing from previous dblevel when recording starts
    for(let i = startRead; i < data.length; i++) {
        if(i % (snipLength) == 0 && i != startRead) {
            snipAvg = snipAvg / snipLength;
            snips.push(snipAvg);
            snipAvg = 0;
        }
        snipAvg += Math.abs(ampAdjust - data[i]);
    }

    let snipLow = Math.min.apply(null, snips);
    let snipHigh = Math.max.apply(null, snips);

    RMS = rmsCalc(data);
    let snr = 0;
    if(tableData.length > 0) snr = RMS / tableData[0].RMSAvg;
    tableData.push(
        {   DBLevel: dbLevel,
            SNR: snr,
            RMSAvg: RMS,
            RMSLow: snipLow,
            RMSHigh: snipHigh,
            SNIPS: snips
        });
}

// shows plot of analysis
// downloads copy of analysis data to computer
function showAnalysis() {
    console.log("showing analysis");
    tableData.shift();
    let dbLevel = tableData.map(a => a.DBLevel);
    let snr = tableData.map(a => a.SNR);
    let snips = tableData.map(a => a.SNIPS);
    document.getElementById("dataAnalysis").style.visibility = "visible";

    let csv = csvMaker(tableData);
    download(csv);

    let snrAnalysis = document.getElementById("snrAnalysis");
    Plotly.newPlot(snrAnalysis, [{
        x: dbLevel,
        y: snr,
        mode: 'markers',
        type: 'scatter'}], 
        {
            title: "dbLevel v SNR" ,
            xaxis: {
                title: 'DB Level'
            },
            yaxis: {
                title: 'SNR Value'
            }
        });

    let rmsAnalysis = document.getElementById("rmsAnalysis");
    let data = []
    for(let i = 0; i < dbLevel.length; i++) {
        console.log(dbLevel[i] + " db level snips: " + snips[i].length);
        let dbs = Array(snips[i].length).fill(dbLevel[i]);
        let trace = {
            x: dbs,
            y: snips[i],
            mode: 'markers',
            type: 'scatter'
        };

        data.push(trace);
    }

    var layout = {
        showlegend: false,
        title:'Data Labels Hover',
        xaxis: {
            title: 'DB Level'
        },
        yaxis: {
            title: 'RMS Value'
        }
    }

    Plotly.newPlot(rmsAnalysis, data, layout);
      
    tableData = [];
}

// pauses serial
function pauseSerial() {
    pauseSerialPlot = !pauseSerialPlot;
}

// turns on and off serial plotter render
function toggleSerialPlotter() {
    if(plotting) {
        plotting = false;
    } else {
        plotting = true;
        let plotter = document.getElementById('serialPlotter');
        plotter.style.visibility = 'visible';
        let chart = new CanvasJS.Chart("serialPlotter", {
            title :{
                text: "Serial Plotter"
            },
            data: [{
                type: "line",
                dataPoints: serialPlotData
            }]
        });

        let serialUpdate = setInterval(() => {
            if(!pauseSerialPlot) {
                chart.render();
            }
            if(!plotting) {
                serialPlotData = [];
                document.getElementById('serialPlotter').innerHTML = "";
                clearInterval(serialUpdate);
            }
        }, serialPlotterUpdate);
    }
}

// adds data to serial plotter
function addToPlot(value) {
    if(serialPlotData.length != 0) {
        let prev = serialPlotData[serialPlotData.length - 1];
        let xVal = prev.x + 1;
        let yVal = Number(value);
        serialPlotData.push({x: xVal, y: yVal});

        if(serialPlotData.length > serialPlotLength) {
            serialPlotData.shift();
        }
    } else {
        serialPlotData.push({x: 0, y: Number(value)});
    }
}

// stores sound data into an array
function record(value) {
    recordData.push(value);
    if(recordData.length > 10000000) {
        recordData.shift();
    }
}

// helper function that returns a csv formatted string given
// given an array of data
function csvMaker(data) {  
    // Empty array for storing the values 
    let csvRows = []; 
  
    // Headers is basically a keys of an 
    // object which is id, name, and 
    // profession 
    let headers = Object.keys(data[0]);
    
    //dont want to include array
    headers.pop();
    // As for making csv format, headers  
    // must be separated by comma and 
    // pushing it into array 
    csvRows.push(headers.join(',')); 
  
    // Pushing Object values into array 
    // with comma separation
    for(let i = 0; i < data.length; i++) {
        let values = Object.values(data[i]);
        values.pop();
        values = values.join(",");
        csvRows.push(values);
    }
  
    // Returning the array joining with new line  
    return csvRows.join('\n') 
}

// given a csv formatted string downloads it to your computer
function download(data) { 
  
    // Creating a Blob for having a csv file format  
    // and passing the data with type 
    const blob = new Blob([data], { type: 'text/csv' }); 
  
    // Creating an object for downloading url 
    const url = window.URL.createObjectURL(blob) 
  
    // Creating an anchor(a) tag of HTML 
    const a = document.createElement('a') 
  
    // Passing the blob downloading url  
    a.setAttribute('href', url) 
  
    // Setting the anchor tag attribute for downloading 
    // and passing the download file name 
    a.setAttribute('download', 'serialAnalysis.csv'); 
  
    // Performing a download with click 
    a.click() 
} 

// helper class to process input serial stream
class LineBreakTransformer {
    constructor() {
      // A container for holding stream data until a new line.
      this.chunks = "";
    }
  
    transform(chunk, controller) {
      // Append new chunks to existing chunks.
      this.chunks += chunk;
      // For each line breaks in chunks, send the parsed lines out.
      const lines = this.chunks.split("\n");
      this.chunks = lines.pop();
      lines.forEach((line) => controller.enqueue(line));
    }
  
    flush(controller) {
      // When the stream is closed, flush any remaining chunks out.
      controller.enqueue(this.chunks);
    }
}