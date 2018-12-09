#Chapter 8 - Exercise 1
#response.py
#.py is a Python file

#Ensure the web server is running and configured to
#execute Python scripts
#IP Address (for the following lesson): 127.0.0.1

#Next, start a new Python script by describing its
#generated output content type to be an HTML document
print('Content-type:text/html\r\n\r\n')

#Now, add statements to output an entire web page
#including all its HTML markup tags
print('<!DOCTYPE HTML>')
print('<html lang = "en">')
print('<head>')
print('<meta charset="UTF-8">')
print('<title>Python Response</title>')
print('</head>')
print('<body>')
print('<h1>Hello from Python Online!</h1>')
print('</body>')
print('</html>')

#Finally, save the file in the web server's HTML
#documents directory - typically this will be /htdocs

#Open a web browser and request the script from the
#web server via the HTTP protocol - to see the HTML
#document response provided by the Python script
