void setup() {
  // initialize serial communication at 115200 bits per second:
  Serial.begin(115200);

}

void loop() {
  // read the analog / millivolts value for pin 2:
  uint16_t analogValue = analogRead(A2);
  char str[6];
  sprintf(str, "%04d\n", analogValue);
  Serial.print(str);
}