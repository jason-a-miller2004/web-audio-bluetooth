# Implementation of matplotlib function  
# %%  
from matplotlib import pyplot as plt
import numpy as np

def add_to_list(x,y,x_list,y_list):
  for i in x:
    x_list.append(i)
  for j in y:
    y_list.append(j)

plt.rcParams["figure.figsize"] = [10, 5]
plt.rcParams["figure.autolayout"] = True

x_cord = []
y_cord = []

a = np.loadtxt("-50.txt")
b = np.loadtxt("-49.txt")
c = np.loadtxt("-48.txt")
d = np.loadtxt("-47.txt")
e = np.loadtxt("-46.txt")
f = np.loadtxt("-45.txt")

g = np.loadtxt("-80.txt")
h = np.loadtxt("-75.txt")
i = np.loadtxt("-70.txt")
j = np.loadtxt("-65.txt")
k = np.loadtxt("-60.txt")
l = np.loadtxt("-55.txt")

x = [-50]* (len(a))
add_to_list(x,a,x_cord,y_cord)

x = [-49]* (len(b))
add_to_list(x,b,x_cord,y_cord)

x = [-48]* (len(c))
add_to_list(x,c,x_cord,y_cord)

x = [-47]* (len(d))
add_to_list(x,d,x_cord,y_cord)

x = [-46]* (len(e))
add_to_list(x,e,x_cord,y_cord)

x = [-45]* (len(f))
add_to_list(x,f,x_cord,y_cord)

x = [-80]* (len(g))
add_to_list(x,g,x_cord,y_cord)

x = [-75]* (len(h))
add_to_list(x,h,x_cord,y_cord)

x = [-70]* (len(i))
add_to_list(x,i,x_cord,y_cord)

x = [-65]* (len(j))
add_to_list(x,j,x_cord,y_cord)

x = [-60]* (len(k))
add_to_list(x,k,x_cord,y_cord)

x = [-55]* (len(l))
add_to_list(x,l,x_cord,y_cord)

# best = np.polyfit(x_cord,y_cord,10)
mymodel = np.poly1d(np.polyfit(x_cord, y_cord, 2))
myline = np.linspace(-80, -45, 100)

plt.grid()

plt.plot(myline, mymodel(myline))
plt.plot(x_cord, y_cord, marker="o", markersize=3, markeredgecolor="green", markerfacecolor="green", linestyle = "None", alpha = 0.2)

plt.ylim(0, 9000)
plt.xticks(np.arange(-80, -30, 5))
plt.show()
# %%
