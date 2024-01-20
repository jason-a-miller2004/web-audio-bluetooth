#include <limits.h>

//constants
const double detectionSwitch = 10.0;
const int detectLength = 20;
const uint16_t ampAdjust = 244;

//global variables
uint16_t detectionBuffer[detectLength];
int decodeTotal = 0;
int detectionSize = 0;
int decodeSize = 0;
int detIndex = 0;
bool soundPlaying = false;

//method declarations
char decode(double value);
void decipher(uint16_t soundVal);
void resetDecipher();
double rmsCalc(uint16_t buffer[], int size);

void setup() {
  Serial.begin(115200);

}

void loop() {
  // read the analog / millivolts value for pin 2:
  uint16_t analogValue = analogRead(A2);

  if(analogValue > 10) decipher(analogValue);
  else resetDecipher();

  char str[6];
  sprintf(str, "%04d\n", analogValue);
  Serial.print(str);
}

void resetDecipher() {
  detectionSize = 0;
  detIndex = 0;
  decodeSize = 0;
}

void decipher(uint16_t soundVal) {
  detectionBuffer[detIndex] = soundVal;
  detIndex++;
  detectionSize++;

  if(detIndex == detectLength) detIndex = 0;

  //entry condition to check that our program has enough data points to start
  if(detectionSize > detectLength) {
    detectionSize--;

    double detectRMS = rmsCalc(detectionBuffer, detectLength);

    if(!soundPlaying) {
      soundPlaying = (detectRMS > detectionSwitch);
      if(soundPlaying) {
        //make sure detection buffer isnt triggered for at least detectLength vals
        for(int i = 0; i < detectLength; i++) {
          detectionBuffer[i] = UINT16_MAX;
        }
      }
    } 
    
    else if(detectRMS < detectionSwitch) {
      soundPlaying = false;
      double decodeRMS = (double)decodeTotal / (double)decodeSize;
      char letter = decode(decodeRMS);
      Serial.println(letter);
      
      decodeSize = 0;
      decodeTotal = 0;

      for(int i = 0; i < detectLength; i++) {
        detectionBuffer[i]= ampAdjust;
      }
    } 
    
    else {
      if(decodeTotal < INT_MAX) {
        int diff = (int) ampAdjust - soundVal;
        decodeTotal += abs(diff);
        decodeSize++;
      } else {
        Serial.println("overflow");
      }
    }
  } 
}

double rmsCalc(uint16_t buffer[], int size) {
  double RMS = 0;
  for(int i = 0; i < size; i++) {
    int r = ampAdjust - buffer[i];
    r = abs(r);
    RMS += (double) r;
  }

  RMS = RMS / size;
  return RMS;
}

char decode(double value) {
  if(value > 100) return 'k';
  else if(value > 88) return 'j';
  else if(value > 80) return 'i';
  else if(value > 70) return 'h';
  else if(value > 65) return 'g';
  else if(value > 59) return 'f';
  else if(value > 52) return 'e';
  else if(value > 46) return 'd';
  else if(value > 42) return 'c';
  else if(value > 35) return 'b';
  else if(value > 28) return 'a';
}