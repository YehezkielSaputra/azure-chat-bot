const { DialogBuilder } = require('../../services/dialogBuilder');
const { DetailDialog } = require('../../services/detailDialog');

const { MessageFactory } = require('botbuilder');
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
            new DetailDialog('confirmKey', 'text', 'Please, type ok if you want to continue transaction.')
        ];

        this.dialogs.add(new DialogBuilder('confirm-slot', confirmSlot));
    }
    /**
     * Every conversation turn for our SuggestedActionsbot will call this method.
     * There are no dialogs used, since it's "single turn" processing, meaning a single request and
     * response, with no stateful conversation.
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    async confirmDialog(turnContext) {
        const values = turnContext.result.values;
        if (values.confirmKey.toLowerCase() === 'ok') {
            var reply = MessageFactory.suggestedActions(['Yes', 'No'], 'Do you want to do more transaction?');
            await turnContext.context.sendActivity('Thank you for transaction with us.');
            await turnContext.context.sendActivity(reply);
        } else {
            await turnContext.context.sendActivity('Are you sure?');
        }
        return await turnContext.endDialog();
    }
}

module.exports.Confirmation = Confirmation;
