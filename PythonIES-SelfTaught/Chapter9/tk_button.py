#Chapter 9 - Exercise 2
#tk_button.py
#.py is a Python file

#Start a new Python script by making GUI features
#available then create a window and specify a title
from tkinter import *
window = Tk()
window.title('Button Example')

#Next, create a button to exit the program when clicked
btn_end = Button(window, text = 'Close', command = exit)

#Now, add a function to toggle the window's background
#color when another button gets clicked
def tog():
    if window.cget('bg')=='yellow':
        window.configure(bg = 'gray')
    else:
        window.configure(bg = 'yellow')

#Then, create a button to call the function when clicked
btn_tog = Button(window, text = 'Switch', command = tog)

#Add the buttons to the window with positional padding
btn_end.pack(padx = 150, pady = 20)
btn_tog.pack(padx = 150, pady = 20)

#Finally, add the loop to capture this window's events
window.mainloop()

#Save the file in your scripts directory then open a
#Command Prompt window there and run this program
#with the command python tk_button.py - click the button
#to see the window's background color change
