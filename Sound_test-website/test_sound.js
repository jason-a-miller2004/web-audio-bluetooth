function PlaySound(){
  //create a synth and connect it to the main output (your speakers)
  const synth = new Tone.Synth().toDestination();
  
  //play a middle 'C' for the duration of an 8th note
  synth.triggerAttackRelease("C5", "8n");
}

function PlayMoreSound(){
  const synth = new Tone.Synth().toDestination();
  const now = Tone.now()
  
  synth.triggerAttackRelease("C4", "8n", now)
  synth.triggerAttackRelease("E4", "8n", now + 0.5)
  synth.triggerAttackRelease("G4", "8n", now + 1)
}

const osc = new Tone.Oscillator(440, "sine").toDestination();

function PlayLongSound(){
  osc.start();

  const slide = document.getElementById("myRange");
  var sliderDiv = document.getElementById("sliderAmount");

  slide.oninput = function() {
    sliderDiv.innerHTML = this.value;
    osc.volume.value = this.value;
  }
}

function Stop(){
  osc.stop();
}

const ref_table = {
  A : -80,
  B : -78,
  C : -77,
  D : -76,
  E : -75,
  F : -74,
  G : -73,
  H : -72,
  I : -71,
  J : -70,
  K : -69,
  L : -68,
  M : -67,
  N : -66,
  O : -65,
  P : -64,
  Q : -63,
  R : -62,
  S : -61,
  T : -60,
  U : -59,
  V : -58,
  W : -57,
  X : -56,
  Y : -55,
  Z : -54,
  a : -53,
  b : -52,
  c : -51,
  d : -50,
  e : -49,
  f : -48,
  g : -47,
  h : -46,
  i : -45,
  j : -44,
  k : -43,
  l : -42,
  m : -41,
  n : -40,
  o : -39,
  p : -38,
  q : -37,
  r : -36,
  s : -35,
  t : -34,
  u : -33,
  v : -32,
  w : -31,
  x : -30,
  y : -29,
  z : -28,
  " " : -27,
  "!" : -26,
  "?" : -25,
  "." : -24,
  "," : -23,
  "\n" : -22,
  "" : -21
};

function PlayMessage(volume_list){
  let i =0;
  osc.volume.value = -100;
  osc.start();

  let myInterval = setInterval( () => {
    if(i>=volume_list.length){
      clearInterval(myInterval);
      osc.stop();
    }
    else{
      osc.volume.value = Math.ceil(volume_list[i]);
      i++;
    }
    },50);
    
}

function PlayCustomMessage(){
  let Message = document.getElementById("Cmessage").value;
  let Secret_length = Message.length * 2;
  const Secret_message = new Array(Secret_length+10);
  Secret_message.fill(-100);
  let j = 0;
  Secret_message[1] = -21;
  Secret_message[2] = -21;
  Secret_message[3] = -21;
  Secret_message[4] = -21;
  Secret_message[5] = -21;
  Secret_message[6] = -21;
  Secret_message[7] = -21;
  for(let i = 10; i < Secret_message.length; i+=2){
    Secret_message[i] = ref_table[Message[j]];
    j++;
  }
  PlayMessage(Secret_message);
}

let osc2 = new Tone.Oscillator(440, "sine").toDestination();
function PlayDiffFreq(){
  osc2.volume.value = -50;
  console.log()
  osc2.start();
}

function FreqStop(){
  osc2.stop();
}