import serial

s = serial.Serial("COM4",115200)
limit = 1000
counter = 0

while(counter < limit):
    if(s.in_waiting > 0):
        line = s.readline()
        line = line.decode('utf-8')
        print(line)
        counter+=1

s.close()