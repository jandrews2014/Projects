# app.py
# main flask application

# for command prompt -- SQLite3
# sqlite3 database.db
# .tables -- to access tables
# .exit -- to exit sqlite3 command interface
# select * from user; -- viewing users in the database
# delete from user; -- delete data from database

# for command prompt -- Python
# python app.py -- to run web app
# from app import db -- import database into python app
# db.create_all() -- create database
# exit() -- exit from python command interface
# python -m flask run -- another way to run web app
# flask run -- another way to run web app

# import libraries
from flask import Flask, render_template, redirect, url_for
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm 
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email, Length
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_manager, login_user, login_required, logout_user, current_user


# Flask
# 1. create a flask instance
app = Flask(__name__)
# 2. create a secret_key to ensure the client-end user has secure connection
app.config['SECRET_KEY'] = '\x14B~^\x07\xe1\x197\xda\x18\xa6[[\x05\x03QVg\xce%\xb2<\x80\xa4\x00'
# 3. debug the flask instance
app.config['DEBUG'] = True

# Database
# 4. connect the sqlite3 database file to the location of the project
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/Users/murie/OneDrive/Desktop/flask_project_default/database.db'
# 5. disable the sqlalchemy_track_modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# 6. debug the database
app.config['DEBUG'] = True

# Bootstrap
# 7. setup HTML5 interface with bootstrap for flask project
bootstrap = Bootstrap(app)
# 8. setup database (db) interface with SQLite3 for flask project 
db = SQLAlchemy(app)

# 9. create flask_login instance and set it up
login_manager = LoginManager()
# 10. initiate flask_login into the application
login_manager.init_app(app)
# 11. connect flask_login instance to the HTML5 instance in the flask application
login_manager.login_view = "login"

# 12. initiate the database (db) instance to the HTML5 instance in the flask application
db.init_app(app)

# used to create the database (db) file
#db.create_all()

# 13. create a class called User which will be represented as a SQLite3 table 
class User(UserMixin, db.Model):
    # 14. create 4 variables within the class which will represent columns within a SQLite3 table
    # a. id as the # of users
    id = db.Column(db.Integer, primary_key=True)
    # b. username as username of the user
    username = db.Column(db.String(15), unique=True)
    # c. email as the user's email account
    email = db.Column(db.String(50), unique=True)
    # d. password as the user's password
    password = db.Column(db.String(80))

# 15. login_manager will then load the user into the application
@login_manager.user_loader
# 16. create a def function called load_user that will allow the user to access the application
def load_user(user_id):
    # a. will return the user interface through the SQLite3 query
    return User.query.get(int(user_id))

# 17. create a FlaskForm class called loginCred (login credentials) which will pass the remembered username and password from the database into login.html
class loginCred(FlaskForm):
    # a. username as in the username of the user
    username = StringField("username", validators=[InputRequired(), Length(min=4, max=15)])
    # b. password as in the user's password
    password = PasswordField("password", validators=[InputRequired(), Length(min=8, max=80)])
    # c. remember as in remember me when I login to my account
    remember = BooleanField("remember me")

# 18. create a FlaskForm registerInfo (registration information) which will pass the new email, username, and password into the database through the signup.html
class registerInfo(FlaskForm):
    # a. email as in the user's email account
    email =StringField("email", validators=[InputRequired(), Email(message = "Invalid Email"), Length(max=50)])
    # b. username as in the username of the user
    username = StringField("username", validators=[InputRequired(), Length(min=4, max=15)])
    # c. password as in the user's password
    password = PasswordField("password", validators=[InputRequired(), Length(min=8, max=80)])

# 19. set the route for "/" to index.html
@app.route("/")
# a. create def function called index to execute the route
def index():
    # b. render html page
    return render_template('index.html')

# 20. set the route for "/login" using methods GET and POST to login.html
@app.route("/login", methods=['GET','POST'])
# a. create a def funtion called login
def login():
    # b. set the form for the login page to the FlaskForm class loginCred
    form = loginCred()
    # c. create the if statement upon the user submitting their login credentials
    if form.validate_on_submit():
        # d. set user to be equaled to user interface through the SQLite3 query by accessing the class User
        user = User.query.filter_by(username=form.username.data).first()
        # e. create if statement to check the user interface though the SQLite query upon the user inputting their credentials
        if user:
            # f. create if statement to check the hashed password from the database to see if it matches with the user input
            if check_password_hash(user.password, form.password.data):
                # f.1. if true, then it will redirect the user to the dashboard 
                login_user(user, remember=form.remember.data)
                return redirect(url_for('dashboard'))
        # f.2. if false, then the system will output a message onto the HTML5 interface for invalid credentials
        return '<h1> Invalid username and/or password! </h1>'
        #return '<h1>' + form.username.data + ' ' + form.password.data + '</h1>'
    # g. render html page
    return render_template("login.html", form=form)

# 21. set the route for the "/signup" using methods GET and POST to signup.html 
@app.route("/signup", methods=['GET', 'POST'])
# a. create a def function called signup
def signup():
    # b. set the form for the signup page to the FlaskForm class registerInfo
    form = registerInfo()
    # c. create if statement which will register new user credentials upon sumbitting them
    if form.validate_on_submit():
        # d. set hashed_password to generate hashed password onto the database when the user enters their unhashed password
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        # e. set new_user to the class User to store the new username, email and password assuming none are in the database already
        new_user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        # f. the application will then add new_user onto the database (db)
        db.session.add(new_user)
        # g. once new_user is added, the changes will be committed onto the database (db)
        db.session.commit()
        # h. will return the output message stating that the new user has been created
        return '<h1> New user created! </h1>'
        #return '<h1>' + form.username.data + ' ' + form.email.data + ' ' + form.password.data + '</h1>'
    # i. render html page
    return render_template("signup.html", form=form)

# 22. set up the route for "/dashboard" to dashboard.html (login required) 
@app.route("/dashboard")
@login_required
# a. create def function called dashboard that will execute the route as long as the user is in the database(db) and is logged in 
def dashboard():
    # b. render html page
    return render_template("dashboard.html", name=current_user.username)

# 23. set up the route for "/logout" to index.html (login required)
@app.route("/logout")
@login_required
# a. create def function called logout to redirect the user to the index page upon logging out of their account
def logout():
    # b. executes logout user
    logout_user()
    # c. redirects user to the index page
    return redirect(url_for('index'))
# 24. create if statement that if the name of the file is the main one, then program / command prompt will debug the code
if __name__ == "__main__":
    #app.run(port=3000)
    app.run(debug=True)
