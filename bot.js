/* Hardy Saputra - Call Levels */

const { DialogSet, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { ActivityTypes, MessageFactory } = require('botbuilder');

const USER_INFORMATION = 'User Information';
const FLIGHT_ORDER = 'Flight Order';
const WELCOMED_USER = 'welcomedUserProperty';

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
        this.welcomedUserProperty = conversationState.createProperty(WELCOMED_USER);
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

        this.dialogs.add(new WaterfallDialog('userInformation', [
            this.startDialog.bind(this),
            userDetail.userDialog.bind(this)
        ]));
        this.dialogs.add(new WaterfallDialog('flightOrder', [
            this.startSecondDialog.bind(this),
            flightOrder.userDialog.bind(this),
            confirmation.confirmDialog.bind(this)
        ]));
    }

    async startDialog(step) {
        return await step.beginDialog('detailUser-slot');
    }

    async startSecondDialog(step) {
        return await step.beginDialog('order-slot');
    }

    /**
     * Sends welcome messages to conversation members when they join the conversation.
     * Messages are only sent to conversation members who aren't the bot.
     * @param {TurnContext} turnContext
     */
    async sendWelcomeMessage(turnContext) {
        if (turnContext.activity.membersAdded.length !== 0) {
            for (let idx in turnContext.activity.membersAdded) {
                if (turnContext.activity.membersAdded[idx].id !== turnContext.activity.recipient.id) {
                    const description = [
                        'Hi I am Azure Bot.',
                        'Ask me anything to continue.'
                    ];
                    await turnContext.sendActivity(description.join(' '));
                    const reply = MessageFactory.suggestedActions([USER_INFORMATION, FLIGHT_ORDER], `What can i help you today?`);
                    await turnContext.sendActivity(reply);
                }
            }
        }
    }

    /**
     *
     * @param {TurnContext} turnContext A TurnContext object representing an incoming message to be handled by the bot.
     */
    async onTurn(turnContext) {
        if (turnContext.activity.type === ActivityTypes.Message) {
            const dc = await this.dialogs.createContext(turnContext);
            let text = turnContext.activity.text.toLowerCase();
            switch (text) {
            case 'user information':
                await dc.beginDialog('userInformation');
                break;
            case 'flight order':
                await dc.beginDialog('flightOrder');
                break;
            default :
                await dc.continueDialog();
            }
            await this.conversationState.saveChanges(turnContext);
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
            await this.sendWelcomeMessage(turnContext);
        } else {
            await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
        }
    }
}
module.exports.SampleBot = SampleBot;
