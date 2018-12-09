#Chapter 2 - Exercise 6
#precedence.py
#.py is a Python File

#Start a new Python Script by initializing three variables
#with integer values for precedence comparision
a = 2
b = 4
c = 8

#Next, add statements to display the results of default
#precedence and forcing addition before multiplication
print('\nDefault Order:\t',a,'*',c,'+',b,'=',a * c + b)
print('Forced Order:\t',a,'*(',c,'+',b,')=',a * (c + b))

#Now, add statements to display the results of default
#precedence and forcing subtraction before multiplication
print('\nDefault Order:\t',c,'/',b,'-',a,'=',c / b - a)
print('Forced Order:\t',c,'/(',b,'-',a,')=',c / (b - a))

#Finally, add statements to display the results of default
#precedence and forcing addition before modulus operation
#and before the exponent operation
print('\nDefault Order:\t',c,'%',a,'+',b,'=',c % a + b)
print('Forced Order:\t',c,'%(',a,'+',b,')=',c % (a + b))

print('\nDefault Order:\t',c,'**',a,'+',b,'=',c ** a + b)
print('Forced Order:\t',c,'**(',a,'+',b,')=',c **(a + b))
