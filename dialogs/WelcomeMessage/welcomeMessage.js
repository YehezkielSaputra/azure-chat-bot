const { MessageFactory } = require('botbuilder');

const USER_INFORMATION = 'User Information';
const FLIGHT_ORDER = 'Flight Order';
const MULTIPLE_BUTTON = 'Multiple Button';

class WelcomeMessage {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(dialogs) {
        this.dialogs = dialogs;
    }

    /**
     * Every conversation turn for our MultilingualBot will call this method.
     * There are no dialogs used, since it's "single turn" processing, meaning a single request and
     * response, with no stateful conversation.
     * @param {Object} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
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
}

module.exports.WelcomeMessage = WelcomeMessage;
