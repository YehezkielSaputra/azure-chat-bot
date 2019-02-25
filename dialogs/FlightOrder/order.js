const { SlotFillingDialog } = require('../../services/slotFillingDialog');
const { SlotDetails } = require('../../services/slotDetails');

// const DIALOG_STATE_PROPERTY = 'dialogState';

class FlightOrder {
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
        const orderSlot = [
            new SlotDetails('departCityKey', 'text', 'Please input depart city'),
            new SlotDetails('destinationCityKey', 'text', 'Please input your destination'),
            new SlotDetails('totalPassangerKey', 'text', 'How many passanger do you want to order?')
        ];

        // Link the questions together into a parent group that contains references
        // to both the fullname and address questions defined above.
        const slots = [
            new SlotDetails('orderKey', 'orderSlot')
        ];

        // Add the individual child dialogs and prompts used.
        // Note that the built-in prompts work hand-in-hand with our custom SlotFillingDialog class
        // because they are both based on the provided Dialog class.
        this.dialogs.add(new SlotFillingDialog('orderSlot', orderSlot));

        // put all slot to slotfillingdialog with name detailUser-slot
        this.dialogs.add(new SlotFillingDialog('order-slot', slots));
    }
    // This is the second step of the WaterfallDialog.
    // It receives the results of the SlotFillingDialog and displays them.
    async userDialog(step) {
        // Each "slot" in the SlotFillingDialog is represented by a field in step.result.values.
        // The complex that contain subfields have their own .values field containing the sub-values.
        const values = step.result.values;
        const orderKey = values['orderKey'].values;
        await step.context.sendActivity(`You order flight ticket from ${ orderKey['departCityKey'] } to ${ orderKey['destinationCityKey'] } for ${ orderKey['totalPassangerKey'] } passangers.`);

        // console.log(this.conversationState);
        return await step.beginDialog('confirm-slot');
    }
}

module.exports.FlightOrder = FlightOrder;
