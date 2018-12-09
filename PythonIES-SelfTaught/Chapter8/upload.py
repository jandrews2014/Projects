#Chapter 8 - Exercise 8
#upload.py
#.py is a Python file

#Create a new HTML document containing a form with a
#file selection facility and a submit button
#---<!DOCTYPE HTML>
#---<html lang="en">
#---<head> <meta charset="UTF-8">
#---<title>File Upload Example</title> </head>
#---<body>
#---<form method="POST" action="upload.py" enctype="multipart/form-data">
#---<input type="file" name="filename" style="width:400px">
#---<input type="submit" value="Submit">
#---</form>
#---</body>
#---</html>

#Next, start a new Python script by making CGI handling
#and operating system features available then create a
#FieldStorage data object
import cgi, os
data = cgi.FieldStorage()

#Now, assign the full path of the upload file to a variable
#and its stripped out file name to another variable
upload = data['filename']
filename = os.path.basename(upload.filename)

#Then, write a copy of the uploaded file on the web server
with open(filename, 'wb') as copy:
    copy.write(upload.file.read())

#Then, add statements to output an entire HTML web
#page including the uploaded file name in the output
print('Content-type:text/html\r\n\r\n')
print('<!DOCTYPE HTML>')
print('<html lang="en">')
print('<head>')
print('<meta charset="UTF-8">')
print('<title>Python Response</title>')
print('</head>')
print('<body>')
print('<h1>File Uploaded:',filename,'</h1>')
print('<a href="upload.html">Back</a>')
print('</body>')
print('</html>')

#Finally, save both files in the web server's /htdocs directory
#and load the HTML document in a browser then select a
#file for upload - to see the file upload response
