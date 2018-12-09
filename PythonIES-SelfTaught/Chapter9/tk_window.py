#Chapter 9 - Exercise 1
#tk_window.py
#.py is a Python file

#Start a new Python script with a statement to make the
#"tkinter" module GUI methods and attributes available
from tkinter import *

#Next, add a statement to call upon a constructor to create
#a window object
window = Tk()

#Now, add a statement to specify a title for this window
window.title('Label Example')

#Then, add a statement to call upon a constructor to create
#a label object
label = Label(window, text = 'Hello World!')

#Use the pracker to add the label to the window with both
#horizontal and vertical padding for positioning
label.pack(padx = 200, pady = 50)

#Finally, add the mandatory statement to maintain the
#window by capturing events
window.mainloop()

#Save the program in your scripts directory then open a
#Command prompt window there and run this program
#with the command python tk_window.py - to see a
#window appear containing a label widget
