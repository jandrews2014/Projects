#Chapter 6 - Exercise #5
#Access.py
#.py is a Python file

#Start a new Python script by creating a file object for a
#new text file named "example.txt" to write content into
file = open('example.txt', 'w')

#Next, add statements to display the file name and mode
print('File Name:', file.name)
print('File Open Mode:', file.mode)

#Now, add statements to display the file access permissions
print('Readable:', file.readable())
print('Writable:', file.writable())

#Then, define a function to determine the file's status
def get_status(f):
    if(f.closed != False):
        return 'Closed'
    else:
        return 'Open'

#Finally, add statements to display the current file status
#then close the file and display the file status once more
print('File Status:', get_status(file))
file.close()
print('\nFile Status:', get_status(file))
