#Chapter 5 - Exercise #9
#Inaccurate.py
#.py is a Python file

#Start a new Python script by initializing two variables
#with floating-point values
#item = 0.70
#rate = 1.05

#Next, initialize two more variables by attempting floating
#point arithmetic with the first two variables
#tax = item * rate
#total = item + tax

#Now, add statements to display variable values formatted
#to have two decimal places so trailing zeros are shown
#print('Item:\t', '%.2f' % item)
#print('Tax:\t', '%.2f' % tax)
#print('Total:\t', '%.2f' % total)

#To help understand this problem, edit all three print
#statements to display the variable values expanded to
#twenty decimal places, then run the modified program
#print('Item:\t', '%.20f' % item)
#print('Tax:\t', '%.20f' % tax)
#print('Total:\t', '%.20f' % total)

#Add a statement at the beginning of the program to
#import the "decimal" module to make all features available
from decimal import *

#Next, edit the first two variable assignment to objects
item = Decimal(0.70)
rate = Decimal(1.05)

#Next, initialize two more variables by attempting floating
#point arithmetic with the first two variables
tax = item * rate
total = item + tax

#Now, add statements to display variable values formatted
#to have two decimal places so trailing zeros are shown
print('Item:\t', '%.2f' % item)
print('Tax:\t', '%.2f' % tax)
print('Total:\t', '%.2f' % total)
