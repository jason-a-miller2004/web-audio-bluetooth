function makesound(){
  //create a synth and connect it to the main output (your speakers)
  const synth = new Tone.Synth().toDestination();

  //play a middle 'C' for the duration of an 8th note
  synth.triggerAttackRelease("C5", "8n");
}

function makemoresound(){
  const synth = new Tone.Synth().toDestination();
  const now = Tone.now()
  synth.triggerAttackRelease("C4", "8n", now)
  synth.triggerAttackRelease("E4", "8n", now + 0.5)
  synth.triggerAttackRelease("G4", "8n", now + 1)
}




