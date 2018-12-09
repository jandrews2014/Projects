#Chapter 4 - Exercise #7
#Skip.py
#.py is a Python file

#Start a new Python script by initializing a variable with a
#string value
title = '\nPython in Easy Steps\n'

#Next, add a loop to print each character of the string
for char in title: print(char, end = '')

#Now, add a loop that prints each string character but
#replaces any 'y' character then skips to the next iteration
for char in title:
    if char == 'y':
        print('*', end = '')
        continue
    print(char, end = '')

#Finally, add a loop that prints each string character but
#inserts an asterisk before each 'y' character
for char in title:
    if char == 'y':
        print('*', end = '')
        pass
    print(char, end = '')
