#Chapter 9 - Exercise 4
#tk_entry.py
#.py is a Python file

#Start a new Python program by making GUI features
#available and message box features available as a short alias
from tkinter import *
import tkinter.messagebox as box

#Next, create a window object and specify a title
window = Tk()
window.title('Entry Example')

#Now, create a frame to contain an entry field for input
frame = Frame(window)
entry = Entry(frame)

#Then, add a function to display data currently entered
def dialog():
    box.showinfo('Greetings', 'Welcome' + entry.get())

#Now, create a button to call the function when clicked
btn = Button(frame, text = 'Enter Name', command = dialog)

#Add the button and entry to the frame at set sides
btn.pack(side = RIGHT, padx = 5)
entry.pack(side = LEFT)
frame.pack(padx = 20, pady = 20)

#Finally, add the loop to capture this window's events
window.mainloop()

#Save the file in your scripts directory then open a
#Command Prompt window there and run this program
#with the command python tk_entry.py - enter your name
#and click the button to see a greeting message appear
