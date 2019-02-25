const { SlotFillingDialog } = require('../../services/slotFillingDialog');
const { SlotDetails } = require('../../services/slotDetails');

// const DIALOG_STATE_PROPERTY = 'dialogState';

class UserInformation {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(dialogs) {
        this.logic(dialogs);
        // this.logic(conversationState);
    }
    async logic(dialogs) {
        this.dialogs = dialogs;

        // Set up a series of questions for collecting the user's name.
        const nameSlot = [
            new SlotDetails('firstNameKey', 'text', 'What is your first name?'),
            new SlotDetails('lastNameKey', 'text', 'How about your last name?')
        ];

        // Set up a series of questions to collect a street address.
        const addressSlots = [
            new SlotDetails('streetKey', 'text', 'Where do yo live?'),
            new SlotDetails('countryKey', 'text', 'Tell me in which country do you live?'),
            new SlotDetails('zipKey', 'text', 'Please enter your zipcode.')
        ];

        // Link the questions together into a parent group that contains references
        // to both the fullname and address questions defined above.
        const slots = [
            new SlotDetails('nameKeys', 'nameSlot'),
            new SlotDetails('addressKeys', 'addressSlot')
        ];

        // Add the individual child dialogs and prompts used.
        // Note that the built-in prompts work hand-in-hand with our custom SlotFillingDialog class
        // because they are both based on the provided Dialog class.
        this.dialogs.add(new SlotFillingDialog('nameSlot', nameSlot));
        this.dialogs.add(new SlotFillingDialog('addressSlot', addressSlots));

        // put all slot to slotfillingdialog with name detailUser-slot
        this.dialogs.add(new SlotFillingDialog('detailUser-slot', slots));
    }
    // This is the second step of the WaterfallDialog.
    // It receives the results of the SlotFillingDialog and displays them.
    async userDialog(step) {
        // Each "slot" in the SlotFillingDialog is represented by a field in step.result.values.
        // The complex that contain subfields have their own .values field containing the sub-values.
        const values = step.result.values;
        const nameKeys = values['nameKeys'].values;
        await step.context.sendActivity(`Your name is ${ nameKeys['firstNameKey'] } ${ nameKeys['lastNameKey'] }.`);

        const address = values['addressKeys'].values;
        await step.context.sendActivity(`Your address is: ${ address['streetKey'] }, ${ address['countryKey'] }, ${ address['zipKey'] }`);

        // console.log(this.conversationState);
        return await step.beginDialog('order-slot');
    }
}

module.exports.UserInformation = UserInformation;
