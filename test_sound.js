function makesound(){
  var slide = document.getElementById("myRange");
  var sliderDiv = document.getElementById("sliderAmount");

  //create a synth and connect it to the main output (your speakers)
  const synth = new Tone.Synth().toDestination();
  synth.volume.value = slide.value;

  slide.oninput = function() {
    sliderDiv.innerHTML = this.value;
    synth.volume.value = this.value;
  }
  
  //play a middle 'C' for the duration of an 8th note
  synth.triggerAttackRelease("C5", "1n");
}


function makemoresound(){
  const synth = new Tone.Synth().toDestination();
  const now = Tone.now()
  
  synth.triggerAttackRelease("C4", "8n", now)
  synth.triggerAttackRelease("E4", "8n", now + 0.5)
  synth.triggerAttackRelease("G4", "8n", now + 1)
}

const osc = new Tone.Oscillator(440, "sine").toDestination();
function makelongsound(){
  osc.start();

  var slide = document.getElementById("myRange");
  var sliderDiv = document.getElementById("sliderAmount");

  slide.oninput = function() {
    sliderDiv.innerHTML = this.value;
    osc.volume.value = this.value;
  }
}

function stop(){
  osc.stop();
}






