#Chapter 5 - Exercise #2
#Kitty.py
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


