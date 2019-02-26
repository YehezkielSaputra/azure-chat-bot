const { MessageFactory } = require('botbuilder');

const USER_INFORMATION = 'User Information';
const FLIGHT_ORDER = 'Flight Order';

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
        const reply = MessageFactory.suggestedActions([USER_INFORMATION, FLIGHT_ORDER], `What can i help you today?`);
        await turnContext.context.sendActivity(reply);
    }
}

module.exports.WelcomeMessage = WelcomeMessage;
