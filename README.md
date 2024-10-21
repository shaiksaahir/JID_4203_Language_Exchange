# JDA-4203 | Language Exchange Matchmaker

# Release Notes
## Version 2.3.0
### Features
* Added a way for users to leave comments after calling another user
### Bug Fixes
* Fixed video display not working during a call
* Fixed UserProfile database migration issue
* Searching for friends is now case insensitive
* Application crashing in certain profile generation cases is now fixed
* Added a back button to pages where one was missing
* Fixed display of all buttons
* Centered necessary UI objects
* Find Friends page has consistent UI
### Known Issues
* Video calling throws errors
* Selecting a user on the Find Friends page does not add them to the friendsmodel database

## Version 2.2.0
### Features
* Added way to specify maximum number of partners available to join a video call
* Added an input box in the Video Room which formats as a translated transcript of user-inputted text
* Added audio preferences for the user; updated mute button and added microphone selection
* Added video preferences; can now show and hide video
### Bug Fixes
* Fixed Video Call page format issues
* Fixed FriendsList backend database showing "Network Error"
* Fixed FriendsList sorting by preferences
### Known Issues
* Audio and Video features are not working from the previous iteration of the project
* Several Node modules are not working properly

## Version 2.1.0
### Features
* Added a Find Friend page which lists the names of all the other accounts on the application for users to browse
* Added option to select users from Friend List and add them to/remove from a list of Recent Chat Partners
* Added option to filter and sort users from Friend List 
* Added MBTI personality type selector on the profile creation page
* Added available dates and times selector on the profile creation page
* Added profile visibility on the profile creation page
* Added an input box in the VideoRoom which will create a translated transcript of user-inputted text
### Bug Fixes
* Made the application clonable from GitHub
### Known Issues
* Backend is not connected
* userprofile MySQL table not up-to-date

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
