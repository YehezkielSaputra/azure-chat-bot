const { CardFactory } = require('botbuilder');

const { WelcomeMessage } = require('../WelcomeMessage/welcomeMessage');

let departCity = '';
let destinationCity = '';
let totalPassanger = '';

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
    }

    async flightOrderInputDepartCity(step) {
        step.values.guestInfo = {};
        return await step.prompt('text', `Please input depart city.`);
    }

    async flightOrderInputDestinationCity(step) {
        departCity = step.result;
        return await step.prompt('text', `Please input your destination.`);
    }

    async flightOrderInputTotalPassanger(step) {
        destinationCity = step.result;
        return await step.prompt('text', `How many passanger do you want to order?`);
    }

    async flightOrderResult(step) {
        totalPassanger = step.result;
        await step.prompt('text', `You order flight ticket from  ${ departCity } to ${ destinationCity } for ${ totalPassanger } passangers.`);

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
                            value: destinationCity
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
                            value: ''
                        }
                    ])
                })
            ]
        });

        return await welcome.sendWelcomeMessage(step);
    }
}

module.exports.FlightOrder = FlightOrder;
