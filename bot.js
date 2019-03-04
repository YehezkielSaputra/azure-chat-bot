/* Hardy Saputra - Call Levels */

const { DialogSet } = require('botbuilder-dialogs');
const { ActivityTypes, CardFactory } = require('botbuilder');

const { WelcomeMessage } = require('./dialogs/WelcomeMessage/welcomeMessage');
const { Dialogs } = require('./services/dialogs');

const WelcomeCard = require('./services/WelcomeCard.json');

const DIALOG_STATE_PROPERTY = 'dialogState';

class SampleBot {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(conversationState) {
        this.conversationState = conversationState;
        this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);

        this.dialogs = new DialogSet(this.dialogState);

        this.route = new Dialogs(this.dialogState);
    }

    /**
     * Sends welcome messages to conversation members when they join the conversation.
     * Messages are only sent to conversation members who aren't the bot.
     * @param {TurnContext} turnContext
     */

    /**
     *
     * @param {TurnContext} turnContext A TurnContext object representing an incoming message to be handled by the bot.
     */
    async onTurn(turnContext) {
        if (turnContext.activity.type === ActivityTypes.Message) {
            const dc = await this.route.dialogs.createContext(turnContext);
            let text = turnContext.activity.text.toLowerCase();
            switch (text) {
            case 'user information':
                await dc.beginDialog('userInformation');
                break;
            case 'flight order':
                await dc.beginDialog('flightOrder');
                break;
            case 'multiple button':
                await turnContext.sendActivity({
                    text: 'Intro Adaptive Card',
                    attachments: [CardFactory.adaptiveCard(WelcomeCard)]
                });
                break;
            default :
                await dc.continueDialog();
            }
            await this.conversationState.saveChanges(turnContext);
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
            if (turnContext.activity.membersAdded.length !== 0) {
                for (let idx in turnContext.activity.membersAdded) {
                    if (turnContext.activity.membersAdded[idx].id !== turnContext.activity.recipient.id) {
                        var welcome = new WelcomeMessage(turnContext);
                        await welcome.sendWelcomeMessage(turnContext);
                    }
                }
            }
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }
}
module.exports.SampleBot = SampleBot;
