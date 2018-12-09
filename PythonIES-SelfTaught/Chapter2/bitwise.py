#Chapter 2 - Exercise 8
#bitwise.py
#.py is a Python File

#Start a new Python Script by initializing two variables
#with numeric values and display these initial values
a = 10
b = 5
print('a =',a,'\tb =',b)

#Next, add a statement to change the first variable's
#decimal value by binary bit manipulation
#1010 ^ 0101 = 1111 (decimal 15)
a = a ^ b

#Now, add a statement to change the second variable's
#decimal value by binary bit manipulation
#1111 ^ 0101 = 1010 (decimal 10)
b = a ^ b

#Then, add a statement to change the first variable's
#decimal value once more by further bit manipulation
#1111 ^ 1010 = 0101 (decimal 5)
a = a ^ b

#Finally, add a statement to display the exchanged values
print('a =',a,'\tb =',b)
