#Chapter 7 - Exercise #4
#garbage.py
#.py is a Python file

#Start another Python script by making features of the
#class file available
from Songbird import *

#Next, create an instance of the class then display its
#instance attribute values and its identity address
bird_1 = Songbird('Koko', 'Tweet, tweet!\n')
print(bird_1.name, 'ID:', id(bird_1))
bird_1.sing()

#Now, delete this instance - calling its destructor method
del bird_1

#Create two more instances of the class then display their
#instance attribute values and their identity address
bird_2 = Songbird('Louie', 'Chirp, chirp!\n')
print(bird_2.name, 'ID:', id(bird_2))
bird_2.sing()

bird_3 = Songbird('Misty', 'Sqwuak, sqwuak!\n')
print(bird_3.name, 'ID:', id(bird_3))
bird_3.sing()

#Finally, delete these instances - calling their destructors
del bird_2
del bird_3
