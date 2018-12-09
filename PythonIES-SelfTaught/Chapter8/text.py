#Chapter 8 - Exercise 4
#text.py
#.py is a Python file

#Create a new HTML document containing a form with a
#text area field and a submit button
#---<!DOCTYPE HTML>
#---<html lang="en">
#---<head> <meta charset="UTF-8">
#---<title>Text Area Example</title> </head>
#---<body>
#---<form method="POST" action="text.py">
#---<textarea name="Future Web" rows="5" cols="40">
#---</textarea>
#---<input type="submit" value="Submit">
#---</form>
#---</body>
#---</html>

#Next, start a new Python script by making CGI handling
#features available and create a FieldStorage data object
import cgi
data = cgi.FieldStorage()

#Now, test if the text area is blank then assign its content
#string or a default string to a variable
if data.getvalue('Future Web'):
    text = data.getvalue('Future Web')
else:
    text='Please Enter Text!'

#Then, add statements to output an entire HTML web
#page including posted or default values in the output
print('Content-type:text/html\r\n\r\n')
print('<!DOCTYPE HTML>')
print('<html lang="en">')
print('<head> <meta charset="UTF-8">')
print('<title>Python Response</title> </head>')
print('<body>')
print('<h1>',text,'</h1>')
print('<a href="text.html">Back</a>')
print('</body>')
print('</html>')

#Finally, save both files in the web server's /htdocs directory
#and load the HTML document in a browser then push
#the form button - to see values in the response

#Examine the HTTP request and response components
#using browser developer tools to see that the text gets
#sent as a separate message in the HTTP "Request body"
