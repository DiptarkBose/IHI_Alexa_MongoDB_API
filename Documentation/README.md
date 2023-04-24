# Circle Bot Alexa Skill

## Setup steps
Developing the Alexa skill, requires building two components - the Voice UI using the Alexa Developer Console, and writing the Nodejs Intent Handlers. One needs to create the specific intents in the Voice UI in order to run this Nodejs endpoint. Currently the Alexa skill isn't published (as it's still WIP), and this makes the Alexa Skill untestable for others, unless the Teaching Assistants are logged in through Diptark's Amazon account. However, if the TAs still wish to test it after the demo, they can contact Diptark (diptark.bose@gatech.edu) directly and ask him to demonstrate the functionalities on a live call. Below, we outline the steps to setup just the Nodejs part of the Alexa Skill.

1. Download the complete folder.

2. Open the folder and run the command `npm install` to install all the dependencies.

3. Next up, run `alexa-skill-local` command to deploy the Nodejs Endpoint on your local machine. This step should return an ngrok link to you. The link would be something like `https://d754-4-71-27-132.ngrok.io/`.

4.  Paste the ngrok link onto the "Endpoint Section" of the skills' developer console.


# Project Components & Descriptions
This section describes the various intents that the Circle Bot Alexa Skill handles using the code written in this repository. Currently, we have been developing and testing this locally by hosting this on ngrok, but do want to eventually deploy it to a cloud instance like AWS Lambda.

## 1. Alexa Skill

The Alexa Skill Endpoint was coded using JavaScript (Nodejs). Here are the various intents it houses:

- Person Search Intent: Searches for a person based on the name provided by the patient.

- Relation Search Intent: Searches for relatives based on the relation name provided by the patient.

- Events Notification Intent: Searches and notifies patients of any upcoming events that they should be aware of.

- Self Search Intent: Helps the patient recall their own name and details.

- Anecdote Search Intent: Searches for interactions with a particular person based on the name provided by the patient.

- Birthday Query Intent: Searches for a person's DOB based on the name provided by the patient.

## 2. MongoDB Database

- This is the central storage that all the data is stored, updated, and retrieved from. Data is added to the MongoDB database via the forms on the Dashboard, and fetched for the patient's Alexa Device as per needs.
