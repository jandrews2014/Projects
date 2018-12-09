#Chapter 2 - Exercise 1
#arithmetic.py
#.py is a Python File

#Start a new Python Script by initializing two variables
#as integer values
a = 8
b = 2

#Next display the result of adding the variable values
print('Addition:\t',a,'+',b,'=',a + b)

#Now display the result of subtracting the variable values
print('Subtraction:\t',a,'-',b,'=',a - b)

#Then display the result of multiplying the variable values
print('Multiplication:\t',a,'x',b,'=',a * b)

#Display the result of dividing the variable value both with(division)
#and without (floor division) the floating point value
print('Division:\t',a,'/',b,'=',a / b)
print('Floor Division:\t',a,'/',b,'=',a // b)

#Next display the remainder after dividing the values
print('Modulus:\t',a,'%',b,'=',a % b)

#Finally, display the result of raising the first operand
#to the power of the second operand
print('Exponent:\t',a,'^2 = ',a**b, sep = '')
