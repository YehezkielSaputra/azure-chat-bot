/* Hardy Saputra - Call Levels */

const { DialogSet, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { ActivityTypes } = require('botbuilder');

const { UserInformation } = require('./dialogs/UserInformation/userInformation');
const { FlightOrder } = require('./dialogs/FlightOrder/order');
const { Confirmation } = require('./dialogs/Confirmation/confirmation');

const DIALOG_STATE_PROPERTY = 'dialogState';

class SampleBot {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(conversationState) {
        this.logic(conversationState);
    }
    async logic(conversationState) {
        this.conversationState = conversationState;
        this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);

        this.dialogs = new DialogSet(this.dialogState);

        this.dialogs.add(new TextPrompt('text'));

        var userDetail = new UserInformation(this.dialogs);
        var flightOrder = new FlightOrder(this.dialogs);
        var confirmation = new Confirmation(this.dialogs);

        this.dialogs.add(new WaterfallDialog('root', [
            this.startDialog.bind(this),
            userDetail.userDialog.bind(this),
            flightOrder.userDialog.bind(this),
            confirmation.confirmDialog.bind(this)
        ]));
    }

    async startDialog(step) {
        return await step.beginDialog('detailUser-slot');
    }

    /**
     *
     * @param {TurnContext} turnContext A TurnContext object representing an incoming message to be handled by the bot.
     */
    async onTurn(turnContext) {
        if (turnContext.activity.type === ActivityTypes.Message) {
            const dc = await this.dialogs.createContext(turnContext);

            if (!dc.context.responded) {
                await dc.continueDialog();
            }

            if (!dc.context.responded) {
                await dc.beginDialog('root');
            }
        } else if (
            turnContext.activity.type === ActivityTypes.ConversationUpdate &&
            turnContext.activity.membersAdded[0].name !== 'Bot'
        ) {
            const description = [
                'This is a bot that demonstrates to collect multiple responses from a user.',
                'Say anything to continue.'
            ];
            await turnContext.sendActivity(description.join(' '));
        }

        await this.conversationState.saveChanges(turnContext);
    }
}
module.exports.SampleBot = SampleBot;
