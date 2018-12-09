#Chapter 9 - Exercise 5
#tk_listbox.py
#.py is a Python file

#Start a new Python program by making GUI features
#available and messagbox features available as a short alias
from tkinter import *
import tkinter.messagebox as box

#Next, create a window object and specify a title
window = Tk()
window.title('Listbox Example')

#Now, create a frame to contain widgets
frame = Frame(window)

#Create a listbox widget offering three list items
listbox = Listbox(frame)
listbox.insert(1, 'HTML5 in easy steps')
listbox.insert(2, 'CSS3 in easy steps')
listbox.insert(3, 'JavaScript in easy steps')

#Next, add a function to display a listbox selection
def dialog():
    box.showinfo('Selection', 'Your Choice' +\
                 listbox.get(listbox.curselection()))

#Now, create a button to call the function when clicked
btn = Button(frame, text = 'Choose', command = dialog)

#Then, add the button and listbox to the frame at set sides
btn.pack(side = RIGHT, padx = 5)
listbox.pack(side = LEFT)
frame.pack(padx = 30, pady = 30)

#Finally, add the loop to capture this window's events
window.mainloop()

#Save the file in your scripts directory and then open a
#Command Prompt window there and run this program
#with the command python tk_listbox.py - select an option
#and click the button to see your selection confirmed
