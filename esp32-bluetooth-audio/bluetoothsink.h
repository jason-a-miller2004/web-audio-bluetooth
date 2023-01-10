char bluetooth_media_title[255];
bool f_bluetoothsink_metadata_received = false;

cbuf circBuffer(1024 * 24);

#define BUFFSIZE 32 
uint8_t mp3buff[BUFFSIZE];

void avrc_metadata_callback(uint8_t data1, const uint8_t *data2) {
    Serial.printf("AVRC metadata rsp: attribute id 0x%x, %s\n", data1, data2);
    if (data1 == 0x1) { // Title
        strncpy(bluetooth_media_title, (char *)data2, sizeof(bluetooth_media_title) - 1);
    } else if (data1 == 0x2) {
        strncat(bluetooth_media_title, " - ", sizeof(bluetooth_media_title) - 1);
        strncat(bluetooth_media_title, (char *)data2, sizeof(bluetooth_media_title) - 1);
        f_bluetoothsink_metadata_received = true;
    }
}

void handle_stream() {
  if (circBuffer.available()) { 
      int bytesRead = circBuffer.read((char *)mp3buff, BUFFSIZE);
      // If we didn't read the full 32 bytes, that's a worry
      // if (bytesRead != BUFFSIZE) Serial.printf("Only read %d bytes from  circular buffer\n", bytesRead);
  }
}

uint32_t sum = 0;
uint32_t vol = 0;
int flag = 0;
int n = 0;
int MS = 0;
void read_data_stream(const uint8_t *data, uint32_t length) {
  int16_t *samples = (int16_t*) data;
  uint32_t sample_count = length/2;
  if (circBuffer.room() > length) { // If we get -1 here it means nothing could be read from the stream
    if (sample_count > 0) { // Add them to the circular buffer
      // circBuffer.write((char *)data, length); // length seems to be 4096 every time

      for(int i=0;i<length;i+=2){
        sum += (samples[i] * samples[i]);
      }
      // Serial.println(sum/sample_count);
      MS = sum/sample_count;
            
      // n=11 works at 300ms for timing, may need to change when getting to shorter ms
      // n=2 works at 45ms
      //n=4 at 90ms
      if(MS > 0){
        if(MS >= vol){
          vol = MS;
          if(vol >= 2164251){
            vol = 2160000;
          }
          flag = 1;
        }
      }
      else{
        if(flag == 0){
          vol = 0;
          flag = 0;
        }
        else{
          if(vol <= 2){Serial.print("A");}
          else if(vol <= 3){Serial.print("B");}
          else if(vol <= 4){Serial.print("C");}
          else if(vol <= 5){Serial.print("D");}
          else if(vol <= 7){Serial.print("E");}
          else if(vol <= 9){Serial.print("F");}
          else if(vol <= 12){Serial.print("G");}
          else if(vol <= 15){Serial.print("H");}
          else if(vol <= 19){Serial.print("I");}
          else if(vol <= 24){Serial.print("J");}
          else if(vol <= 31){Serial.print("K");}
          else if(vol <= 40){Serial.print("L");}
          else if(vol <= 50){Serial.print("M");}
          else if(vol <= 64){Serial.print("N");}
          else if(vol <= 82){Serial.print("O");}
          else if(vol <= 103){Serial.print("P");}
          else if(vol <= 130){Serial.print("Q");}
          else if(vol <= 180){Serial.print("R");}
          else if(vol <= 225){Serial.print("S");}
          else if(vol <= 275){Serial.print("T");}
          else if(vol <= 332){Serial.print("U");}
          else if(vol <= 475){Serial.print("V");}
          else if(vol <= 600){Serial.print("W");}
          else if(vol <= 750){Serial.print("X");}
          else if(vol <= 900){Serial.print("Y");}
          else if(vol <= 1100){Serial.print("Z");}
          else if(vol <= 1500){Serial.print("a");}
          else if(vol <= 1800){Serial.print("b");}
          else if(vol <= 2400){Serial.print("c");}
          else if(vol <= 3000){Serial.print("d");}
          else if(vol <= 3800){Serial.print("e");}
          else if(vol <= 4800){Serial.print("f");}
          else if(vol <= 6100){Serial.print("g");}
          else if(vol <= 7650){Serial.print("h");}
          else if(vol <= 9684){Serial.print("i");}
          else if(vol <= 12000){Serial.print("j");}
          else if(vol <= 15500){Serial.print("k");}
          else if(vol <= 18000){Serial.print("l");}
          else if(vol <= 24000){Serial.print("m");}
          else if(vol <= 30000){Serial.print("n");}
          else if(vol <= 38000){Serial.print("o");}
          else if(vol <= 48500){Serial.print("p");}
          else if(vol <= 61000){Serial.print("q");}
          else if(vol <= 75000){Serial.print("r");}
          else if(vol <= 95000){Serial.print("s");}
          else if(vol <= 120000){Serial.print("t");}
          else if(vol <= 155000){Serial.print("u");}
          else if(vol <= 190000){Serial.print("v");}
          else if(vol <= 225000){Serial.print("w");}
          else if(vol <= 300000){Serial.print("x");}
          else if(vol <= 385000){Serial.print("y");}
          else if(vol <= 480000){Serial.print("z");}
          else if(vol <= 610000){Serial.print(" ");}
          else if(vol <= 770000){Serial.print("!");}
          else if(vol <= 950000){Serial.print("?");}
          else if(vol <= 1150000){Serial.print(".");}
          else if(vol <= 1525000){Serial.print(",");}
          else if(vol <= 1900000){Serial.print("\n");}
          else if(vol <= 2164251){Serial.print("");}
          else{Serial.println("Unknown letter");}
          vol = 0;
          flag = 0;
        }
      }/////////
      sum = 0;
    }
  } else {
    Serial.println("\nNothing to read from the stream");
  }  
}