/* Hardy Saputra - Call Levels */

const { ActivityTypes, CardFactory, AttachmentLayoutTypes } = require('botbuilder');
// const { UserInformation } = require('./components/UserInformationDialogue/userInformation');

class SampleBot {
    /**
     * SampleBot defines the core business logic of this bot.
     * @param {ConversationState} conversationState A ConversationState object used to store dialog state.
     */
    constructor(conversationState) {
        this.logic(conversationState);
    }

    async sendCardResponse(turnContext, dialogTurnResult) {
        switch (dialogTurnResult.result.value) {
        case 'Animation Card':
            await turnContext.sendActivity({ attachments: [this.createAnimationCard()] });
            break;
        case 'Audio Card':
            await turnContext.sendActivity({ attachments: [this.createAudioCard()] });
            break;
        case 'Hero Card':
            await turnContext.sendActivity({ attachments: [this.createHeroCard()] });
            break;
        case 'Receipt Card':
            await turnContext.sendActivity({ attachments: [this.createReceiptCard()] });
            break;
        case 'Signin Card':
            await turnContext.sendActivity({ attachments: [this.createSignInCard()] });
            break;
        case 'Thumbnail Card':
            await turnContext.sendActivity({ attachments: [this.createThumbnailCard()] });
            break;
        case 'Video Card':
            await turnContext.sendActivity({ attachments: [this.createVideoCard()] });
            break;
        case 'All Cards':
            await turnContext.sendActivity({
                attachments: [this.createVideoCard(),
                    this.createAnimationCard(),
                    this.createAudioCard(),
                    this.createHeroCard(),
                    this.createReceiptCard(),
                    this.createSignInCard(),
                    this.createThumbnailCard(),
                    this.createVideoCard()
                ],
                attachmentLayout: AttachmentLayoutTypes.Carousel
            });
            break;
        default:
            await turnContext.sendActivity('An invalid selection was parsed. No corresponding Rich Cards were found.');
        }
    }

    /**
     *
     * @param {TurnContext} turnContext A TurnContext object representing an incoming message to be handled by the bot.
     */
    async onTurn(turnContext) {
        if (turnContext.activity.type === ActivityTypes.Message) {
            const text = turnContext.activity.text;

            // Create an array with the valid color options.
            const validColors = ['Red', 'Blue', 'Yellow'];

            // If the `text` is in the Array, a valid color was selected and send agreement.
            if (validColors.includes(text)) {
                await turnContext.sendActivity(`I agree, ${ text } is the best color.`);
            } else {
            }

            // After the bot has responded send the suggested actions.
            //

            // Create dialog context.
            const dc = await this.dialogs.createContext(turnContext);

            const utterance = (turnContext.activity.text || '').trim().toLowerCase();

            if (utterance === 'card') {
                const promptOptions = {
                    prompt: 'Please select a card:',
                    retryPrompt: 'That was not a valid choice, please select a card or number from 1 to 8.',
                    choices: this.getChoices()
                };

                await turnContext.sendActivity('Welcome to the Rich Cards Bot!');
                await dc.prompt('cardPrompt', promptOptions);
            }

            if (utterance === 'animation') {
                await turnContext.sendActivity({ attachments: [this.createAnimationCard()] });
            }

            if (utterance === 'audio') {
                await turnContext.sendActivity({ attachments: [this.createAudioCard()] });
            }

            if (utterance === 'hero') {
                await turnContext.sendActivity({ attachments: [this.createHeroCard()] });
            }

            if (utterance === 'receipt') {
                await turnContext.sendActivity({ attachments: [this.createReceiptCard()] });
            }

            if (utterance === 'signin') {
                await turnContext.sendActivity({ attachments: [this.createSignInCard()] });
            }

            if (utterance === 'thumbnail') {
                await turnContext.sendActivity({ attachments: [this.createThumbnailCard()] });
            }

            if (utterance === 'video') {
                await turnContext.sendActivity({ attachments: [this.createVideoCard()] });
            }

            if (utterance === 'cancel') {
                if (dc.activeDialog) {
                    await dc.cancelAllDialogs();
                    await dc.context.sendActivity(`Ok... canceled.`);
                } else {
                    await dc.context.sendActivity(`Nothing to cancel.`);
                }
            }

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

    /**
     * Create the choices with synonyms to render for the user during the ChoicePrompt.
     */
    getChoices() {
        const cardOptions = [
            {
                value: 'Animation Card',
                synonyms: ['1', 'animation', 'animation card']
            },
            {
                value: 'Audio Card',
                synonyms: ['2', 'audio', 'audio card']
            },
            {
                value: 'Hero Card',
                synonyms: ['3', 'hero', 'hero card']
            },
            {
                value: 'Receipt Card',
                synonyms: ['4', 'receipt', 'receipt card']
            },
            {
                value: 'Signin Card',
                synonyms: ['5', 'signin', 'signin card']
            },
            {
                value: 'Thumbnail Card',
                synonyms: ['6', 'thumbnail', 'thumbnail card']
            },
            {
                value: 'Video Card',
                synonyms: ['7', 'video', 'video card']
            },
            {
                value: 'All Cards',
                synonyms: ['8', 'all', 'all cards']
            }
        ];

        return cardOptions;
    }

    createAnimationCard() {
        return CardFactory.animationCard(
            'Microsoft Bot Framework',
            [
                { url: 'https://i.giphy.com/Ki55RUbOV5njy.gif' }
            ],
            [],
            {
                subtitle: 'Animation Card'
            }
        );
    }

    createAudioCard() {
        return CardFactory.audioCard(
            'How to Create Azure Chatbot',
            ['https://www.youtube.com/watch?v=v19iRzWS_-I'],
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Read more',
                    value: 'https://www.youtube.com/watch?v=v19iRzWS_-I'
                }
            ]),
            {
                subtitle: 'How to Create Azure Chatbot',
                text: 'Learn how you can create an Azure ChatBot in 15 minutes or less.  This amazing service can help you scale yourself and your business to create more productivity time and help you with your work/life balance.',
                image: 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'
            }
        );
    }

    createHeroCard() {
        return CardFactory.heroCard(
            'BotFramework Hero Card',
            CardFactory.images(['https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg']),
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Get started',
                    value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
                }
            ])
        );
    }

    createReceiptCard() {
        return CardFactory.receiptCard({
            title: 'Hardy Saputra',
            facts: [
                {
                    key: 'Order Number',
                    value: '1234'
                },
                {
                    key: 'Payment Method',
                    value: 'VISA 5555-****'
                }
            ],
            items: [
                {
                    title: 'Data Transfer',
                    price: '$38.45',
                    quantity: 368,
                    image: { url: 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png' }
                },
                {
                    title: 'App Service',
                    price: '$45.00',
                    quantity: 720,
                    image: { url: 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png' }
                }
            ],
            tax: '$7.50',
            total: '$90.95',
            buttons: CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'More information',
                    value: 'https://azure.microsoft.com/en-us/pricing/details/bot-service/'
                }
            ])
        });
    }

    createSignInCard() {
        return CardFactory.signinCard(
            'BotFramework Sign in Card',
            'https://login.microsoftonline.com',
            'Sign in'
        );
    }

    createThumbnailCard() {
        return CardFactory.thumbnailCard(
            'BotFramework Thumbnail Card',
            [{ url: 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg' }],
            [{
                type: 'openUrl',
                title: 'Get started',
                value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
            }],
            {
                subtitle: 'Your bots — wherever your users are talking.',
                text: 'Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.'
            }
        );
    }

    createVideoCard() {
        return CardFactory.videoCard(
            '2018 Imagine Cup World Championship Intro',
            [{ url: 'https://www.youtube.com/watch?v=EP3ShiJVpW8' }],
            [{
                type: 'openUrl',
                title: 'Lean More',
                value: 'https://www.youtube.com/watch?v=EP3ShiJVpW8'
            }],
            {
                subtitle: 'by Hardy',
                text: 'Microsoft\'s Thinking of jumping on the chatbot bandwagon? Not sure where to start? This session is a crash course and live demo in creating a bot using Bot Framework, Bot Services, QnA Maker, and LUIS. In ten minutes, we’ll have a working bot. The rest of the session focuses on practical use cases that will help free up many of your services organizations by automating their recurring questions and tasks.'
            }
        );
    }
}

module.exports.SampleBot = SampleBot;
