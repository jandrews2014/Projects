#Chapter 5 - Exercise #9
#Inaccurate.py
#.py is a Python file

#Start a new Python script by initializing two variables
#with floating-point values
item = 0.70
rate = 1.05

#Next, initialize two more variables by attempting floating
#point arithmetic with the first two variables
tax = item * rate
total = item + tax

#Now, add statements to display variable values formatted
#to have two decimal places so trailing zeros are shown
print('Item:\t', '%.2f' % item)
print('Tax:\t', '%.2f' % tax)
print('Total:\t', '%.2f' % total)

