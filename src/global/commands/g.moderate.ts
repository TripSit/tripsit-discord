import {
  time,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  GuildMember,
  TextChannel,
  ChatInputCommandInteraction,
  Role,
  Guild,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction,
  ColorResolvable,
} from 'discord.js';
import {
  ButtonStyle,
} from 'discord-api-types/v10';
import {modActionDict} from '../@types/database.d';
import {stripIndents} from 'common-tags';
import {parseDuration} from '../utils/parseDuration';
import {embedTemplate} from '../../discord/utils/embedTemplate';

import ms from 'ms';
import env from '../utils/env.config';
import logger from '../utils/logger';
import * as path from 'path';
const PREFIX = path.parse(__filename).name;

const teamRoles = [
  env.ROLE_DIRECTOR,
  env.ROLE_SUCCESSOR,
  env.ROLE_SYSADMIN,
  env.ROLE_LEADDEV,
  env.ROLE_DISCORDADMIN,
  env.ROLE_MODERATOR,
  env.ROLE_TRIPSITTER,
  env.ROLE_TEAMTRIPSIT,
  env.ROLE_TRIPBOT2,
  env.ROLE_TRIPBOT,
  env.ROLE_BOT,
  env.ROLE_DEVELOPER,
];

const warnButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId('acknowledgebtn')
    .setLabel('I understand, it wont happen again!')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId('refusalbtn')
    .setLabel('Nah, I do what I want!')
    .setStyle(ButtonStyle.Danger),
);

/**
 * Takes a user and performs a moderation action on them
 * @param {GuildMember} actor
 * @param {string} command
 * @param {GuildMember} target
 * @param {TextChannel} channel
 * @param {string} toggle
 * @param {string} privReason
 * @param {string} pubReason
 * @param {string} duration
 * @param {ChatInputCommandInteraction} interaction
 */
export async function moderate(
  actor: GuildMember,
  command:string,
  target: GuildMember,
  channel: TextChannel | undefined,
  toggle: 'on' | 'off' | undefined,
  privReason: string | undefined,
  pubReason: string | undefined,
  duration: string | undefined,
  interaction:ChatInputCommandInteraction | ModalSubmitInteraction | UserContextMenuCommandInteraction | undefined,
):Promise<any> {
  logger.debug(stripIndents`[${PREFIX}]
      Actor: ${actor}
      Command: ${command}
      Toggle: ${toggle}
      Target: ${target}
      Channel: ${channel}
      Duration: ${duration}
      PubReason: ${pubReason}
      PrivReason: ${privReason}
    `);

  let minutes = 604800000;

  // Determine if the actor is on the team
  if (actor.roles) {
    // If you're unbanning a actor they wont have roles
    actor.roles.cache.forEach(async (role) => {
      if (teamRoles.includes(role.id)) {
        // Actor Team check - Only team members can use mod actions (except report)
        if (command !== 'report') {
          // logger.debug(`[${PREFIX}] actor is NOT a team member!`);
          return {content: stripIndents`Hey ${actor}, you need to be a team member to ${command}!`, ephemeral: true};
        }
      }
    });
  }

  // Determine if the target is on the team
  if (target.roles) {
    target.roles.cache.forEach(async (role) => {
      if (teamRoles.includes(role.id)) {
        // Target Team check - Only NON team members can be targeted by mod actions
        logger.debug(`[${PREFIX}] Target is a team member!`);
        return {content: stripIndents`Hey ${actor}, you cannot ${command} a team member!`, ephemeral: true};
      }
    });
  }

  // Get duration
  if (duration) {
    minutes = duration ?
      await parseDuration(duration) :
      604800000;
    logger.debug(`[${PREFIX}] minutes: ${minutes}`);
  }
  logger.debug(`[${PREFIX}] duration: ${duration}`);

  // Perform various mod actions
  let embedColor = Colors.Red as ColorResolvable;
  let embedTitle = '';
  let verb = '';
  if (command === 'timeout') {
    if (toggle === 'on' || toggle === null) {
      embedColor = Colors.Yellow;
      embedTitle = 'Timeout!';
      verb = 'timed out';
      try {
        target.timeout(minutes, privReason);
      } catch (err) {
        logger.error(`[${PREFIX}] Error: ${err}`);
      }
    } else {
      embedColor = Colors.Green;
      embedTitle = 'Untimeout!';
      verb = 'removed from time-out';
      try {
        target.timeout(0, privReason);
        logger.debug(`[${PREFIX}] I untimeouted ${target.displayName} because\n '${privReason}'!`);
      } catch (err) {
        logger.error(`[${PREFIX}] Error: ${err}`);
      }
    }
  } else if (command === 'kick') {
    embedColor = Colors.Orange;
    embedTitle = 'Kicked!';
    verb = 'kicked';
    try {
      target.kick();
    } catch (err) {
      logger.error(`[${PREFIX}] Error: ${err}`);
    }
  } else if (command === 'ban') {
    if (toggle === 'on' || toggle === null) {
      embedColor = Colors.Red;
      embedTitle = 'Banned!';
      verb = 'banned';
      try {
        const targetGuild = await global.client.guilds.fetch(env.DISCORD_GUILD_ID);
        targetGuild.members.ban(target, {reason: privReason});
      } catch (err) {
        logger.error(`[${PREFIX}] Error: ${err}`);
      }
    } else {
      embedColor = Colors.Green;
      embedTitle = 'Un-banned!';
      verb = 'un-banned';
      try {
        const targetGuild = await global.client.guilds.fetch(env.DISCORD_GUILD_ID);
        await targetGuild.bans.fetch();
        await targetGuild.bans.remove(target.user, privReason);
      } catch (err) {
        logger.error(`[${PREFIX}] Error: ${err}`);
      }
    }
  } else if (command === 'underban') {
    if (toggle === 'on' || toggle === null) {
      embedColor = Colors.Blue;
      embedTitle = 'Underbanned!';
      verb = 'underbanned';
      try {
        const targetGuild = await global.client.guilds.fetch(env.DISCORD_GUILD_ID);
        targetGuild.members.ban(target, {reason: privReason});
      } catch (err) {
        logger.error(`[${PREFIX}] Error: ${err}`);
      }
    } else {
      try {
        const targetGuild = await global.client.guilds.fetch(env.DISCORD_GUILD_ID);
        await targetGuild.bans.fetch();
        await targetGuild.bans.remove(target.user, privReason);
      } catch (err) {
        logger.error(`[${PREFIX}] Error: ${err}`);
      }
    }
  } else if (command === 'warn') {
    embedColor = Colors.Yellow;
    embedTitle = 'Warned!';
    verb = 'warned';
  } else if (command === 'note') {
    embedColor = Colors.Yellow;
    embedTitle = 'Note!';
    verb = 'noted';
  } else if (command === 'report') {
    embedColor = Colors.Orange;
    embedTitle = 'Report!';
    verb = 'reported';
  } else if (command === 'info') {
    embedColor = Colors.Green;
    embedTitle = 'Info!';
    verb = 'got info on';
  }

  // Update the database
  // let actorModActions = [] as modActionDict[];
  let targetModActions = [] as modActionDict[];
  if (global.db) {
    const actionData = {
      actor: actor.id,
      command: command,
      target: target.id,
      channel: channel ? channel.id : null,
      duration: duration ? minutes : null,
      privReason: privReason,
      pubReason: pubReason,
    };

    const participants = [actor.id, target.id];
    participants.forEach(async (participant, index) => {
      const ref = db.ref(`${env.FIREBASE_DB_USERS}/${participant}/modActions/`);
      await ref.once('value', (data) => {
        let actions = [];
        if (data.val() !== null) {
          actions = data.val();
        }
        actions.push({[Date.now().valueOf()]: actionData});
        // if (index === 0) {
        //   actorModActions = actions;
        // }
        if (index === 1) {
          targetModActions = actions;
        }
        ref.set(actions);
      });
    });
  }

  // Get the count of times this action has been performed on this user from targetModActions
  const actionDict = {
    timeout: 0,
    kick: 0,
    ban: 0,
    underban: 0,
    warn: 0,
    note: 0,
    report: 0,
  };
  if (targetModActions.length > 0) {
    targetModActions.forEach((action) => {
      const actionKey = Object.keys(action)[0];
      const actionValue = action[actionKey];
      const actionCommand = actionValue.command;
      if (actionCommand in actionDict) {
        actionDict[actionCommand as keyof typeof actionDict] += 1;
      }
    });
  }

  const modlogEmbed = embedTemplate()
    .setDescription(`${actor.displayName} ${command}ed ${target.displayName}`)
    .setColor(Colors.Blue)
    .addFields(
      {name: 'Displayname', value: `${target.displayName}`, inline: true},
      {name: 'Username', value: `${target.user.username}`, inline: true},
      {name: 'ID', value: `${target.id}`, inline: true},
      {name: 'Created', value: `${time(target.user.createdAt, 'R')}`, inline: true},
      {name: 'Joined', value: `${target.joinedAt ? time(target.joinedAt!, 'R') : 'Unknown'}`, inline: true},
      {name: '# of Reports', value: `${actionDict.report}`, inline: true},
      {name: '# of Timeouts', value: `${actionDict.timeout}`, inline: true},
      {name: '# of Warns', value: `${actionDict.warn}`, inline: true},
      {name: '# of Kicks', value: `${actionDict.kick}`, inline: true},
      {name: '# of Bans', value: `${actionDict.ban}`, inline: true},
      {name: '# of Notes', value: `${actionDict.note}`, inline: true},
      {name: '# of Tripsitmes', value: `TBD`, inline: true},
      {name: '# of I\'m Good', value: `TBD`, inline: true},
      {name: '# of Fucks to Give', value: '0', inline: true},
    );

  // Send a message to the user
  if (command !== 'report' && command !== 'note' && command !== 'info') {
    const warnEmbed = embedTemplate()
      .setColor(embedColor)
      .setTitle(embedTitle)
      .setDescription(stripIndents`
    Hey ${target}, you have been ${verb} ${duration ? `for ${ms(minutes, {long: true})}` : ''} by Team TripSit:

    ${pubReason}

    **Do not message a moderator to talk about this!**
    
    ${command !== 'ban' && command !== 'underban' ?
    `You can respond to this bot and it will allow you to talk to the team privately!` :
    `You can send an email to appeals@tripsit.me to appeal this ban!`}
    Please read the rules and be respectful of them.

    https://tripsit.me/rules 
    `);
    await target.user.send({embeds: [warnEmbed], components: [warnButtons]});
  }

  // Send the message to the mod channel
  if (command !== 'note' && command !== 'info') {
    const modChan = await global.client.channels.fetch(env.CHANNEL_MODERATORS) as TextChannel;
    // We must send the mention outside of the embed, cuz mentions dont work in embeds
    const tripsitGuild = await global.client.guilds.fetch(env.DISCORD_GUILD_ID) as Guild;
    const roleModerator = tripsitGuild.roles.cache.find((role:Role) => role.id === env.ROLE_MODERATOR) as Role;
    modChan.send(stripIndents`
      Hey ${roleModerator}!
      ${actor.displayName} ${verb} ${target.displayName}\
      ${channel ? `in ${channel.name}` : ''}\
      ${duration ? `for ${ms(minutes, {long: true})}` : ''}\
      ${privReason ? `\nPriv Reason: ${privReason}` : ''}
      `);
    modChan.send({embeds: [modlogEmbed]});
    logger.debug(`[${PREFIX}] sent a message to the moderators room`);
  }

  // If this is the info command then return with info
  if (command === 'info') {
    try {
      logger.debug(`[${PREFIX}] returned info about ${target.displayName}`);
      return {embeds: [modlogEmbed], ephemeral: true};
    } catch (err) {
      logger.error(`[${PREFIX}] Error: ${err}`);
    }
  }

  // Send a message to the modlog room
  if (command !== 'info') {
    const modlog = await global.client.channels.fetch(env.CHANNEL_MODLOG) as TextChannel;
    modlog.send({embeds: [modlogEmbed]});
    logger.debug(`[${PREFIX}] sent a message to the modlog room`);
  }

  // Return a message to the user confirming the user was acted on
  logger.debug(`[${PREFIX}] ${target.displayName} has been ${command}ed!`);
  const response = embedTemplate()
    .setColor(Colors.Yellow)
    .setDescription(`${target.displayName} has been ${command}ed!`);
  return {embeds: [response], ephemeral: true};
};
