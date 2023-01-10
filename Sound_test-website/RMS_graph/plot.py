# Implementation of matplotlib function  
# %%  
from matplotlib import pyplot as plt
import numpy as np
import os, sys

def add_to_list(x,y,x_list,y_list):
  x_list += x
  y_list += y.tolist()

plt.rcParams["figure.figsize"] = [10, 5]
plt.rcParams["figure.autolayout"] = True

x_cord = []
y_cord = []

path = "Data"
data = os.listdir(path)
x_val = [-45, -46, -47, -48, -49, -50, -55, -60, -65, -70, -75, -80]

for i in range(len(data)):
  y_val = np.loadtxt(f"Data/{data[i]}")
  # x = [x_val[i]] * len(y_val)
  x = [x_val[i] for _ in range(len(y_val))]
  add_to_list(x,y_val,x_cord,y_cord)

# best = np.polyfit(x_cord,y_cord,10)
# mymodel = np.poly1d(np.polyfit(x_cord, y_cord, 2))
# myline = np.linspace(-80, -45, 100)

plt.grid()

# plt.plot(myline, mymodel(myline))
plt.plot(x_cord, y_cord, marker="o", markersize=3, markeredgecolor="green", markerfacecolor="green", linestyle = "None", alpha = 0.1)

plt.ylim(0, 9000)
plt.xticks(np.arange(-80, -30, 5))
plt.show()
# %%