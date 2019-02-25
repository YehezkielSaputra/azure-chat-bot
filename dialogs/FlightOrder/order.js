const { SlotFillingDialog } = require('../../services/slotFillingDialog');
const { SlotDetails } = require('../../services/slotDetails');
const { CardFactory } = require('botbuilder');

class FlightOrder {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(dialogs) {
        this.logic(dialogs);
    }
    async logic(dialogs) {
        this.dialogs = dialogs;

        const orderSlot = [
            new SlotDetails('departCityKey', 'text', 'Please input depart city'),
            new SlotDetails('destinationCityKey', 'text', 'Please input your destination'),
            new SlotDetails('totalPassangerKey', 'text', 'How many passanger do you want to order?')
        ];

        const slots = [
            new SlotDetails('orderKey', 'orderSlot')
        ];

        this.dialogs.add(new SlotFillingDialog('orderSlot', orderSlot));
        this.dialogs.add(new SlotFillingDialog('order-slot', slots));
    }

    async userDialog(step) {
        const values = step.result.values;
        const orderKey = values['orderKey'].values;
        await step.context.sendActivity(`You order flight ticket from ${ orderKey['departCityKey'] } to ${ orderKey['destinationCityKey'] } for ${ orderKey['totalPassangerKey'] } passangers.`);

        const departCity = orderKey['departCityKey'];
        const destination = orderKey['destinationCityKey'];
        const totalPassanger = orderKey['totalPassangerKey'];
        await step.context.sendActivity({
            text: 'Flight Order',
            attachments: [
                CardFactory.receiptCard({
                    title: 'Your Receipt Card',
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
        return await step.beginDialog('confirm-slot');
    }

    async confirmDialog(step) {
        return await step.endDialog();
    }
}

module.exports.FlightOrder = FlightOrder;
