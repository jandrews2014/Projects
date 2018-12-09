#Chapter 10 - Exercise 5
#lotto(initial).py
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
#widgets should be positioned at the design stage

#Edit the program started on the previous page - firstly
#by positioning the Label containing the logo in the
#first column of the first row, and have it span across the
#second row
#Geometry:
imgLbl.grid(row = 1, column = 1, rowspan = 2)

#Next, position a Label in the second column of the first
#row and add 10 pixels of padding to its left and right
label1.grid(row = 1, column = 2, padx = 10)

#Now, position a Label in the third column of the first row
#and add 10 pixels of padding to its left and right
label2.grid(row = 1, column = 3, padx = 10)

#Position a Label in the fourth column of the first row and
#add 10 pixels of padding to its left and right
label3.grid(row = 1, column = 4, padx = 10)

#Position a Label in the fifth column of the first row and
#add 10 pixels of padding to its left and right
label4.grid(row = 1, column = 5, padx = 10)

#Position a Label in the sixth column of the first row and
#add 10 pixels of padding to its left and right
label5.grid(row = 1, column = 6, padx = 10)

#Position a Label in the seventh column of the first row
#then add 10 pixels of padding to the left side of the Label
#and 20 pixels of padding to the right side of the Label
label6.grid(row = 1, column = 7, padx = (10,20))

#Next, position a Button in the second column of the
#second row and have it span across 4 columns
getBtn.grid(row = 2, column = 2, columnspan = 4)

#Now, Position a Button in the sixth column of the second
#row, and have it span across 2 columns
resBtn.grid(row = 2, column = 6, columnspan = 2)

#Modify the program on the previous page by inserting a
#new selection just before the final loop statement, which
#begins with a statement specifying a window title
#Static Properties:
window.title('Lotto Number Picker')

#Next, add a statement to prevent the user resizing the
#window along both the X axis and the Y axis - this will
#disable the window's "resize" button
window.resizable(0,0)

#Now, add a statement to specify text to appear on the face
#of the first Button widget
getBtn.configure(text = 'Get My Lucky Numbers')

#Then, add a statement to specify text to appear on the
#face of the second Button widget
resBtn.configure(text = 'Reset')

#Modify the program on the facing page by inserting
#another new section just before the final loop statement
#which specifies that each small empty Label should
#initially display an ellipsis
#initial properties:
label1.configure(text = "...")
label2.configure(text = "...")
label3.configure(text = "...")
label4.configure(text = "...")
label5.configure(text = "...")
label6.configure(text = "...")

#Next, add a statement to specify that the second Button
#widget should initially be disabled
resBtn.configure(state = DISABLED)

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
