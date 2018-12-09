#Chapter 8 - Exercise 6
#radio.py
#.py is a Python file

#Create a new HTML document containing a form with
#one group of three radio buttons and a submit button to
#post the value of the chosen button to a Python script
#---<!DOCTYPE HTML>
#---<html lang="en">
#---<head> <meta charset="UTF-8">
#---<title>Radio Button Example</title></head>
#---<body>
#---<form method="POST" action="radio.py">
#---<fieldset>
#---<legend>HTML Language Category?</legend>
#---Script
#---<input type="radio" name="cat" value="Script" checked>
#---Markup
#---<input type="radio" name="cat" value="Markup">
#---Program
#---<input type="radio" name="cat" value="Program">
#---<input type="submit" value="Submit">
#---</fieldset>
#---</form>
#---</body>
#---</html>

#Next, start a new Python script by making CGI handling
#features available and create a FieldStorage data object
import cgi
data = cgi.FieldStorage()

#Now, test the submitted radio group value and assign an
#appropriate response to a variable
answer = data.getvalue('cat')

if answer == 'Markup':
    result = answer + 'Is Correct'
else:
    result = answer + 'Is Incorrect'

#Then, add statements to output an entire HTML web
#page including the posted value in an appropriate output
print('Content-type:text/html\r\n\r\n')
print('<!DOCTYPE HTML>')
print('<html lang="en">')
print('<head>')
print('<meta charset="UTF-8">')
print('<title>Python Response</title>')
print('</head>')
print('<body>')
print('<h1>',result,'</h1>')
print('<a href="radio.html">Back</a>')
print('</body>')
print('</html>')

#Finally, save both files in the web server's /htdocs directory

#Load the HTML document in a browser then choose the
#correct radio button answer and push the submit button -
#to see the associated chosen value in response
