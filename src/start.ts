// Bad things happen if this is not at the start.
require('dotenv').config();
import {discordConnect} from './discord/discordAPI';
import {validateEnv} from './global/utils/env.validate';
import logger from './global/utils/logger';
import {firebaseConnect} from './global/utils/firebaseAPI';

const PREFIX = require('path').parse(__filename).name;


// const { ircConnect } = require('./irc/ircAPI');
// const { telegramConnect } = require('./telegram/telegramAPI');
// const { webserverConnect } = require('./webserver/webserverAPI');
// const { runTimer } = require('./global/services/timerAPI');

/**
* Starts everything in the bot.
*/
async function start() {
  logger.info(`[${PREFIX}] Starting service!`);
  if (!validateEnv()) return;
  await firebaseConnect();

  await discordConnect();

  // await ircConnect();

  // Telegram breaks on connect =/
  // await telegramConnect();

  // await runTimer();

  // await webserverConnect();
}

start();

// Stop the bot when the process is closed (via Ctrl-C).
const destroy = () => {
  // try {
  //   if (global.manager) {
  //     global.manager.teardown();
  //   }
  // } catch (err) {
  //   logger.error(`[${PREFIX}] ${err}`);
  // }
  logger.info('Bot stopped.');
};

process.on('unhandledRejection', (error: Error) => {
  logger.error(`[${PREFIX}] error.name: ${error.name}`);
  logger.error(`[${PREFIX}] error.message: ${error.message}`);
  logger.error(`[${PREFIX}] error.stack: ${error.stack}`);
});

process.on('SIGINT', destroy);
process.on('SIGTERM', destroy);
