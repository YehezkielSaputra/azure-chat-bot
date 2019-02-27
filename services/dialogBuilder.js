const { ActivityTypes } = require('botbuilder');
const { Dialog } = require('botbuilder-dialogs');

const SlotName = 'slot';
const PersistedValues = 'values';

class DialogBuilder extends Dialog {
    /**
     * @param {string} dialogId A unique identifier for this dialog.
     * @param {Array} slots An array of SlotDetails that define the required slots.
     */
    constructor(dialogId, slots) {
        super(dialogId);
        this.slots = slots;
    }

    async beginDialog(dc, options) {
        if (dc.context.activity.type !== ActivityTypes.Message) {
            return Dialog.EndOfTurn;
        }

        dc.activeDialog.state[PersistedValues] = {};

        return await this.runPrompt(dc);
    }

    async continueDialog(dc) {
        if (dc.context.activity.type !== ActivityTypes.Message) {
            return Dialog.EndOfTurn;
        }

        return await this.runPrompt(dc);
    }

    async resumeDialog(dc, reason, result) {
        const slotName = dc.activeDialog.state[SlotName];

        const values = dc.activeDialog.state[PersistedValues];

        values[slotName] = result;

        return await this.runPrompt(dc);
    }

    async runPrompt(dc) {
        const state = dc.activeDialog.state;
        const values = state[PersistedValues];

        const unfilledSlot = this.slots.filter(function(slot) { return !Object.keys(values).includes(slot.name); });

        if (unfilledSlot.length) {
            state[SlotName] = unfilledSlot[0].name;
            return await dc.prompt(unfilledSlot[0].promptId, unfilledSlot[0].options);
        } else {
            return await dc.endDialog(dc.activeDialog.state);
        }
    }
}

module.exports.DialogBuilder = DialogBuilder;
