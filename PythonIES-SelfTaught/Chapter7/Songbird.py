#Chapter 7 - Exercise #4
#Songbird.py
#.py is a python file

#Start a new Python script by declaring a class with an
#initializer method creating two instances variables and a
#method to display one of those variable values
class Songbird:
    def __init__(self, name, song):
        self.name = name
        self.song = song
        print(self.name, 'Is Born...')

#Next, add a method to simply display both variable values
    def sing(self):
        print(self.name, 'Sings:', self.song)

#Now, add a destructor method for confirmation when
#instances of the class are destroyed - then save this file
    def __del__(self):
        print(self.name, 'Flew Away!\n')
        
