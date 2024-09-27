# JID-4203 | Language Exchange Matchmaker
This project aims to continue development on an AI-enhanced matchmaking app for language exchange, specifically designed to help exchange students at Georgia Tech and Yonsei University in Korea improve their English and Korean language skills. The goal is to bridge the language gap, making it easier for students to form friendships and enhance their learning experience while participating in exchange programs.

# Release Notes
## Version 2.2.0
### Features
* Added way to specify maximum number of partners available to join a video call
* Added a list of video preferences for users to filter patners
* Added a list of audio preferences for users to filter partners
### Bug Fixes
* Fixed Video Call page format issues
### Known Issues
* 

## Version 2.1.0
### Features
* Added a Find Friend page which lists the names of all the other accounts on the application for users to browse
* Added option to select users from Friend List and add them to/remove from a list of Recent Chat Partners
* Added option to filter and sort users from Friend List 
* Added MBTI personality type selector on the profile creation page
* Added available dates and times selector on the profile creation page
* Added profile visibility on the profile creation page
### Bug Fixes
* Made the application clonable from GitHub
* Fixed the import statement in APIController.js so that the GET and POST requests could use pool.execute
### Known Issues
* UserNames are not attached to profile preferences of the user, like MBTI or meeting time
* Profile visibility does not do anything since our creation of profiles will be in a later sprint. It is connected to the backend and database.

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
