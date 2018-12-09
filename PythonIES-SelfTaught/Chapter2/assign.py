#Chapter 2 - Exercise 2
#assign.py
#.py is a Python File

#Start a new Python Script that initializes two variables by
#assigning integer values and displays both assigned values
a = 8
b = 4
print('Assign Values:\t\t','a =',a,'\tb =',b)

#Next, add and assign a new value to the first variable and
#display its stored value
a += b
print('Add & Assign:\t\t','a =',a,'(8 += 4)')

#Now, subtract and assign a new value to the first variable
#and display its stored value, then multiply and assign a
#value to the first variable and display its stored value
a -= b
print('Subtract & Assign:\t','a =',a,'(12 - 4)')

a *= b
print('Multiply & Assign:\t','a =',a,'(8 x 4)')

#Finally, divide and assign a new value to the first variable
#and display its stored value, then multiply and assign a
#value to the first variable and display its stored value
a /= b
print('Divide & Assign:\t','a =',a,'(32 / 4)')

a %= b
print('Modulus & Assign:\t','a =',a,'(8 % 4)')
