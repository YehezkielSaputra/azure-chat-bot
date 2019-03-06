const { ActivityTypes } = require('botbuilder');
const camelCase = require('camelcase');

class Router {
    async handle(ref, turnContext) {
        if (turnContext.activity.type === ActivityTypes.Message) {
            const dc = await ref.dialogs.createContext(turnContext);
            let text = turnContext.activity.text.toLowerCase();
            if (ref.handler.indexOf(camelCase(text)) > -1) {
                await dc.beginDialog(camelCase(text));
            } else {
                await dc.continueDialog();
            }
            await ref.conversationState.saveChanges(turnContext);
        } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
            if (turnContext.activity.membersAdded.length !== 0) {
                for (let idx in turnContext.activity.membersAdded) {
                    if (turnContext.activity.membersAdded[idx].id !== turnContext.activity.recipient.id) {
                        await ref.sendWelcomeMessage(turnContext);
                    }
                }
            }
        } else {
            await turnContext.sendActivity(`[$ {turnContext.activity.type} event detected]`);
        }
    }
}

module.exports.Router = Router;
