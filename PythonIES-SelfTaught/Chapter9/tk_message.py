#Chapter 9 - Exercise 3
#tk_message.py
#.py is a Python file

#Start a new Python program by making GUI features
#available and messagebox features available as a short alias
from tkinter import *
import tkinter. messagebox as box

#Next, create a window object and specify a title
window = Tk()
window.title('Message Box Example')

#Add a function to display various message boxes
def dialog():
    var = box.askyesno('Message Box', 'Proceed?')
    if var == 1:
        box.showinfo('Yes Box', 'Proceeding...')
    else:
        box.showwarning('No Box', 'Canceling...')

#Then, create a button to call the function when clicked
btn = Button(window, text = 'Click', command = dialog)

#Add the button to the window with positional padding
btn.pack(padx = 150, pady=50)

#Finally, add the loop to capture the window's events
window.mainloop()

#Save the file in your scripts directory then open a
#Command Prompt window there and run this program
#with the command python tk_message.py - click the
#button to see the message box appear
