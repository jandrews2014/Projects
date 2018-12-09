#Chapter 8 - Exercise 2
#get.py
#.py is a Python file

#Create a new HTML document containing hyperlinks
#with appended values to pass to a Python script
#---<!DOCTYPE HTML>
#---<html lang="en">
#---<head>
#---<meta charset="UTF-8">
#---<title>Python Appended Values</title>
#---</head>
#---<body>
#---<h1>
#---<a href="get.py?make=Ferrari&model=Dino">Ferrari</a>
#---<a href="get.py?make=Fiat&model=Topolino">Fiat</a>
#---<a href="get.py?make=Ford&model=Mustang">Ford</a>
#---</h1>
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
#page including passed values in the output
print('Content-type:text/html\r\n\r\n')
print('<!DOCTYPE HTML>')
print('<html lang="en">')
print('<head>')
print('<meta charset="UTF-8">')
print('<title>Python Response</title>')
print('</head>')
print('<body>')
print('<h1>', make, model, '</h1>')
print('<a href="get.html">Back</a>')
print('</body>')
print('</html>')

#Finally, save both files in the web server's /htdocs directory

#Open a web browser and load the HTML document then
#click any hyperlink - to see passed values in the response
