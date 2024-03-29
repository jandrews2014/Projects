#Chapter 5 - Exercise #6
#Fido.py
#.py is a Python file

#Start a new Python module by defining a function that
#supplies a default string value to its argument
def bark(pet = 'A Dog'):
    print(pet, 'Says WOOF!')

#Next, add two more function definitions that also supply
#default string values to their arguments
def lick(pet = 'A Dog'):
    print(pet, 'Drink water')

def nap(pet = 'A Dog'):
    print(pet, 'Sleeps In The Sun')

#Start a new Python script with a statement to make
#individual "dog" module functions available
from dog import bark, lick, nap

#Next, call each function without supplying an argument
bark()
lick()
nap()

#Now, call each function again and pass an argument value
#to each then save the file
bark('Pooch')
lick('Pooch')
nap('Pooch')

#Start another Python script by making all "dog" module
#functions available
from dog import*

#Then, request the user enters a name to overwrite the
#default argument value
pet = input('Enter A Pet Name:')

#Finally, call each function, passing the user-defined value
#as the argument
bark(pet)
lick(pet)
nap(pet)
