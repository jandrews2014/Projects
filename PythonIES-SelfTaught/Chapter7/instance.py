#Chapter 7 - Exercise #2
#Instance.py
#.py is a Python file

#Start another Python script by making features of the
#class file available, then display its document string
from Bird import *
print('\nClass Instances Of:\n', Bird.__doc__)

#Next, add a statement to create an instance of the class
#and pass a string argument value to its instance variable
polly = Bird('Squawk, squawk!')

#Now, display this instance variable value and call the class
#method to display the common class variable value
print('\nNumber Of Birds:', polly.count)
print('Polly Says:', polly.talk())

#Create a second instance of the class, passing a different
#string argument value to its instance variable
harry = Bird('Tweet, tweet!')

#Finally, display this instance variable value and call the
#class method to display the common class variable value
print('\nNumber Of Birds:', harry.count)
print('Harry Says:', harry.talk())
