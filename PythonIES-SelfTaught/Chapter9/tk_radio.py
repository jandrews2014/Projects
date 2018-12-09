#Chapter 9 - Exercise 6
#tk_radio.py
#.py is a Python file

#Start a new Python program by making GUI features
#available and messagebox features available as a short alias
from tkinter import *
import tkinter.messagebox as box

#Next, create a window object and specify a title
window = Tk()
window.title('Radio Button Example')

#Now, create a frame to contain widgets
frame = Frame(window)

#Then, construct a string variable object to store a selection
book = StringVar()

#Next, create three radio button widgets whose value will
#be assigned to the string variable upon selection
radio_1 = Radiobutton(frame, text = 'HTML5',\
                      variable = book, value = 'HTML5 in easy steps')
radio_2 = Radiobutton(frame, text = 'CSS3',\
                      variable = book, value = 'CSS3 in easy steps')
radio_3 = Radiobutton(frame, text = 'JS',\
                      variable = book, value = 'JavaScript in easy steps')

#Now, add a statement to specify which radio button will
#be selected by default when the program starts
radio_1.select()

#Then, add a statement to specify which radio button will
#add a button to call this function
def dialog():
    box.showinfo('Selection',\
                 'Your Choice:\n' + book.get())
btn = Button(frame, text = 'Choose', command = dialog)

#Add the push button and radio buttons to the frame
btn.pack(side = RIGHT, padx = 5)
radio_1.pack(side = LEFT)
radio_2.pack(side = LEFT)
radio_3.pack(side = LEFT)
frame.pack(padx = 30, pady = 30)

#Finally, add the loop to capture this window's events
window.mainloop()

#Save the file in your scripts directory then open a
#Command Prompt window there and run this program
#with the command python tk_radio.py - choose an option
#and click the button to see your choice confirmed
