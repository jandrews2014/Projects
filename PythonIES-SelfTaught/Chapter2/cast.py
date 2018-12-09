#Chapter 2 - Exercise 7
#cast.py
#.py is a Python File

#Start a new Python Script by initializing two variables
#with numeric values from user input
a = input('Enter A Number:')
b = input('Now Enter Another Number:')

#Next, add statements to add the variable values together
#then, display the combined result and its data type - to
#see a concatenated string value result
sum = a + b
print('\nData Type sum:',sum,type(sum))

#Now, add statements to add cast variable values together
#then display the result and its data type - to see a total
#integer value result
sum = int(a) + int(b)
print('Data Type sum:',sum,type(sum))

#Then, add statements to cast a variable value then display
#the result and its data type - to see a total float value
sum = float(sum)
print('Data Type sum:',sum,type(sum))

#Finally,add statements to cast an integer representation of
#a variable value then display the result and its data type -
#to see a character string value
sum = chr(int(sum))
print('Data Type sum:',sum,type(sum))
