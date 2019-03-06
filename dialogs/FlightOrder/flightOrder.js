const { DialogSet, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');

let departCity = '';
let destinationCity = '';
let totalPassanger = '';

class FlightOrder {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(ref) {
        this.dialogId = 'flightOrder';
        this.conversationState = ref.conversationState;
        this.dialogState = this.conversationState.createProperty(this.dialogId);
        this.dialogs = new DialogSet(this.dialogState);
        this.dialogs.add(new TextPrompt('text'));

        ref.dialogs.add(new WaterfallDialog(this.dialogId, [
            this.flightOrderInputDepartCity.bind(ref),
            this.flightOrderInputDestinationCity.bind(ref),
            this.flightOrderInputTotalPassanger.bind(ref),
            this.flightOrderResult.bind(ref)
        ]));

        ref.handler.push(this.dialogId);
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
    }
}

module.exports.FlightOrder = FlightOrder;
