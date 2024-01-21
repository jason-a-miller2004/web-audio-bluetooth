import matplotlib.pyplot as plt
import sys

if __name__ == '__main__':
  file_path = sys.argv[1]
  data = []
  with open(file_path, 'rb') as file:
    for line in file:
      try:
        line = line.decode('utf-8')
        line_parts = line.split(',')
        if(len(line_parts) > 1):
          value = int(line_parts[1])
          countPerSec = int(line_parts[0])
          data.append(value)
          print(countPerSec + "\n")
        else:
          value = int(line_parts[0])
          data.append(value)
      except Exception:
        pass

  plt.plot(data)
  plt.show()