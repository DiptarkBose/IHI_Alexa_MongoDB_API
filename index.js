const Alexa = require('ask-sdk-core');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://teamDPI:teamDPI@familyremindersdb.nnuiz8t.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const PersonSearchHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PersonSearch';
    },
    async handle(handlerInput) {
        const myDetails = await client.db("FamilyRemindersAppDB").collection("Patient").findOne({ firstName: "John" });
        const family = myDetails["family"];
        var recognized = false;
        var relationship = "";
        const personName = handlerInput.requestEnvelope.request.intent.slots.HumanName.value;
        for (const relation in family) {
          const personList = family[relation];
          for (let i=0; i<personList.length; i++) {
            personID = personList[i];
            const personDetails = await client.db("FamilyRemindersAppDB").collection("Person").findOne({ id: personID });
            if(personDetails.firstName == personName) {
              recognized = true;
              relationship = relation.toLowerCase();
              break;
            }
          }
        }
        var speakOutput = "";
        if(recognized) {
          speakOutput = personName + " is your " + relationship + ". If you want to know more about interactions with them, you can ask me to tell you some anecdotes with " + personName + ".";
        } else {
          speakOutput = "I don't think you know anyone by the name " + personName + ".";
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const BirthdayQueryHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BirthdayQuery';
    },
    async handle(handlerInput) {
        const myDetails = await client.db("FamilyRemindersAppDB").collection("Patient").findOne({ firstName: "John" });
        const family = myDetails["family"];
        var recognized = false;
        var birthday = "";
        const personName = handlerInput.requestEnvelope.request.intent.slots.HumanName.value;
        for (const relation in family) {
          const personList = family[relation];
          for (let i=0; i<personList.length; i++) {
            personID = personList[i];
            const personDetails = await client.db("FamilyRemindersAppDB").collection("Person").findOne({ id: personID });
            if(personDetails.firstName == personName) {
              recognized = true;
              birthday = personDetails.dob;
              break;
            }
          }
        }
        var speakOutput = "";
        if(recognized) {
          speakOutput = personName + " was born on " + birthday + ".";
        } else {
          speakOutput = "I can't find " + personName + "'s birthday.";
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SelfSearchHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SelfSearch';
    },
    async handle(handlerInput) {
        const myDetails = await client.db("FamilyRemindersAppDB").collection("Patient").findOne({ firstName: "John" });
        const speakOutput = "Your name is " + myDetails.firstName + ". You were born on "+ myDetails.dob + ".";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const EventNotificationHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EventNotification';
    },
    async handle(handlerInput) {
        const myDetails = await client.db("FamilyRemindersAppDB").collection("Patient").findOne({ firstName: "John" });
        const events = myDetails.events;
        var speakOutput = "";
        if(events.length > 0) {
          speakOutput += "Here are some upcoming events that you should be aware of: \n";
          for(let i=0; i<events.length; i++) {
            const eventID = events[i];
            const eventDetails = await client.db("FamilyRemindersAppDB").collection("Event").findOne({ id: eventID });
            if(i != 0) {
              speakOutput += "Also, ";
            }
            speakOutput += eventDetails.title + " on " + eventDetails.startDate +  ": " + eventDetails.description + "\n\n";
          }
        } else {
          speakOutput = "You don't seem to have any upcoming events."
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const AnecdoteSearchHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnecdoteSearch';
    },
    async handle(handlerInput) {
        const personName = handlerInput.requestEnvelope.request.intent.slots.HumanName.value;
        const personDetails = await client.db("FamilyRemindersAppDB").collection("Person").findOne({ firstName: personName });
        const myDetails = await client.db("FamilyRemindersAppDB").collection("Patient").findOne({ firstName: "John" });
        const anecdotes = myDetails.anecdotes;
        var speakOutput = "";
        if(myDetails.anecdotes[personDetails.id] != null) {
          const anecdoteIDList = anecdotes[personDetails.id];
          speakOutput = "Here are some interactions you've had with "+personName+": \n";
          for(let i=0; i<anecdoteIDList.length; i++) {
            const anecdoteID = anecdoteIDList[i];
            const anecdote = await client.db("FamilyRemindersAppDB").collection("Anecdote").findOne({ id: anecdoteID });
            if(i != 0) {
              speakOutput += "Also, ";
            }
            speakOutput += anecdote.title + ": " + anecdote.description + "\n\n";
          }
        } else {
            speakOutput += "I'm sorry, but I don't have any records of any interactions with " + personName +".";
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RelationSearchHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RelationSearch';
    },
    async handle(handlerInput) {
        const myDetails = await client.db("FamilyRemindersAppDB").collection("Patient").findOne({ firstName: "John" });
        const family = myDetails.family;
        var relation = handlerInput.requestEnvelope.request.intent.slots.Relationship.value;
        relation = relation.charAt(0).toUpperCase() + relation.slice(1);
        var speakOutput = "";

        if(family[relation] != null) {
          speakOutput += "Yes, you have " + family[relation].length + ". Their names are ";
          const personList = family[relation];
          for (let i=0; i<personList.length; i++) {
            personID = personList[i];
            const personDetails = await client.db("FamilyRemindersAppDB").collection("Person").findOne({ id: personID });
            if(personList.length!= 1 && i == personList.length-1) {
              speakOutput += " and ";
            }
            else if(i != 0) {
              speakOutput += ", ";
            }
            speakOutput += personDetails.firstName;
          }
          speakOutput += ".";
        } else {
          speakOutput += "Nope, you don't have any " + relation + "s.";
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = "Hi! I am Circle Bot, an Alexa skill that helps you stay in touch with all family and friends! What can I help you with?";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      var speakOutput = "I can help you with all things related to friends and family. You can ask me things like: \n";
      speakOutput += "Who is Patrice?\n";
      speakOutput += "Do I have a daughter?\n";
      speakOutput += "Remind me of interactions with Emily?\n";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = "Goodbye!";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = "Sorry, I don\'t know about that. Please try again.";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = "Sorry, I had trouble doing what you asked. Please try again.";
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        PersonSearchHandler,
        SelfSearchHandler,
        RelationSearchHandler,
        AnecdoteSearchHandler,
        EventNotificationHandler,
        BirthdayQueryHandler,
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
