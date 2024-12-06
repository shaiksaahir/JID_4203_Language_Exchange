# JDA-4203 | Language Exchange Matchmaker

# Release Notes
## Version 3.0.0
### Features
* Users can set their MBTI personality type, available dates and times, and profile visibility.
* Users can now access the Set Profile page from the dashboard, allowing them to update their attributes and preferences after initially setting them.
* Added a Find Friends page where users can view other users who have their profile visibility set to "show."
* Users can sort and filter listed users in the Find Friends page by their name or demographic attribute, such as age or personality type.
* Revamped the matchmaking system to show a compatability score the user has with the other listed users in the Find Friends page.
* Added a Friends List page where users can view and remove their friends.
* Users can add another user to their friends list after a video call or by selecting a user in the Find Friends page.
* Added multiple chat rooms users can join in the video call.
* Added audio and video preferences for the user.
* Added an input box in the video call which formats as a translated transcript of user-inputted text.
* After a video call, users can give a comment to their chat partner, rate them as a study partner, and analyze their proficiency.
### Version 2.0.0 Features
* Logging out and back in.
* Expanded user profile options for language proficiency, hobby, and profession.
* Matched Users can enter a virtual video conference room and communicate.
* Users can mute themselves and hide their video.
* English to Korean translator page.
### Version 1.0.0 Features
* Registering an account and logging in.
* Creating a personalized profile.
* Matching with individuals that match your needs.
* Able to view friends on dashboard page.
* Chatting with friends.
### Bug Fixes
* Made the application clonable from GitHub.
* Updated overall UI.
* Added or fixed back buttons to pages where one was missing or faulty.
* Application no longer crashes after trying to log out and back in.
* Searching for friends in the Find Friends page is now case insensitive.
* Removed previous friends list and its functionality from dashboard.
* Users' friends lists are now represented by a database in MySQL.
* Fixed video display and audio not working during a call.
* Can now test video call with multiple users.
* Post Video Call page now automatically fetches your recent chat partner.
### Known Issues
* Missing AI-enhanced speaking and listening games.
* Back button is not visually consistent in Post Video Call page.
* A blank user occasionally appears in the Friends List after adding a friend from the Post Video Call page.

# Install Guide
## PREREQUISITES 
* A computer terminal to download and run the application.
* Google Chrome to host the application.

Requirements:
* Git
* Node.js / Node Package Manager (npm)
* MySQL (easiest to just install the "full" version)

## DEPENDENCIES 
Open the project directory in your terminal under the GG folder.

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
*Note that you will need to remove your database's password and create a schema named languageexchangematchmaker in order to get the database working.* 

## DOWNLOAD
Clone this repository locally.

## BUILD 
No builds are necessary for this app.

## INSTALLATION 
No additional files need to be added.

## RUNNING APPLICATION
Backend

    cd Backend 
    npm start

Frontend

    cd Frontend
    npm start

# Troubleshooting: 
If the database does not properly migrate into MySQL, this is most commonly because your MySQL root/local instance still has a password or there is no languageexchangematchmaker schema.

To remove your root/local instance password:
* Right click on the local instance.
* Select "Start Command Line Client."
* Enter your password.
* Enter the command: set password for root@localhost='';

To create the correct schema, simply select "Create a new schema in the selected server" within your root/local instance and name it "languageexchangematchmaker"

# Tutorial Resources: 
* https://sequelize.org/docs/v6/other-topics/migrations/ 
* https://reactjs.org/tutorial/tutorial.html 
* https://www.bezkoder.com/react-node-express-mysql/. 
