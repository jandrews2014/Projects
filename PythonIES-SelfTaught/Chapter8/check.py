#Chapter 8 - Exercise 5
#check.py
#.py is a Python file

#Create a new HTML document containing a form with
#three checkboxes with associated values and a submit
#button to post only checked values to a Python script
#---<!DOCTYPE HTML>
#---<html lang="en">
#---<head><meta charset="UTF-8">
#---<title>Checkbox Example</title></head>
#---<body>
#---<form method="POST" action="check.py">
#---Sailing:
#---<input type="checkbox" name="sail" value="Sailing">
#---Walking:
#---<input type="checkbox" name="walk" value="Walking">
#---Ski-ing:
#---<input type="checkbox" name="skee" value="Ski-ing">
#---<input type="submit" value="Submit">
#---</form>
#---</body>
#---</html>

#Next, start a new Python script by making CGI handling
#features available and create a FieldStorage data object
import cgi
data = cgi.FieldStorage()

#Now, assign a list of checked box values as elements of an
#unordered HTML list to a variable
list = '<ul>'

if data.getvalue('sail'):
    list += '<li>' + data.getvalue('sail')
if data.getvalue('walk'):
    list += '<li>' + data.getvalue('walk')
if data.getvalue('skee'):
    list += '<li>' + data.getvalue('skee')

list += '</ul>'

#Then, add statements to output an entire HTML web
#page including a list of posted values in the output
print('Content-type:text/html\r\n\r\n')
print('<!DOCTYPE HTML>')
print('<html lang="en">')
print('<head>')
print('<meta charset="UTF-8">')
print('<title>Python Response</title>')
print('</head>')
print('<body>')
print('<h1>',list,'</h1>')
print('<a href="check.html">Back</a>')
print('</body>')
print('</html>')

#Finally, save both files in the web server's /htdocs directory
#and load the HTML document in a browser then push
#the submit button - to see checked values in the response
