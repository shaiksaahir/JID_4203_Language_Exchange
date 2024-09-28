# JID-4203 | Language Exchange Matchmaker

# Release Notes
## Version 2.1.0
### Features
* Added MBTI personality type selector on profile creation page
* Added a Find Friend page which lists the names of all the other accounts on the application for users to browse
### Bug Fixes
* Made the application clonable from GitHub
* fixed the import statement in APIController.js so that the GET and POST requests could use pool.execute
### Known Issues
* \#1 userprofile MySQL table not up-to-date
* UserNames are not attached to profile preferences of the user, like MBTI or meeting time

# Install Guide
## PREREQUISITES 
You should have an IDE like Visual Studio Code installed.

Requirements:
* Git
* Node.js / Node Package Manager (npm)
* MySQL (easiest to just install the "full" version)
  
## DOWNLOAD
Clone this repository locally.

## DEPENDENCIES 
Open the project directory in your terminal.

For Backend dependencies (terminal commands): 

    cd Backend
    npm install

For Frontend dependecies (terminal commands): 

    cd Frontend 
    npm install --legacy-peer-deps
    npm install translate --legacy-peer-deps

To migrate the database:

    cd Backend/src 
    npx sequelize-cli db:migrate
*Note that you will need to remove your database's password and create a schema named languageexchangematchmaker in order to get things working.* 

## BUILD 
No builds are necessary for this app.

## INSTALLATION 
No additional files need to be added 

## RUNNING APPLICATION
Backend

    cd Backend 
    npm start

Frontend

    cd Frontend
    npm start

# Tutorial Resources: 
* https://sequelize.org/docs/v6/other-topics/migrations/ 
* https://reactjs.org/tutorial/tutorial.html 
* https://www.bezkoder.com/react-node-express-mysql/ 