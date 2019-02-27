const { CardFactory } = require('botbuilder');

const { DialogBuilder } = require('../../services/dialogBuilder');
const { DetailDialog } = require('../../services/detailDialog');
const { WelcomeMessage } = require('../WelcomeMessage/welcomeMessage');

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
            new DetailDialog('departCityKey', 'text', 'Please input depart city'),
            new DetailDialog('destinationCityKey', 'text', 'Please input your destination'),
            new DetailDialog('totalPassangerKey', 'text', 'How many passanger do you want to order?')
        ];

        const slots = [
            new DetailDialog('orderKey', 'orderSlot')
        ];

        this.dialogs.add(new DialogBuilder('orderSlot', orderSlot));
        this.dialogs.add(new DialogBuilder('order-slot', slots));
    }

    async userDialog(step) {
        const values = step.result.values;
        const orderKey = values['orderKey'].values;
        await step.context.sendActivity(`You order flight ticket from ${ orderKey['departCityKey'] } to ${ orderKey['destinationCityKey'] } for ${ orderKey['totalPassangerKey'] } passangers.`);

        const departCity = orderKey['departCityKey'];
        const destination = orderKey['destinationCityKey'];
        const totalPassanger = orderKey['totalPassangerKey'];

        var welcome = new WelcomeMessage(step);
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
                            value: welcome.sendWelcomeMessage(step)
                        }
                    ])
                })
            ]
        });

        return await welcome.sendWelcomeMessage(step);
    }
}

module.exports.FlightOrder = FlightOrder;
