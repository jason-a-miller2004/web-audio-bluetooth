import sys
import wave


if __name__ == '__main__':
  file_name = sys.argv[1]
  num_samples = 0
  with wave.open(file_name + '.wav', 'w') as wave_file:
    print(wave_file)
    wave_file.setnchannels(1) # mono
    wave_file.setsampwidth(2)
    wave_file.setframerate(44100)

    with open(file_name, 'r') as file:
      for line in file:
        if len(line.strip()) > 0:
          value = int(line.split(', ')[0])
          data = wave.struct.pack('<h', value)
          wave_file.writeframesraw(data)
          num_samples += 1
    
  print('processed', num_samples, 'samples')
