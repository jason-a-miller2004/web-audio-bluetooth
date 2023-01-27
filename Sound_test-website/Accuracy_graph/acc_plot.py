# %%
import matplotlib.pyplot as plt
fig = plt.figure()
ax = fig.add_axes([0,0,1,1])
langs = ["Version 1","Version 2","Version 3"]
students = [0.011627906976744186, 89.139534883721, 99.98837209302326]

bar = ax.bar(langs,students)
ax.bar_label(bar)
ax.bar(langs,students)

plt.title("Accuracy of interpreting sounds to letters")
plt.ylabel("Accuracy (%)")
plt.xlabel("Model Version")

plt.show()

# %%
