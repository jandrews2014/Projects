#Chapter 10 - Exercise 6
#lotto.py
#.py is a Python file

#Launch a plain text editor then begin a Python program
#by importing all features from the "tkinter" module
#Widgets:
from tkinter import *
import random

#Next, add statements to create a window object and an
#image object
window = Tk()
img = PhotoImage(file = 'logo.png')
gmi = PhotoImage(file = 'society.png')

#Now, add statements to create all the necessary widgets
imgLbl = Label(window, image = img)
imgLbl2 = Label(window, image = gmi)
label1 = Label(window, relief = 'groove', width = 3)
getBtn = Button(window)
resBtn = Button(window)

#Then, add the widgets to the window using the grid layout
#manager - ready to recieve arguments to specify how the
#widgets should be positioned at the design stage

#Edit the program started on the previous page - firstly
#by positioning the Label containing the logo in the
#first column of the first row, and have it span across the
#second row
#Geometry:
imgLbl.grid(row = 1, column = 1, rowspan = 2)
imgLbl2.grid (row = 1, column = 10, rowspan = 2) 

#Next, position a Label in the second column of the first
#row and add 10 pixels of padding to its left and right
label1.grid(row = 1, column = 4, padx = 10)

#Next, position a Button in the second column of the
#second row and have it span across 4 columns
getBtn.grid(row = 2, column = 2, columnspan = 4)

#Now, Position a Button in the sixth column of the second
#row, and have it span across 2 columns
resBtn.grid(row = 2, column = 8, columnspan = 2)

#Modify the program on the previous page by inserting a
#new selection just before the final loop statement, which
#begins with a statement specifying a window title
#Static Properties:
window.title('Florida Peninsula: Bingo Number Picker')

#Next, add a statement to prevent the user resizing the
#window along both the X axis and the Y axis - this will
#disable the window's "resize" button
window.resizable(0,0)

#Now, add a statement to specify text to appear on the face
#of the first Button widget
getBtn.configure(text = 'Pick Bingo Number')

#Then, add a statement to specify text to appear on the
#face of the second Button widget
resBtn.configure(text = 'Reset')

#Modify the program on the facing page by inserting
#another new section just before the final loop statement
#which specifies that each small empty Label should
#initially display an ellipsis
#initial properties:
label1.configure(text = "...")

#Next, add a statement to specify that the second Button
#widget should initially be disabled
resBtn.configure(state = DISABLED)

#Modify the program on the previous page by inserting
#one or more new selection just before the final loop statement,
#which begins by making the sample() function available
#from the random "module"
#Dynamic properties:
from random import sample

#Next, define a function that generates and assigns six
#unique random numbers to the small Labels and reverses
#the state of both Buttons
def pick():
    nums = sample(['B1','B2','B3','B4','B5','B6','B7','B8','B9','B10','B11','B12','B13','B14','B15','I16','I17','I18','I19','I20','I21','I22','I23','I24','I25','I26','I27','I28','I29','I30','N31','N32','N33','N34','N35','N36','N37','N38','N39','N40','N41','N42','N43','N44','N45','G46','G47','G48','G49','G50','G51','G52','G53','G54','G55','G56','G57','G58','G59','G60','O61','O62','O63','O64','O65','O66','O67','O68','O69','O70','O71','O72','O73','O74','O75'], 1)
    random.shuffle(nums)
    print(nums)
    label1.configure(text = nums[0])
    getBtn.configure(state = DISABLED)
    resBtn.configure(state = NORMAL)
        

#Now, define a function to display an ellipsis on each small
#Label and revert both Buttons to their initial states
def reset():
    label1.configure(text = '...')
    getBtn.configure(state = NORMAL)
    resBtn.configure(state = DISABLED)

#Then, add statements to nominate the relevant function to
#be called when each Button is pressed by the user
getBtn.configure(command = pick)
resBtn.configure(command = reset)

#Finally, add a loop statement to sustain the window
#Sustain window:
window.mainloop()

#Save the file then execute the program - to see the
#window appear containing all the necessary widgets

#Update:
#Save the file then execute the program - to see the
#window appear containing all the necessary widgets now
#arranged in your grid layout design

#Update 2:
#Save the file then execute the program - to see the
#window now has a title, its resize button is disabled, and
#the buttons have now been resized to suit their text

#Update 3:
#Save the file then execute the program - to see each small
#Label now displays an ellipsis and that the "Reset" Button
#has been disabled

#Finally, save the file - the complete program should look
#like that shown opposite
