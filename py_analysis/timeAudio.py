import matplotlib.pyplot as plt
import sys

if __name__ == '__main__':
  file_path = "C:\\Users\\jason\\OneDrive\\Research\\Ubicomp Lab\\TT Recordings\\20dbtest.txt"
  xData = []
  yData = []
  with open(file_path, 'r') as file:
    for line in file:
      try:
        line = line.strip()
        line_parts = line.split(',')
        value = float(line_parts[0])
        time = float(line_parts[2])
        yData.append(value)
        xData.append(time)
      except Exception as e:
        pass

  start_time = xData[0]
  plt.plot(xData, yData)
  plt.xlabel('time (seconds)')
  plt.ylabel('frequency')
  plt.show()