#Chapter 5 - Exercise #3
#Tiger.py
#.py is a Python file

#Start a new Python module by defining a function that
#supplies a default string value to its argument for display
def purr(pet = 'A Cat'):
    print(pet, 'Says MEOW!')

#Next, add two more function definitions that also supply
#default string values to their arguments for displat
def lick(pet = 'A Cat'):
    print(pet, 'Drinks Milk')

def nap(pet = 'A Cat'):
    print(pet, 'Sleeps By The Fire')

#Start a new Python script with the statement to make the
#"cat" module functions available
import cat

#Next, call each function without supplying an argument
cat.purr()
cat.lick()
cat.nap()

#Now, call each function again and pass an argument to
#each, then save the file
cat.purr('Kitty')
cat.lick('Kitty')
cat.nap('Kitty')

#Start another Python script by making the "cat" module
#functions available once more
import cat

#Then, request the user enters a name to overwrite the
#default argument value
pet = input('Enter A Pet Name:')

#Finally, call each function, passing the user-defined value
#as the argument
cat.purr(pet)
cat.lick(pet)
cat.nap(pet)
