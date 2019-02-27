const { WelcomeMessage } = require('../WelcomeMessage/welcomeMessage');

let firstName = '';
let lastName = '';
let city = '';
let country = '';
let zipCode = '';

class UserInformation {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(dialogs) {
        this.logic(dialogs);
    }

    async logic(dialogs) {
        this.dialogs = dialogs;
    }

    async userInformationAskFirstName(step) {
        step.values.guestInfo = {};
        return await step.prompt('text', `What is your first name?`);
    }

    async userInformationAskLastName(step) {
        firstName = step.result;
        return await step.prompt('text', `Hi ${ firstName }. How about your last name?`);
    }

    async userInformationAskCity(step) {
        lastName = step.result;
        return await step.prompt('text', `Where do yo live?`);
    }

    async userInformationAskCountry(step) {
        city = step.result;
        return await step.prompt('text', `Tell me in which country do you live?`);
    }

    async userInformationAskZipCode(step) {
        country = step.result;
        return await step.prompt('text', `Please enter your zipcode.`);
    }

    async userInformationResult(step) {
        zipCode = step.result;
        await step.prompt('text', `Hi ${ firstName } ${ lastName }.`);
        await step.prompt('text', `Your address is ${ city } , ${ country } ,  ${ zipCode }.`);

        var welcome = new WelcomeMessage(step);
        return await welcome.sendWelcomeMessage(step);
    }
}

module.exports.UserInformation = UserInformation;
