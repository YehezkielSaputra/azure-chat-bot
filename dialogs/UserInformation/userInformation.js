const { SlotFillingDialog } = require('../../services/slotFillingDialog');
const { SlotDetails } = require('../../services/slotDetails');
const { WelcomeMessage } = require('../WelcomeMessage/welcomeMessage');
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

        const nameSlot = [
            new SlotDetails('firstNameKey', 'text', 'What is your first name?'),
            new SlotDetails('lastNameKey', 'text', 'How about your last name?')
        ];

        const addressSlots = [
            new SlotDetails('streetKey', 'text', 'Where do yo live?'),
            new SlotDetails('countryKey', 'text', 'Tell me in which country do you live?'),
            new SlotDetails('zipKey', 'text', 'Please enter your zipcode.')
        ];

        const slots = [
            new SlotDetails('nameKeys', 'nameSlot'),
            new SlotDetails('addressKeys', 'addressSlot')
        ];

        this.dialogs.add(new SlotFillingDialog('nameSlot', nameSlot));
        this.dialogs.add(new SlotFillingDialog('addressSlot', addressSlots));
        this.dialogs.add(new SlotFillingDialog('detailUser-slot', slots));
    }

    async userDialog(step) {
        const values = step.result.values;
        const nameKeys = values['nameKeys'].values;
        await step.context.sendActivity(`Your name is ${ nameKeys['firstNameKey'] } ${ nameKeys['lastNameKey'] }.`);

        const address = values['addressKeys'].values;
        await step.context.sendActivity(`Your address is: ${ address['streetKey'] }, ${ address['countryKey'] }, ${ address['zipKey'] }`);

        var welcome = new WelcomeMessage(step);
        return await welcome.sendWelcomeMessage(step);
    }
}

module.exports.UserInformation = UserInformation;
