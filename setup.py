#Chapter 10 - Exercise 7

#setup.py

#.py is a Python file



#Launch a plain text editor, then begin a Python setup

#script by making available the "sys" module and items

#from the "cx_Freeze" module

import cx_Freeze
import sys
import os
from cx_Freeze import setup, Executable

os.environ['TCL_LIBRARY'] = "C:\\Users\\angel\\AppData\\Local\\Programs\\Python\\Python36-32\\tcl\\tcl8.6"
os.environ['TK_LIBRARY'] = "C:\\Users\\angel\\AppData\\Local\\Programs\\Python\\Python36-32\\tcl\\tk8.6"


#Next, add statements to identify the base platform in use
base = None
if sys.platform == 'win32' : base = 'Win32GUI'



#Now, add a statement listing the include options
opts = { 'include_files' : ['logo.png', 'society.png'], 'excludes':[], 'includes' : [ 're' ], 'packages': ['tkinter']}


#Finally, add a call to the setup() function passing all
#information as arguments

setup(

    name = 'Bingo',
    version = '1.0',
    description = 'Florida Peninsula: Bingo Number Picker',
    author = 'Jamie Andrews',
    options = {'build_exe': opts},
    executables = [ cx_Freeze.Executable( 'bingo.py', base = None ) ] )





#Save the file alongside the application files then run the
#setup script to build the distributable bundle



#Wait until the build process creates a bundle of files in
#the "build" sub-directory then copy the whole bundle
#onto portable media, such as a USB flash drive



#Now, copy the bundle onto another
#computer where Python may not be
#present and run the executable file - to see
#the application launch
