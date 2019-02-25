const restify = require('restify');
const path = require('path');
const { BotFrameworkAdapter, ConversationState, MemoryStorage } = require('botbuilder');
const { BotConfiguration } = require('botframework-config');
const { SampleBot } = require('./bot');

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8000, function() {
    console.log(`\n${ server.name } listening to ${ server.url }.`);
    console.log(`\nTo talk to your bot, open azure-chatbot.bot file in the emulator.`);
});

const BOT_FILE = path.join(__dirname, (process.env.botFilePath || ''));

let botConfig;
try {
    botConfig = BotConfiguration.loadSync(BOT_FILE, process.env.botFileSecret);
} catch (err) {
    console.error(`\nError reading bot file. Please ensure you have valid botFilePath and botFileSecret set for your environment.`);
    console.error(`\n - The botFileSecret is available under appsettings for your Azure Bot Service bot.`);
    console.error(`\n - If you are running this bot locally, consider adding a .env file with botFilePath and botFileSecret.\n\n`);
    process.exit();
}

const DEV_ENVIRONMENT = 'development';

const BOT_CONFIGURATION = (process.env.NODE_ENV || DEV_ENVIRONMENT);

const endpointConfig = botConfig.findServiceByNameOrId(BOT_CONFIGURATION);

const adapter = new BotFrameworkAdapter({
    appId: endpointConfig.appId || process.env.MicrosoftAppId,
    appPassword: endpointConfig.appPassword || process.env.MicrosoftAppPassword
});

const memoryStorage = new MemoryStorage();

const conversationState = new ConversationState(memoryStorage);

const bot = new SampleBot(conversationState);

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (turnContext) => {
        await bot.onTurn(turnContext);
    });
});

adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError]: ${ error }`);
    await context.sendActivity(`Oops. Something went wrong!`);
    await conversationState.clear(context);
};
