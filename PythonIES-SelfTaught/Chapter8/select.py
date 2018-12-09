#Chapter 8 - Exercise 7
#select.py
#.py is a Python file

#Create a new HTML document containing a form with a
#dropdown options list and a submit button
#---<!DOCTYPE HTML>
#---<html lang="en">
#---<head> <meta charset="UTF-8">
#---<title>Selection List Example</title> </head>
#---<body>
#---<form method="POST" action="select.py">
#---<select name="CityList">
#---<option value="New York">New York</option>
#---<option value="London">London</option>
#---<option value="Paris">Paris</option>
#---<option value="Beijing">Beijing</option>
#---</select>
#---<input type="submit" value="Submit">
#---</form>
#---</body>
#---</html>

#Next, start a new Python script by making CGI handling
#features available and create a FieldStorage data object
import cgi
data = cgi.FieldStorage()

#Now, assign the selected option value to a variable
city = data.getvalue('CityList')

#Then, add statements to output an entire HTML web
#page including the posted option value in the output
print('Content-type:text/html\r\n\r\n')
print('<!DOCTYPE HTML>')
print('<html lang="en">')
print('<head> <meta charset="UTF-8">')
print('<title>Python Response</title> </head>')
print('<body>')
print('<h1>City:',city,'</h1>')
print('<a href="select.html">Back</a>')
print('</body>')
print('</html>')

#Finally, save both files in the web server's /htdocs
#directory and load the HTML document in the browser
#then push the submit button - to see the selected value in
#the response
