#Chapter 9 - Exercise 8
#tk_image.py
#.py is a Python file

#Start a new Python program by making GUI methods
#and attibutes available then create a window object and
#specify a title
from tkinter import *
window = Tk()
window.title('Image Example')

#Now, create an image object from a local image file
img = PhotoImage(file = 'python.png')

#Then, create a label object to display the image above a
#colored background
label = Label(window, image = img, bg = 'yellow')

#Create a half-size image object from the first image object
small_img = PhotoImage.subsample(img, x=2, y=2)

#Now, create a button to display the small image
btn = Button(window, image = small_img)

#Create a text field and embed the small image then insert
#some text after it
txt = Text(window, width = 25, height = 7)
txt.image_create('1.0', image = small_img)
txt.insert('1.1', 'Python Fun!')

#Create a canvas and paint the small image above a colored
#background then paint a diagonal line over the top of it
can = \
    Canvas(window, width = 100, height = 100, bg = 'cyan')
can.create_image((50,50), image = small_img)
can.create_line(0,0,100,100, width = 25, fill = 'yellow')

#Then, add the widgets to the window
label.pack(side = TOP)
btn.pack(side = LEFT, padx = 10)
txt.pack(side = LEFT)
can.pack(side = LEFT, padx = 10)

#Finally, add the loop to capture this window's events
window.mainloop()

#Save the file in your scripts directory then open a
#Command Prompt window there and run this program
#with the command python tk_photo.py - to see the image
