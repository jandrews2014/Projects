#Chapter 6 - Exercise #8
#Data.py
#.py is a Python file

#Start a new Python script by making "pickle" and "os"
#module methods available
import pickle, os

#Next, add a statement to test that a specific data file does
#not already exist
if not os.path.isfile('pickle.dat'):

#Now, add a statement to create a list of two elements if
#the specified file is not found
    data = [0,1]

#Then, add statements to request user data to be assigned
#to each of the list elements
    data[0] = input('Enter Topic:')
    data[1] = input('Enter Series:')

#Next, add a statement to create a binary file for writing to
    file = open('pickle.dat','wb')

#Now, add a statement to dump the values contained in
#the variables as data into the binary file
    pickle.dump(data, file)

#Then, after writing the file remember to close it
    file.close()

#Next, add alternative statements to open an existing file to
#read from if a specific data file does already exist
else:
    file = open('pickle.dat','rb')

#Now, add statements to load the data stored in that
#existing file into a variable then close the file
    data = pickle.load(file)
    file.close()

#Finally, add a statement to display the restored data
    print('Welcome Back To:' + data[0] + ',' + data[1])
    
