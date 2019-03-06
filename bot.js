/* Hardy Saputra - Call Levels */

const { DialogSet, TextPrompt } = require('botbuilder-dialogs');
const { MessageFactory } = require('botbuilder');

const { UserInformation } = require('./dialogs/UserInformation/userInformation');
const { FlightOrder } = require('./dialogs/FlightOrder/flightOrder');
const { Router } = require('./services/router');

const DIALOG_STATE_PROPERTY = 'dialogState';
const USER_INFORMATION = 'User Information';
const FLIGHT_ORDER = 'Flight Order';
const MULTIPLE_BUTTON = 'Multiple Button';

class SampleBot {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(conversationState) {
        this.conversationState = conversationState;
        this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);

        this.dialogs = new DialogSet(this.dialogState);

        this.dialogs.add(new TextPrompt('text'));
        this.handler = [];

        this.userInformation = new UserInformation(this);
        this.flightOrder = new FlightOrder(this);
    }

    /**
     * Sends welcome messages to conversation members when they join the conversation.
     * Messages are only sent to conversation members who aren't the bot.
     * @param {TurnContext} turnContext
     */
    async sendWelcomeMessage(turnContext) {
        const description = [
            'Hi I am Azure Bot.',
            'Ask me anything to continue.'
        ];
        await turnContext.sendActivity(description.join(' '));
        const reply = MessageFactory.suggestedActions([USER_INFORMATION, FLIGHT_ORDER, MULTIPLE_BUTTON], `What can i help you today?`);
        await turnContext.sendActivity(reply);
    }

    /**
     *
     * @param {TurnContext} turnContext A TurnContext object representing an incoming message to be handled by the bot.
     */
    async onTurn(turnContext) {
        await new Router().handle(this, turnContext);
    }
}

module.exports.SampleBot = SampleBot;
