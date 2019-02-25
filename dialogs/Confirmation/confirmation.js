const { CardFactory } = require('botbuilder');
const { SlotFillingDialog } = require('../../services/slotFillingDialog');
const { SlotDetails } = require('../../services/slotDetails');

// const DIALOG_STATE_PROPERTY = 'dialogState';

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

        // Set up a series of questions for collecting the user's name.
        const confirmSlot = [
            new SlotDetails('confirmKey', 'text', 'Please, type yes if you want to continue transaction.')
        ];

        // Add the individual child dialogs and prompts used.
        // Note that the built-in prompts work hand-in-hand with our custom SlotFillingDialog class
        // because they are both based on the provided Dialog class.
        this.dialogs.add(new SlotFillingDialog('confirm-slot', confirmSlot));
    }
    // This is the second step of the WaterfallDialog.
    // It receives the results of the SlotFillingDialog and displays them.
    async confirmDialog(step) {
        const values = step.result.values;
        console.log(this.conversationState.stack);
        console.log(step.result);
        if (values.confirmKey.toLowerCase() === 'yes') {
            // const demo = CardFactory.receiptCard(this.card);
            const departCity = '';
            const destination = '';
            const totalPassanger = '';
            await step.context.sendActivity({
                text: 'Thanks for your participation',
                attachments: [
                    CardFactory.receiptCard({
                        title: 'Your recipient card',
                        facts: [
                            {
                                key: 'Depart City',
                                value: departCity
                            },
                            {
                                key: 'Destination',
                                value: destination
                            },
                            {
                                key: 'Total Passanger',
                                value: totalPassanger
                            }
                        ],
                        buttons: CardFactory.actions([
                            {
                                type: 'openUrl',
                                title: 'Submit',
                                value: 'https://google.com'
                            }
                        ])
                    })
                ]
            });
        } else {
            await step.context.sendActivity('Are you sure?');
        }
        return await step.endDialog();
    }
}

module.exports.Confirmation = Confirmation;
