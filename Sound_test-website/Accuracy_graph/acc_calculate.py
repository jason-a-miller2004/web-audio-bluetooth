
file1 = open("ver1.txt","r")
lines = file1.readlines()
file1.close()

file2 = open("ver2.txt","r")
lines2 = file2.readlines()
file2.close()

file3 = open("ver3.txt","r")
lines3 = file3.readlines()
file3.close()

sentence = "This should output a really long message to test if ACCURACY is at ONE HUNDRED PERCENT"

total = 0
for line in lines3:
  match = 0
  if len(line) > len(sentence):
    for i in range(len(sentence)):
      if line[i] == sentence[i]:
        match += 1

  elif len(line) < len(sentence):
    for i in range(len(line)):
      if line[i] == sentence[i]:
        match += 1

  else:
    for i in range(len(sentence)):
      if line[i] == sentence[i]:
        match += 1
  total += match/len(sentence)

print(total)
