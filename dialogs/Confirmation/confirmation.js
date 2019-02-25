const { SlotFillingDialog } = require('../../services/slotFillingDialog');
const { SlotDetails } = require('../../services/slotDetails');

class Confirmation {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */

    constructor(dialogs) {
        this.logic(dialogs);
    }
    async logic(dialogs) {
        this.dialogs = dialogs;

        const confirmSlot = [
            new SlotDetails('confirmKey', 'text', 'Please, type yes if you want to continue transaction.')
        ];

        this.dialogs.add(new SlotFillingDialog('confirm-slot', confirmSlot));
    }

    async confirmDialog(step) {
        const values = step.result.values;
        if (values.confirmKey.toLowerCase() === 'yes') {
            await step.context.sendActivity('Your transaction will be processing soon. Thank you.');
        } else {
            await step.context.sendActivity('Are you sure?');
        }
        return await step.endDialog();
    }
}

module.exports.Confirmation = Confirmation;
