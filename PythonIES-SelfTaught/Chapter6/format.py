#Chapter 6 - Exercise #2
#Format.py
#.py is a Python file

#Start a new Python script by initializing a variable with a
#formatted string
snack = '{} and {}'.format('Burger','Fries')

#Next, display the variable value to see the text replaced in
#their listed order
print('\nReplaced:',snack)

#Now, assign a differently-formatted string to the variable
snack = '{1} and {0}'.format('Burger','Fries')

#Then, display the variable value again to see the text now
#replaced by their specified index element value
print('Replaced:', snack)

#Assign another formatted string to the variable
snack = '%s and %s' % ('Milk', 'Cookies')

#Finally, display the variable value once more to see the
#text substituted in their listed order
print('\nSubstituted:', snack)
