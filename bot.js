/* Hardy Saputra - Call Levels */

const { ActivityTypes } = require('botbuilder');
const { DialogSet, WaterfallDialog } = require('botbuilder-dialogs');

const DIALOG_STATE_PROPERTY = 'dialogState';
const { UserInformation } = require('./dialogs/UserInformation/userInformation');

class SampleBot {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(conversationState) {
        if (!conversationState) throw new Error('Missing parameter. Conversation state is required.');
        this.conversationState = conversationState;
        this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);
        this.dialogs = new DialogSet(this.dialogState);
        this.dialogs.add(new WaterfallDialog('root', [
            this.startDialog.bind(this)
        ]));
    }

    async startDialog(step) {
        await UserInformation.startDialog(step);
    }

    /**
     *
     * @param {TurnContext} turnContext A TurnContext object representing an incoming message to be handled by the bot.
     */
    async onTurn(turnContext) {
        if (turnContext.activity.type === ActivityTypes.Message) {
            // Create dialog context.
            const dc = await this.dialogs.createContext(turnContext);

            if (!dc.context.responded) {
                // Continue the current dialog if one is pending.
                await dc.continueDialog();
            }

            if (!dc.context.responded) {
                // If no response has been sent, start the onboarding dialog.
                await dc.beginDialog('root');
            }
        } else if (
            turnContext.activity.type === ActivityTypes.ConversationUpdate &&
            turnContext.activity.membersAdded[0].name !== 'Bot'
        ) {
            // Send a "this is what the bot does" message.
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
