#Chapter 10 - Exercise 1
#sample.py
#.py is a Python file

#Launch a plain text editor then begin a Python program
#by importing two functions from the "random" module
from random import random , sample

#Next, assign a random floating-point number to a variable
#then display its value
num = random()
print('Random Float 0.0-1.0:', num)

#Now, multiply the floating-point number and cast it to
#become an integer then display its value
num = int(num * 10)
print('Random Integer 0-9:', num)

#Add a loop to assign multiple random integers to a list
#then display the list items
nums = []; i = 0
while i < 6:
    nums.append(int(random() * 10) + 1)
    i += 1
print('Random Multiple Integers 1-10:', nums)

#Finally, assign multiple unique random integers to the list
#then display the list items
nums = sample(range(1,49), 6)
print('Random Integer Sample 1-49:', nums)

#Save the file then execute the program several times - to
#see the generated random numbers
