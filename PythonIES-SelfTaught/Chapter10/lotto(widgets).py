#Chapter 10 - Exercise 2
#lotto(widgets).py
#.py is a Python file

#Launch a plain text editor then begin a Python program
#by importing all features from the "tkinter" module
#Widgets:
from tkinter import *

#Next, add statements to create a window object and an
#image object
window = Tk()
img = PhotoImage(file = 'logo.png')

#Now, add statements to create all the necessary widgets
imgLbl = Label(window, image = img)
label1 = Label(window, relief = 'groove', width = 2)
label2 = Label(window, relief = 'groove', width = 2)
label3 = Label(window, relief = 'groove', width = 2)
label4 = Label(window, relief = 'groove', width = 2)
label5 = Label(window, relief = 'groove', width = 2)
label6 = Label(window, relief = 'groove', width = 2)
getBtn = Button(window)
resBtn = Button(window)

#Then, add the widgets to the window using the grid layout
#manager - ready to recieve arguments to specify how the
#widgets should be positioned at the design stage next
#Geometry
imgLbl.grid()
label1.grid()
label2.grid()
label3.grid()
label4.grid()
label5.grid()
label6.grid()
getBtn.grid()
resBtn.grid()

#Finally, add a loop statement to sustain the window
#Sustain window:
window.mainloop()

#Save the file then execute the program - to see the
#window appear containing all the necessary widgets

