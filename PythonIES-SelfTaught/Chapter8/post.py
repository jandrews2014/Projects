#Chapter 8 - Exercise 3
#post.py
#.py is a Python file

#Create a new HTML document containing a form with
#two text fields containing default values and a submit
#button to post all form values to a Python script
#---<!DOCTYPE HTML>
#---<html lang="en">
#---<head>
#---<meta charset="UTF-8">
#---<title>Python Form Values</title>
#---</head>
#---<body>
#---<body>
#---<form method="POST" action="post.py">
#---Make: <input type="text" name="make" value="Ford">
#---Model:
#---<input type="text" name="model" value="Mustang">
#---<input type="submit" value="Submit">
#---</form>
#---</body>
#---</html>

#Next, start a new Python script by making CGI handling
#features available and create a FieldStorage data object
import cgi
data = cgi.FieldStorage()

#Now, assign two passed values to variables by specifying
#their associated key names
make = data.getvalue('make')
model = data.getvalue('model')

#Then, add statements to output an entire HTML, web
#page, including posted values in the output
print('Content-type:text/html\r\n\r\n')
print('<!DOCTYPE HTML>')
print('<html lang="en">')
print('<head>')
print('<meta charset="UTF-8">')
print('<title>Python Response</title>')
print('</head>')
print('<body>')
print('<h1>',make,model,'</h1>')
print('<a href="post.html">Back</a>')
print('</body>')
print('</html>')

#Finally, save both files in the web server's /htdocs directory

#Open, a web browser and load the HTML document then
#push the button - to see posted values in the response
