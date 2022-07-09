YOU WILL NEED TO HAVE INSTALLED NODEJS, VUE CLI AND POSTGRESQL ON YOUR COMPUTER

BACKEND:

--CREATE EN .env FILE ON 'backend' FOLDER AND DECLARE THE FOLLOWING WITHOUT ''

TOKEN_SECRET = 'a ramdom chain for extra security'

POST_PASS = 'your password for postgreSQL to connect to the database'

--CREATE A FOLDER ON 'backend' CALLED images

--TO SET UP THE PROJECT RUN THE FOLLOWING ON TERMINAL FROM 'backend' FOLDER

npm install

--RUN THE FOLLOWING ON TERMINAL ON THE 'backend' FOLDER TO CREATE DATABASE AND TABLES (WILL RUN SCRIPT ON db.js)

node db

--FINALLY RUN THE FOLLOWING FROM 'backend' FOLDER TO START THE SERVER

node server

FRONTEND:

--TO SET UP THE PROJECT RUN THE FOLLOWING ON TERMINAL FROM 'frontend/groupomania' FOLDER

npm install

--TO RUN THE PROJECT RUN THE FOLLOWING FROM 'frontend/groupomania' FOLDER

npm run serve

This command will start a local development environment at http://localhost:8080
