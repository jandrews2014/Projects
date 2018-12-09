#Chapter 6 - Exercise #3
#Modify.py
#.py is a Python file

#Start a new Python script by initializing a variable with a
#string of lowercase characters and spaces
string = 'python in easy steps'

#Next, display the string capitalized, titled, and centered
print('\nCapitalized:\t', string.capitalize())
print('\nTitled:\t\t', string.title())
print('\nCentered:\t', string.center(30, '*'))

#Now, display the string in all uppercase and merged with
#a sequence of two asterisks
print('\nUppercase:\t', string.upper())
print('\nJoined:\t\t', string.join('**'))

#Then, display the string padded with asterisks on the left
print('\nJustified;\t', string.rjust(30, '*'))

#Finally, display the string with all occurences of the 's'
#character replaced by asterisks
print('\nReplaced:\t', string.replace('s','*'))
