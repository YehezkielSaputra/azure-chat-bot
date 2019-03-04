const { DialogSet, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');

const { UserInformation } = require('../dialogs/UserInformation/userInformation');
const { FlightOrder } = require('../dialogs/FlightOrder/order');

class Dialogs {
    constructor(dialogState) {
        this.dialogs = new DialogSet(dialogState);

        this.dialogs.add(new TextPrompt('text'));

        var userInformation = new UserInformation(this.dialogs);
        var flightOrder = new FlightOrder(this.dialogs);

        this.dialogs.add(new WaterfallDialog('userInformation', [
            userInformation.userInformationAskFirstName.bind(this),
            userInformation.userInformationAskLastName.bind(this),
            userInformation.userInformationAskCity.bind(this),
            userInformation.userInformationAskCountry.bind(this),
            userInformation.userInformationAskZipCode.bind(this),
            userInformation.userInformationResult.bind(this)
        ]));

        this.dialogs.add(new WaterfallDialog('flightOrder', [
            flightOrder.flightOrderInputDepartCity.bind(this),
            flightOrder.flightOrderInputDestinationCity.bind(this),
            flightOrder.flightOrderInputTotalPassanger.bind(this),
            flightOrder.flightOrderResult.bind(this)
        ]));
    }
}

module.exports.Dialogs = Dialogs;
