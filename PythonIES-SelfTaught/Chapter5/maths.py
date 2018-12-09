#Chapter 5 - Exercise #8
#Maths.py
#.py is a Python file

#Start a new Python script by importing the "math" and
#"random" modules to make their features available
import math, random

#Next, add statements to display two rounded values
print('Rounded Up 9.5:', math.ceil(9.5))
print('Rounded Down 9.5:', math.floor(9.5))

#Now, add a statement to initialize a variable with an
#integer value
num = 4

#Add statements to display the square and square root of
#the variable value
print(num, 'Squared:', math.pow(num, 2))
print(num, 'Square Root:', math.sqrt(num))

#Then, add a statement to produce a random list of six
#unique numbers between one and 49
nums = random.sample(range(1,49),6)

#Finally, add a statement to display the random list
print('Your Lucky Lotto Numbers Are:',nums)
