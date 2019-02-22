const { DialogSet, TextPrompt, ChoicePrompt, ListStyle, WaterfallDialog } = require('botbuilder-dialogs');
const { MessageFactory, ActivityTypes } = require('botbuilder');

const { SlotFillingDialog } = require('../../services/slotFillingDialog');
const { SlotDetails } = require('../../services/slotDetails');

const DIALOG_STATE_PROPERTY = 'dialogState';

class UserInformation {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(conversationState) {
        this.logic(conversationState);
    }

    async logic(conversationState) {
        this.conversationState = conversationState;
        // Create a property used to store dialog state.
        this.dialogState = this.conversationState.createProperty(DIALOG_STATE_PROPERTY);

        // Create a dialog set to include the dialogs used by this bot.
        this.dialogs = new DialogSet(this.dialogState);

        const prompt = new ChoicePrompt('cardPrompt');
        prompt.style = ListStyle.list;
        this.dialogs.add(prompt);

        // Set up a series of questions for collecting the user's name.
        const fullnameSlots = [
            new SlotDetails('first', 'text', 'What is your first name?'),
            new SlotDetails('last', 'text', 'How about your last name?')
        ];

        // Set up a series of questions to collect a street address.
        const addressSlots = [
            new SlotDetails('street', 'text', 'Where do yo live?'),
            new SlotDetails('country', 'text', 'Tell me in which country do you live?'),
            new SlotDetails('zip', 'text', 'Please enter your zipcode.')
        ];

        const orderSlots = [
            new SlotDetails('goods', 'text', 'What do you want to order?'),
            new SlotDetails('brands', 'text', 'Which brand do you want to order?'),
            new SlotDetails('quantity', 'text', 'How many do you want to order?')
        ];

        // Link the questions together into a parent group that contains references
        // to both the fullname and address questions defined above.
        const slots = [
            new SlotDetails('fullname', 'fullname'),
            new SlotDetails('address', 'address')
        ];
        const orders = [
            new SlotDetails('order', 'order')
        ];

        // Add the individual child dialogs and prompts used.
        // Note that the built-in prompts work hand-in-hand with our custom SlotFillingDialog class
        // because they are both based on the provided Dialog class.
        this.dialogs.add(new SlotFillingDialog('address', addressSlots));
        this.dialogs.add(new SlotFillingDialog('fullname', fullnameSlots));
        this.dialogs.add(new SlotFillingDialog('order', orderSlots));
        this.dialogs.add(new TextPrompt('text'));
        this.dialogs.add(new SlotFillingDialog('slot-dialog', slots));
        this.dialogs.add(new SlotFillingDialog('order-dialog', orders));

        // Finally, add a 2-step WaterfallDialog that will initiate the SlotFillingDialog,
        // and then collect and display the results.
        this.dialogs.add(new WaterfallDialog('root', [
            this.startDialog.bind(this),
            this.processResults.bind(this),
            this.processSecondResults.bind(this)
        ]));
    }
    // This is the first step of the WaterfallDialog.
    // It kicks off the dialog with the multi-question SlotFillingDialog,
    // then passes the aggregated results on to the next step.
    async startDialog(step) {
        return await step.beginDialog('slot-dialog');
    }

    // This is the second step of the WaterfallDialog.
    // It receives the results of the SlotFillingDialog and displays them.
    async processResults(step) {
        // Each "slot" in the SlotFillingDialog is represented by a field in step.result.values.
        // The complex that contain subfields have their own .values field containing the sub-values.
        const values = step.result.values;

        const fullname = values['fullname'].values;
        await step.context.sendActivity(`Your name is ${ fullname['first'] } ${ fullname['last'] }.`);

        const address = values['address'].values;
        await step.context.sendActivity(`Your address is: ${ address['street'] }, ${ address['country'] }, ${ address['zip'] }`);

        return await step.beginDialog('order-dialog');
    }

    /**
     *
     * @param {TurnContext} turnContext A TurnContext object representing an incoming message to be handled by the bot.
     */
    async processSecondResults(step) {
        // Each "slot" in the SlotFillingDialog is represented by a field in step.result.values.
        // The complex that contain subfields have their own .values field containing the sub-values.
        const values = step.result.values;

        const order = values['order'].values;
        await step.context.sendActivity(`You order ${ order['quantity'] } ${ order['goods'] } from ${ order['brands'] } 's brand.`);

        var reply = MessageFactory.suggestedActions(['Yes', 'No'], 'Are you sure want to order?');
        await step.context.sendActivity(reply);
        const text = step.activity.text;
        const validColors = ['Red', 'Blue', 'Yellow'];

        // If the `text` is in the Array, a valid color was selected and send agreement.
        if (validColors.includes(text)) {
            await step.sendActivity(`I agree, ${ text } is the best color.`);
        } else {
        }

        return await step.endDialog();
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
module.exports.UserInformation = UserInformation;
