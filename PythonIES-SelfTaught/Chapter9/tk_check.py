#Chapter 9 - Exercise 7
#tk_check.py
#.py is a Python file

#Start a new Python program by making GUI features
#available and messagebox features available as a short alias
from tkinter import *
import tkinter.messagebox as box

#Next, create a window object and specify a title
window = Tk()
window.title('Check Button Example')

#Now, create a frame to contain widgets
frame = Frame(window)

#Then, construct three integer variable objects to struct values
var_1 = IntVar()
var_2 = IntVar()
var_3 = IntVar()

#Create three check button widgets whose values will be
#assigned to the integer variable whether checked or not
book_1 = Checkbutton(frame, text = 'HTML5',\
                     variable = var_1, onvalue = 1, offvalue = 0)
book_2 = Checkbutton(frame, text = 'CSS3',\
                     variable = var_2, onvalue = 1, offvalue = 0)
book_3 = Checkbutton(frame, text = 'JS',\
                     variable = var_3, onvalue = 1, offvalue = 0)

#Next, add a function to display a check button selection
def dialog():
    str = 'Your Choice:'
    if var_1.get() == 1:str += '\nHTML5 in easy steps'
    if var_2.get() == 1:str += '\nCSS3 in easy steps'
    if var_3.get() == 1:str += '\nJavaScript in easy steps'
    box.showinfo('Selection', str)

#Now, create a button to call the function when clicked
btn = Button(frame, text = 'Choose', command = dialog)

#Then, add the push button and check buttons to the frame
btn.pack(side = RIGHT, padx = 5)
book_1.pack(side = LEFT)
book_2.pack(side = LEFT)
book_3.pack(side = LEFT)
frame.pack(padx = 30, pady = 30)

#Finally, add the loop to capture this window's events
window.mainloop()

#Save the file in your scripts directory then open a
#Command Prompt window there and run this program
#with the command python tk_check.py - check boxes and
#click the button to see your selection confirmed
