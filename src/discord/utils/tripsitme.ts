/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  ButtonBuilder,
  ModalSubmitInteraction,
  TextChannel,
  Colors,
  GuildMember,
  Role,
  ThreadChannel,
  ButtonInteraction,
  GuildMemberRoleManager,
  Message,
  MessageReaction,
  User,
  // ChatInputCommandInteraction,
  PermissionsBitField,
  // TextChannel,
  // MessageFlags,
  MessageMentionTypes,
  CommandInteraction,
  ChatInputCommandInteraction,
} from 'discord.js';
import {
  TextInputStyle,
  ChannelType,
  ButtonStyle,
} from 'discord-api-types/v10';
import {db} from '../../global/utils/knex';
import {
  Users,
  UserTickets,
  TicketStatus,
  DiscordGuilds,
} from '../../global/@types/pgdb.d';
import env from '../../global/utils/env.config';
import {stripIndents} from 'common-tags';
import logger from '../../global/utils/logger';
import {embedTemplate} from './embedTemplate';

import * as path from 'path';
const PREFIX = path.parse(__filename).name;

/**
 * Handles the tripsit button
 * @param {ButtonInteraction} interaction
 */
export async function tripsitmeButton(
  interaction:ButtonInteraction,
) {
  logger.debug(`[${PREFIX}] button starting!`);
  if (!interaction.guild) {
    logger.debug(`[${PREFIX}] no guild!`);
    interaction.reply('This must be performed in a guild!');
    return;
  }
  if (!interaction.member) {
    logger.debug(`[${PREFIX}] no member!`);
    interaction.reply('This must be performed by a member of a guild!');
    return;
  }
  const target = interaction.member as GuildMember;
  const actorIsAdmin = (target as GuildMember).permissions.has(PermissionsBitField.Flags.Administrator);
  const showMentions = actorIsAdmin ? [] : ['users', 'roles'] as MessageMentionTypes[];

  // Lookup guild information for variables
  const guildId = interaction.guild.id;
  const guildData = await db<DiscordGuilds>('discord_guilds')
    .select(
      db.ref('role_tripsitter').as('role_tripsitter'),
      db.ref('role_helper').as('role_helper'),
      db.ref('channel_tripsit_meta').as('channel_tripsit_meta'),
    )
    .where('id', guildId)
    .first();
  if (!guildData) {
    interaction.reply('Could not find this guild in the DB!');
    return;
  }

  let backupMessage = 'Hey ';
  // Get the roles we'll be referencing
  let roleTripsitter = {} as Role;
  let roleHelper = {} as Role;
  if (guildData.role_tripsitter) {
    roleTripsitter = await interaction.guild.roles.fetch(guildData.role_tripsitter) as Role;
    backupMessage += `<@&${roleTripsitter.id}> `;
  }
  if (guildData.role_helper) {
    roleHelper = await interaction.guild.roles.fetch(guildData.role_helper) as Role;
    backupMessage += `<@&${roleHelper.id}> `;
  }


  // Team check - Cannot be run on team members
  // If this user is a developer then this is a test run and ignore this check,
  // but we'll change the output down below to make it clear this is a test.
  let targetIsTeamMember = false;
  if (!actorIsAdmin) {
    target.roles.cache.forEach(async (role) => {
      if (teamRoles.includes(role.id)) {
        targetIsTeamMember = true;
      }
    });
    if (targetIsTeamMember) {
      logger.debug(`[${PREFIX}] Target is a team member!`);
      const teamMessage = stripIndents`You are a member of the team and cannot be publicly helped!`;
      const embed = embedTemplate()
        .setColor(Colors.DarkBlue)
        .setDescription(teamMessage);
      if (!interaction.replied) {
        await interaction.reply({embeds: [embed], ephemeral: true});
      }
      return;
    }
  }

  // Get the target's userId
  const userId = target.id;
  let userUniqueId = await db
    .select(db.ref('id'))
    .from<Users>('users')
    .where('discord_id', userId)
    .first();
  if (!userUniqueId) {
    userUniqueId = (await db
      .insert({discord_id: userId})
      .into('users')
      .returning('id'))[0];
  }

  if (!userUniqueId) return;

  // Get the target's existing ticket
  const ticketData = await db<UserTickets>('user_tickets')
    .select(
      db.ref('id').as('id'),
      db.ref('user_id').as('user_id'),
      db.ref('description').as('description'),
      db.ref('thread_id').as('thread_id'),
      db.ref('meta_thread_id').as('meta_thread_id'),
      db.ref('type').as('type'),
      db.ref('status').as('status'),
      db.ref('first_message_id').as('first_message_id'),
      db.ref('closed_at').as('closed_at'),
      db.ref('closed_by').as('closed_by'),
      db.ref('reopened_at').as('reopened_at'),
      db.ref('reopened_by').as('reopened_by'),
      db.ref('archived_at').as('archived_at'),
      db.ref('deleted_at').as('deleted_at'),
      db.ref('created_at').as('created_at'),
    )
    .where('user_id', userUniqueId.id)
    .where('type', 'TRIPSIT')
    .andWhereNot('status', 'CLOSED')
    .andWhereNot('status', 'RESOLVED')
    .first();

  if (ticketData) {
    logger.debug(`[${PREFIX}] Target has open ticket: ${JSON.stringify(ticketData, null, 2)}`);

    await needsHelpmode(interaction, target);


    let threadHelpUser = {} as ThreadChannel;
    try {
      threadHelpUser = await interaction.guild.channels.fetch(ticketData.thread_id) as ThreadChannel;
    } catch (err) {
      logger.debug(`[${PREFIX}] There was an error updating the help thread, it was likely deleted:\n ${err}`);

      // Update the ticket status to closed
      ticketData.status = 'CLOSED' as TicketStatus;
      await db<UserTickets>('user_tickets')
        .insert(ticketData)
        .onConflict('id')
        .merge();
    }

    if (threadHelpUser.id) {
      // Lookup guild information for variables
      const guildId = await interaction.guild.id;
      const guildData = await db<DiscordGuilds>('discord_guilds')
        .select(
          db.ref('role_tripsitter').as('role_tripsitter'),
          db.ref('role_helper').as('role_helper'),
          db.ref('channel_tripsit_meta').as('channel_tripsit_meta'),
        )
        .where('id', guildId)
        .first();
      if (!guildData) {
        interaction.reply('Could not find this guild in the DB!');
        return;
      }

      let roleTripsitter = {} as Role;
      let roleHelper = {} as Role;
      if (guildData.role_tripsitter) {
        roleTripsitter = await interaction.guild.roles.fetch(guildData.role_tripsitter) as Role;
      }
      if (guildData.role_helper) {
        roleHelper = await interaction.guild.roles.fetch(guildData.role_helper) as Role;
      }

      // Remind the user that they have a channel open
      const embed = embedTemplate()
        .setColor(Colors.DarkBlue)
        .setDescription(stripIndents`Hey ${interaction.member}, you have an open session!
  
        Check your channel list or click '${threadHelpUser.toString()} to get help!`);
      interaction.reply({embeds: [embed], ephemeral: true});
      logger.debug(`[${PREFIX}] Rejected need for help`);

      // Check if the created_by is in the last 5 minutes
      const createdDate = new Date(ticketData.reopened_at ?? ticketData.created_at);
      const now = new Date();
      const diff = now.getTime() - createdDate.getTime();
      const minutes = Math.floor(diff / 1000 / 60);

      // Send the update message to the thread
      let helpMessage = stripIndents`Hey ${target}, thanks for asking for help, we can continue talking here! What's up?`;
      if (minutes > 5) {
        logger.debug(`[${PREFIX}] Target has open ticket, and it was created over 5 minutes ago!`);
        helpMessage += `\n\n${roleHelper} and ${roleTripsitter} will be with you as soon as they're available!`;
      }
      threadHelpUser.setName(`💛│${target.displayName}'s channel!`);
      threadHelpUser.send({
        content: helpMessage,
        allowedMentions: {
          'parse': showMentions,
        },
      });
      logger.debug(`[${PREFIX}] Pinged user in help thread`);

      if (ticketData.meta_thread_id) {
        let metaMessage = '';
        if (minutes > 5) {
          metaMessage = `Hey ${roleHelper} and ${roleTripsitter}, ${target.toString()} has indicated they need assistance!`;
        } else {
          metaMessage = `${target.toString()} has indicated they need assistance!`;
        }
        const metaThread = await interaction.guild.channels.fetch(ticketData.meta_thread_id) as ThreadChannel;
        metaThread.setName(`💛│${target.displayName}'s discussion!`);
        metaThread.send({
          content: metaMessage,
          allowedMentions: {
            'parse': showMentions,
          },
        });
        logger.debug(`[${PREFIX}] Pinged team in meta thread!`);
      }
      return;
    }
  }

  const modal = new ModalBuilder()
    .setCustomId(`tripsitmeSubmit~${interaction.id}`)
    .setTitle('Tripsitter Help Request');
  modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
    .setCustomId('triageInput')
    .setLabel('What substance? How much taken? What time?')
    .setStyle(TextInputStyle.Short)));
  modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
    .setCustomId('introInput')
    .setLabel('What\'s going on? Give us the details!')
    .setStyle(TextInputStyle.Paragraph)));
  await interaction.showModal(modal);

  const filter = (interaction:ModalSubmitInteraction) => interaction.customId.startsWith(`tripsitmeSubmit`);
  interaction.awaitModalSubmit({filter, time: 0})
    .then(async (i) => {
      if (i.customId.split('~')[1] !== interaction.id) return;
      const triage = i.fields.getTextInputValue('triageInput');
      const intro = i.fields.getTextInputValue('introInput');

      tripSitMe(i, null, triage, intro);
    });
};

/**
 * Creates the tripsit modal
 * @param {ButtonInteraction} interaction The interaction that started this
 * @param {GuildMember} memberInput The member being aced upon
 * @param {string} triage Given triage information
 * @param {string} intro Given intro information
 */
export async function tripSitMe(
  interaction:ModalSubmitInteraction,
  memberInput:GuildMember | null,
  triage:string,
  intro:string,
) {
  // Lookup guild information for variables
  if (!interaction.guild) return;
  const actor = interaction.member;
  const guildId = interaction.guild.id;
  const guildData = await db<DiscordGuilds>('discord_guilds')
    .select(
      db.ref('role_tripsitter').as('role_tripsitter'),
      db.ref('role_helper').as('role_helper'),
      db.ref('channel_tripsit_meta').as('channel_tripsit_meta'),
    )
    .where('id', guildId)
    .first();
  if (!guildData) {
    interaction.reply('Could not find this guild in the DB!');
    return;
  }

  let backupMessage = 'Hey ';
  // Get the roles we'll be referencing
  let roleTripsitter = {} as Role;
  let roleHelper = {} as Role;
  let channelTripsitMeta = {} as TextChannel;
  if (guildData.role_tripsitter) {
    roleTripsitter = await interaction.guild.roles.fetch(guildData.role_tripsitter) as Role;
    backupMessage += `<@&${roleTripsitter.id}> `;
  }
  if (guildData.role_helper) {
    roleHelper = await interaction.guild.roles.fetch(guildData.role_helper) as Role;
    backupMessage += `<@&${roleHelper.id}> `;
  }
  if (guildData.channel_tripsit_meta) {
    channelTripsitMeta = await interaction.guild.channels.fetch(guildData.channel_tripsit_meta) as TextChannel;
  }

  if (!interaction.guild) {
    logger.debug(`[${PREFIX}] no guild!`);
    interaction.reply('This must be performed in a guild!');
    return;
  }
  if (!interaction.member) {
    logger.debug(`[${PREFIX}] no member!`);
    interaction.reply('This must be performed by a member of a guild!');
    return;
  }

  logger.debug(`[${PREFIX}] submitted with |
    user: ${interaction.user.tag} (${interaction.user.id})
    guild: ${interaction.guild.name} (${interaction.guild.id})
    memberInput: ${memberInput}
    roleTripsitterId: ${roleTripsitter.id}
    channelTripsittersId: ${channelTripsitMeta.id}
    triage: ${triage}
    intro: ${intro}
  `);

  // Determine if this command was started by an Admin (for testing)
  const actorIsAdmin = (actor as GuildMember).permissions.has(PermissionsBitField.Flags.Administrator);
  const showMentions = actorIsAdmin ? [] : ['users', 'roles'] as MessageMentionTypes[];
  // logger.debug(`[${PREFIX}] actorIsAdmin: ${actorIsAdmin}`);
  // logger.debug(`[${PREFIX}] showMentions: ${showMentions}`);

  // Determine the target.
  // If the user clicked the button, the target is whoever started the interaction.
  // Otherwise, the target is the user mentioned in the /tripsit command.
  const target = (memberInput ?? interaction.member) as GuildMember;
  // logger.debug(`[${PREFIX}] target: ${target}`);

  await needsHelpmode(interaction, target as GuildMember);

  // Get a list of the target's roles
  // const targetRoleNames = (target.roles as GuildMemberRoleManager).cache.map((role) => role.name);
  // logger.debug(`[${PREFIX}] targetRoleNames: ${targetRoleNames}`);

  // const targetRoleIds = (target.roles as GuildMemberRoleManager).cache.map((role) => role.id);
  // logger.debug(`[${PREFIX}] targetRoleIds: ${targetRoleIds}`);

  // Get the tripsit channel from the guild
  const tripsitChannel = interaction.channel as TextChannel;

  // Create a new private thread in the channel
  // If we're not in production we need to create a public thread
  const threadHelpUser = await tripsitChannel.threads.create({
    name: `🧡│${target.displayName}'s channel!`,
    autoArchiveDuration: 1440,
    type: interaction.guild.premiumTier > 2 ? ChannelType.GuildPrivateThread : ChannelType.GuildPublicThread,
    reason: `${target.displayName} requested help`,
  }) as ThreadChannel;
  logger.debug(`[${PREFIX}] Created ${threadHelpUser.name} ${threadHelpUser.id}`);

  // Send the triage info to the thread
  const replyMessage = memberInput ?
    stripIndents`
        Hey ${interaction.member}, we've activated tripsit mode on ${target.user.username}!

        Check your channel list for ${threadHelpUser.toString()} to talk to the user

        **Be sure add some information about the user to the thread!**` :
    stripIndents`
        Hey ${target}, thank you for asking for assistance!

        Click here to be taken to your private room: ${threadHelpUser.toString()}

        You can also click in your channel list to see your private room!`;

  const embed = embedTemplate()
    .setColor(Colors.DarkBlue)
    .setDescription(replyMessage);
  interaction.reply({embeds: [embed], ephemeral: true});
  logger.debug(`[${PREFIX}] Sent response to ${target.user.tag}`);

  // Send the intro message to the threadHelpUser
  const firstMessage = memberInput ?
    stripIndents`
      Hey ${target}, the team thinks you could use assistance!
      ${roleHelper} and ${roleTripsitter} will be with you as soon as they're available!
      If this is a medical emergency please contact your local /EMS: we do not call EMS on behalf of anyone.` :
    stripIndents`
      Hey ${target}, thank you for asking for assistance!

      You've taken: ${triage ? `\n${triage}` : '\n*No info given*'}

      Your issue: ${intro ? `\n${intro}` : '\n*No info given*'}

      ${roleHelper} and ${roleTripsitter} will be with you as soon as they're available!
      If this is a medical emergency please contact your local /EMS: we do not call EMS on behalf of anyone.
      When you're feeling better you can use the "I'm Good" button to let the team know you're okay.
      If you just would like someone to talk to, check out the warmline directory: https://warmline.org/warmdir.html#directory
      `;

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`tripsitmeFinish~me~${target.id}`)
        .setLabel('I\'m good now!')
        .setStyle(ButtonStyle.Success),
    );

  await threadHelpUser.send({
    content: firstMessage,
    components: [row],
    allowedMentions: {
      'parse': showMentions,
    },
    flags: ['SuppressEmbeds'],
  });

  logger.debug(`[${PREFIX}] Sent intro message to ${threadHelpUser.name} ${threadHelpUser.id}`);

  // Send an embed to the tripsitter room
  const embedTripsitter = embedTemplate()
    .setColor(Colors.DarkBlue)
    .setDescription(stripIndents`
      ${target} has requested assistance!
      **They've taken:** 
      ${triage ? `${triage}` : '*No info given*'}
      **Their issue: **
      ${intro ? `${intro}` : '*No info given*'}

      **Read the log before interacting**
      Use this channel coordinate efforts.

      **No one is qualified to handle suicidal users here**
      If the user is considering / talking about suicide, direct them to the suicide hotline!

      **Do not engage in DM**
      Keep things in the open where you have the team's support!
      `)
    .setFooter({text: 'If you need help click the Backup button to summon Helpers and Tripsitters'});

  const endSession = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`tripsitmeOwned~${target.id}`)
        .setLabel('Owned')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`tripsitmeFinish~them~${target.id}`)
        .setLabel('They\'re good now!')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`tripsitmeMeta~${target.id}`)
        .setLabel('Create thread')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`tripsitmeBackup~${target.id}`)
        .setLabel('I need backup')
        .setStyle(ButtonStyle.Danger),
    );

  await channelTripsitMeta.send({
    embeds: [embedTripsitter],
    components: [endSession],
    allowedMentions: {},
  });
  logger.debug(`[${PREFIX}] Sent message to ${channelTripsitMeta.name} (${channelTripsitMeta.id})`);

  const threadArchiveTime = new Date();
  // define one week in milliseconds
  const thirtySec = 1000 * 30;
  const tenMins = 1000 * 60 * 10;
  const oneDay = 1000 * 60 * 60 * 24;
  const archiveTime = env.NODE_ENV === 'production' ?
    threadArchiveTime.getTime() + oneDay :
    threadArchiveTime.getTime() + thirtySec;
  threadArchiveTime.setTime(archiveTime);
  // logger.debug(`[${PREFIX}] threadArchiveTime: ${threadArchiveTime}`);

  let userUniqueId = await db
    .select(db.ref('id'))
    .from<Users>('users')
    .where('discord_id', target.id);

  if (userUniqueId.length === 0) {
    userUniqueId = await db
      .insert({discord_id: target.id})
      .into('users')
      .returning('id');
  }

  // logger.debug(`[${PREFIX}] userUniqueId: ${userUniqueId[0].id}`);

  // Set ticket information
  const newTicketData = {
    user_id: userUniqueId[0].id,
    description: `
    They've taken: ${triage ? `\n${triage}` : '\n*No info given*'}

    Their issue: ${intro ? `\n${intro}` : '\n*No info given*'}`,
    thread_id: threadHelpUser.id,
    type: 'TRIPSIT',
    status: 'OPEN',
    first_message_id: '',
    archived_at: threadArchiveTime,
    deleted_at: new Date(threadArchiveTime.getTime() + 1000 * 60 * 60 * 24 * 7),
  } as UserTickets;

  logger.debug(`[${PREFIX}] newTicketData: ${JSON.stringify(newTicketData, null, 2)}`);

  // Update thet ticket in the DB
  await db
    .insert(newTicketData)
    .into<UserTickets>('user_tickets');
};

/**
 * Applies the NeedHelp role on a user and removes their other roles
 * @param {GuildMember} interaction
 * @param {GuildMember} target
 **/
export async function needsHelpmode(
  interaction: ModalSubmitInteraction | ButtonInteraction,
  target: GuildMember,
) {
  if (!interaction.guild) {
    logger.debug(`[${PREFIX}] no guild!`);
    interaction.reply('This must be performed in a guild!');
    return;
  }
  if (!interaction.member) {
    logger.debug(`[${PREFIX}] no member!`);
    interaction.reply('This must be performed by a member of a guild!');
    return;
  }

  // Lookup guild information for variables
  const guildId = interaction.guild.id;
  const guildData = await db<DiscordGuilds>('discord_guilds')
    .select(
      db.ref('role_needshelp').as('role_needshelp'),
    )
    .where('id', guildId)
    .first();
  if (!guildData) {
    interaction.reply('Could not find this guild in the DB!');
    return;
  }

  let roleNeedshelp = {} as Role;
  if (guildData.role_needshelp) {
    roleNeedshelp = await interaction.guild.roles.fetch(guildData.role_needshelp) as Role;
  }

  // Check if the target already has the needshelp role
  const targetHasRoleNeedshelp = (target.roles as GuildMemberRoleManager).cache.find(
    (role) => role === roleNeedshelp,
  ) !== undefined;
  // logger.debug(`[${PREFIX}] targetHasRoleNeedshelp: ${targetHasRoleNeedshelp}`);

  // Save the user's roles to the DB
  const targetRoleIds = target.roles.cache.map((role) => role.id);
  // logger.debug(`[${PREFIX}] targetRoleIds: ${targetRoleIds}`);
  await db
    .insert({
      discord_id: target.id,
      roles: targetRoleIds.toString(),
    })
    .into<Users>('users')
    .onConflict('discord_id')
    .merge();

  const myMember = await interaction.guild.members.fetch(interaction.client.user.id);
  const myRole = myMember.roles.highest;
  // Remove all roles, except team and vanity, from the target
  target.roles.cache.forEach((role) => {
    // logger.debug(`[${PREFIX}] role: ${role.name} - ${role.id}`);
    if (!ignoredRoles.includes(role.id) && !role.name.includes('@everyone') && role.id !== roleNeedshelp.id) {
      if (role.comparePositionTo(myRole) < 0) {
        logger.debug(`[${PREFIX}] Removing role ${role.name} from ${target.displayName}`);
        try {
          target.roles.remove(role);
        } catch (err) {
          logger.debug(`[${PREFIX}] There was an error removing the role ${role.name} from ${target.displayName}\n${err}`);
        }
      }
    }
  });

  // Add the needsHelp role to the target
  try {
    logger.debug(`[${PREFIX}] Adding role ${roleNeedshelp.name} to ${target.displayName}`);
    await target.roles.add(roleNeedshelp);
  } catch (err) {
    logger.error(`[${PREFIX}] Error adding role to target: ${err}`);
    return interaction.reply(stripIndents`There was an error adding the NeedsHelp role!
      Make sure the bot's role is higher than NeedsHelp in the Role list!`);
  }
}

/**
 * Handles the Own button
 * @param {ButtonInteraction} interaction
 **/
export async function tripsitmeOwned(
  interaction:ButtonInteraction,
) {
  logger.debug(`[${PREFIX}] tripsitmeOwned`);
  const userId = interaction.customId.split('~')[1];
  const actor = interaction.member as GuildMember;
  const target = await interaction.guild?.members.fetch(userId) as GuildMember;

  // Reply to the user
  interaction.reply({content: stripIndents`
    ${actor.displayName} has indicated that ${target.toString()} is receiving help!
  `});

  // Get the user's ID
  const userUniqueId = await db
    .select(db.ref('id'))
    .from<Users>('users')
    .where('discord_id', userId)
    .first();
  if (!userUniqueId) {
    interaction.reply('Could not find this user in the DB!');
    return;
  }

  // Get user's ticket from DB
  const userTicket = await db<UserTickets>('user_tickets')
    .select(
      db.ref('id'),
      db.ref('thread_id'),
      db.ref('meta_thread_id'),
      db.ref('type'),
      db.ref('status'),
    )
    .where('user_id', userUniqueId.id)
    .andWhereNot('status', 'CLOSED')
    .andWhereNot('status', 'RESOLVED')
    .first();
  if (!userTicket) {
    interaction.reply('This user does not have an open ticket!');
    return;
  }

  // Update the ticket's name
  const channel = await interaction.guild?.channels.fetch(userTicket.thread_id) as TextChannel;
  channel.setName(`💛│${target.displayName}'s channel!`);

  // Update the ticket's status in the DB
  await db<UserTickets>('user_tickets')
    .update({
      status: 'OWNED' as TicketStatus,
    })
    .where('id', userTicket.id);
};

/**
 * Handles the Meta Thread button
 * @param {ButtonInteraction} interaction
 **/
export async function tripsitmeMeta(
  interaction:ButtonInteraction,
) {
  logger.debug(`[${PREFIX}] tripsitmeMeta`);
  const userId = interaction.customId.split('~')[1];
  const actor = interaction.member as GuildMember;
  const target = await interaction.guild?.members.fetch(userId) as GuildMember;

  if (!interaction.guild) return;
  if (!interaction.channel) return;
  if (!interaction.member) return;

  // Get the user's ID
  const userUniqueId = await db
    .select(db.ref('id'))
    .from<Users>('users')
    .where('discord_id', userId)
    .first();
  if (!userUniqueId) {
    interaction.reply('Could not find this user in the DB!');
    return;
  }

  // Get user's ticket from DB
  const userTicket = await db<UserTickets>('user_tickets')
    .select(
      db.ref('id').as('id'),
      db.ref('user_id').as('user_id'),
      db.ref('description').as('description'),
      db.ref('thread_id').as('thread_id'),
      db.ref('type').as('type'),
      db.ref('status').as('status'),
      db.ref('first_message_id').as('first_message_id'),
      db.ref('closed_by').as('closed_by'),
      db.ref('closed_at').as('closed_at'),
      db.ref('archived_at').as('archived_at'),
      db.ref('deleted_at').as('deleted_at'),
      db.ref('created_at').as('created_at'),
    )
    .where('user_id', userUniqueId.id)
    .andWhereNot('status', 'CLOSED')
    .andWhereNot('status', 'RESOLVED')
    .first();
  if (!userTicket) {
    interaction.reply('This user does not have an open ticket!');
    return;
  }


  const channel = interaction.channel as TextChannel;
  const metaChannel = await channel.threads.create(
    {
      name: `💛│${target.displayName}'s discussion!`,
      autoArchiveDuration: 1440,
      type: interaction.guild.premiumTier > 2 ? ChannelType.PrivateThread : ChannelType.PublicThread,
      reason: `${actor.displayName} created meta thread for ${target.displayName}`,
    },
  );

  // Send an embed to the tripsitter room
  const embedTripsitter = embedTemplate()
    .setColor(Colors.DarkBlue)
    .setDescription(stripIndents`
      ${actor.toString()} has created a meta thread for ${target.toString()}!

      ${userTicket.description}

      **Read the log before interacting**
      Use this channel coordinate efforts.

      **No one is qualified to handle suicidal users here**
      If the user is considering / talking about suicide, direct them to the suicide hotline!

      **Do not engage in DM**
      Keep things in the open where you have the team's support!
      `)
    .setFooter({text: 'If you need help click the Backup button to summon Helpers and Tripsitters'});

  const endSession = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`tripsitmeOwned~${target.id}`)
        .setLabel('Owned')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`tripsitmeFinish~them~${target.id}`)
        .setLabel('They\'re good now!')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`tripsitmeMeta~${target.id}`)
        .setLabel('Create thread')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`tripsitmeBackup~${target.id}`)
        .setLabel('I need backup')
        .setStyle(ButtonStyle.Danger),
    );

  await metaChannel.send({
    embeds: [embedTripsitter],
    components: [endSession],
    allowedMentions: {},
  });
};

/**
 * Handles the Backup button
 * @param {ButtonInteraction} interaction
 **/
export async function tripsitmeBackup(
  interaction:ButtonInteraction,
) {
  logger.debug(`[${PREFIX}] tripsitmeBackup`);
  if (!interaction.guild) return;
  const userId = interaction.customId.split('~')[1];
  const actor = interaction.member as GuildMember;
  const target = await interaction.guild?.members.fetch(userId) as GuildMember;

  // Get the user's ID
  const userUniqueId = await db
    .select(db.ref('id'))
    .from<Users>('users')
    .where('discord_id', userId)
    .first();
  if (!userUniqueId) {
    interaction.reply('Could not find this user in the DB!');
    return;
  }

  // Get user's ticket from DB
  const ticketData = await db<UserTickets>('user_tickets')
    .select(
      db.ref('id'),
      db.ref('thread_id'),
      db.ref('meta_thread_id'),
      db.ref('type'),
      db.ref('status'),
    )
    .where('user_id', userUniqueId.id)
    .andWhereNot('status', 'CLOSED')
    .andWhereNot('status', 'RESOLVED')
    .first();
  if (!ticketData) {
    interaction.reply('This user does not have an open ticket!');
    return;
  }

  // Lookup guild information for variables
  const guildId = interaction.guild.id;
  const guildData = await db<DiscordGuilds>('discord_guilds')
    .select(
      db.ref('role_tripsitter').as('role_tripsitter'),
      db.ref('role_helper').as('role_helper'),
      db.ref('channel_tripsit_meta').as('channel_tripsit_meta'),
    )
    .where('id', guildId)
    .first();
  if (!guildData) {
    interaction.reply('Could not find this guild in the DB!');
    return;
  }

  let backupMessage = 'Hey ';
  // Get the roles we'll be referencing
  let roleTripsitter = {} as Role;
  let roleHelper = {} as Role;
  if (guildData.role_tripsitter) {
    roleTripsitter = await interaction.guild.roles.fetch(guildData.role_tripsitter) as Role;
    backupMessage += `<@&${roleTripsitter.id}> `;
  }
  if (guildData.role_helper) {
    roleHelper = await interaction.guild.roles.fetch(guildData.role_helper) as Role;
    backupMessage += `<@&${roleHelper.id}> `;
  }

  backupMessage += stripIndents`${actor} has inidicated they could use some backup!
    
  Be sure to read the log so you have the context!`;

  if (ticketData.meta_thread_id) {
    const metaThread = await interaction.guild.channels.fetch(ticketData.meta_thread_id) as ThreadChannel;
    await metaThread.send(backupMessage);
  } else {
    await interaction.channel?.send(backupMessage);
  }
};

/**
 * Handles removing of the NeedsHelp mode
 * @param {ButtonInteraction} interaction
 */
export async function tripsitmeFinish(
  interaction:ButtonInteraction,
) {
  await interaction.deferReply({ephemeral: true});
  if (!interaction.guild) {
    logger.debug(`[${PREFIX}] no guild!`);
    interaction.editReply('This must be performed in a guild!');
    return;
  }
  if (!interaction.member) {
    logger.debug(`[${PREFIX}] no member!`);
    interaction.editReply('This must be performed by a member of a guild!');
    return;
  }

  const meOrThem = interaction.customId.split('~')[1];
  const targetId = interaction.customId.split('~')[2];

  const guildId = interaction.guild.id;
  const guildData = await db<DiscordGuilds>('discord_guilds')
    .select(
      db.ref('role_needshelp').as('role_needshelp'),
      db.ref('channel_tripsit_meta').as('channel_tripsit_meta'),
    )
    .where('id', guildId)
    .first();
  if (!guildData) {
    interaction.reply('Could not find this guild in the DB!');
    return;
  }

  let roleNeedshelp = {} as Role;
  let channelTripsitMeta = {} as TextChannel;
  if (guildData.role_needshelp) {
    roleNeedshelp = await interaction.guild.roles.fetch(guildData.role_needshelp) as Role;
  }
  if (guildData.channel_tripsit_meta) {
    channelTripsitMeta = await interaction.guild.channels.fetch(guildData.channel_tripsit_meta) as TextChannel;
  }

  const target = await interaction.guild.members.fetch(targetId);
  const actor = interaction.member as GuildMember;

  logger.debug(stripIndents`[${PREFIX}] finish started:
    meOrThem: ${meOrThem}
    targetId: ${targetId}
    roleNeedshelpId: ${roleNeedshelp.id}
    channelTripsittersId: ${channelTripsitMeta.id}
    actor: ${actor.displayName}
    target: ${target.displayName}
  `);

  if (meOrThem === 'me' && targetId !== actor.id) {
    logger.debug(`[${PREFIX}] not the target!`);
    interaction.editReply({content: 'Only the user receiving help can click this button!'});
    return;
  }

  const userData = await db
    .select(
      db.ref('id'),
      db.ref('roles'),
    )
    .from<Users>('users')
    .where('discord_id', target.id)
    .first();

  logger.debug(`[${PREFIX}] userData: ${JSON.stringify(userData, null, 2)}`);

  if (userData === undefined) {
    const rejectMessage = `Hey need help${interaction.member}, ${meOrThem === 'me' ? 'you do' : `${target} does`} not have an open session!`;
    const embed = embedTemplate().setColor(Colors.DarkBlue);
    embed.setDescription(rejectMessage);
    logger.debug(`[${PREFIX}] target ${target} does not need help!`);
    interaction.editReply({embeds: [embed]});
    logger.debug(`[${PREFIX}] finished!`);
    return;
  }

  const ticketData = await db
    .select(
      db.ref('id').as('id'),
      db.ref('user_id').as('user_id'),
      db.ref('description').as('description'),
      db.ref('thread_id').as('thread_id'),
      db.ref('type').as('type'),
      db.ref('status').as('status'),
      db.ref('first_message_id').as('first_message_id'),
      db.ref('closed_by').as('closed_by'),
      db.ref('closed_at').as('closed_at'),
      db.ref('archived_at').as('archived_at'),
      db.ref('deleted_at').as('deleted_at'),
      db.ref('created_at').as('created_at'),
    )
    .from<UserTickets>('user_tickets')
    .where('user_id', userData.id)
    .where('type', 'TRIPSIT')
    .andWhereNot('status', 'CLOSED')
    .andWhereNot('status', 'RESOLVED')
    .first();

  logger.debug(`[${PREFIX}] ticketData: ${JSON.stringify(ticketData, null, 2)}`);

  if (ticketData === undefined) {
    logger.debug(`[${PREFIX}] no ticket!`);
    const rejectMessage = `Hey ${interaction.member}, ${meOrThem === 'me' ? 'you\'re' : `${target} is`} does not have an open session!`;
    const embed = embedTemplate().setColor(Colors.DarkBlue);
    embed.setDescription(rejectMessage);
    logger.debug(`[${PREFIX}] target ${target} does not need help!`);
    interaction.editReply({embeds: [embed]});
    logger.debug(`[${PREFIX}] finished!`);
    return true;
  }

  if (userData.roles) {
    const myMember = await interaction.guild.members.fetch(interaction.client.user.id);
    const myRole = myMember.roles.highest;
    const targetRoles:string[] = userData.roles.split(',') || [];

    if (roleNeedshelp) {
      // const targetHasNeedsHelpRole = (target.roles as GuildMemberRoleManager).cache.find(
      //   (role:Role) => role === roleNeedshelp,
      // ) !== undefined;
      // // logger.debug(`[${PREFIX}] targetHasNeedsHelpRole: ${targetHasNeedsHelpRole}`);
      if (roleNeedshelp.comparePositionTo(myRole) < 0) {
        try {
          logger.debug(`[${PREFIX}] Removing ${roleNeedshelp.name} from ${target.displayName}`);
          target.roles.remove(roleNeedshelp!);
        } catch (err) {
          logger.error(`[${PREFIX}] Error removing ${roleNeedshelp.name} from ${target.displayName}`);
          logger.error(err);
        }
      }
    }

    const test = interaction.guild.id;

    // readd each role to the target
    if (targetRoles) {
      targetRoles.forEach(async (roleId) => {
        // logger.debug(`[${PREFIX}] Re-adding roleId: ${roleId}`);
        if (!interaction.guild) return;
        const roleObj = await interaction.guild.roles.cache.find((r) => r.id === roleId) as Role;
        if (!ignoredRoles.includes(roleObj.id) &&
          roleObj.name !== '@everyone' &&
          roleObj.id !== roleNeedshelp.id) {
          if (roleObj.comparePositionTo(myRole) < 0) {
            logger.debug(`[${PREFIX}] Adding role ${roleObj.name} to ${target.displayName}`);
            try {
              target.roles.add(roleObj);
            } catch (err) {
              logger.error(`[${PREFIX}] Error adding role ${roleObj.name} to ${target.displayName}`);
              logger.error(err);
            }
          }
        }
      });
    }
  }

  // logger.debug(`[${PREFIX}] targetLastHelpedThreadId: ${targetLastHelpedThreadId}`);

  // Get the channel objects for the help thread
  let threadHelpUser = {} as ThreadChannel;
  try {
    threadHelpUser = await interaction.guild.channels.fetch(ticketData.thread_id) as ThreadChannel;
    threadHelpUser.setName(`💚│${target.displayName}'s channel!`);
  } catch (err) {
    logger.debug(`[${PREFIX}] There was an error updating the help thread, it was likely deleted:\n ${err}`);
  }

  const endHelpMessage = stripIndents`Hey ${target}, we're glad you're doing better!
    We've restored your old roles back to normal <3
    This thread will remain here for a day if you want to follow up tomorrow.
    After 7 days, or on request, it will be deleted to preserve your privacy =)`;

  try {
    threadHelpUser.send(endHelpMessage);
  } catch (err) {
    logger.error(`[${PREFIX}] Error sending end help message to ${threadHelpUser}`);
    logger.error(err);
  }

  let message:Message;
  await threadHelpUser.send(stripIndents`
      ${env.EMOJI_INVISIBLE}
      > **If you have a minute, your feedback is important to us!**
      > Please rate your experience with ${interaction.guild.name}'s service by reacting below.
      > Thank you!
      ${env.EMOJI_INVISIBLE}
      `)
    .then(async (msg) => {
      message = msg;
      await msg.react('🙁');
      await msg.react('😕');
      await msg.react('😐');
      await msg.react('🙂');
      await msg.react('😁');

      // Setup the reaction collector
      const filter = (reaction:MessageReaction, user:User) => user.id === target.id;
      const collector = message.createReactionCollector({filter, time: 1000 * 60 * 60 * 24});
      collector.on('collect', async (reaction, user) => {
        threadHelpUser.send(stripIndents`
          ${env.EMOJI_INVISIBLE}
          > Thank you for your feedback, here's a cookie! 🍪
          ${env.EMOJI_INVISIBLE}
          `);
        logger.debug(`[${PREFIX}] Collected ${reaction.emoji.name} from ${threadHelpUser}`);
        const finalEmbed = embedTemplate()
          .setColor(Colors.Blue)
          .setDescription(`Collected ${reaction.emoji.name} from ${threadHelpUser}`);
        try {
          await channelTripsitMeta.send({embeds: [finalEmbed]});
        } catch (err) {
          logger.debug(`[${PREFIX}] Failed to send message, am i still in the tripsit guild?`);
        }
        msg.delete();
        collector.stop();
      });
    });

  logger.debug(`[${PREFIX}] ${target.user.tag} (${target.user.id}) is no longer being helped!`);
  await interaction.editReply({content: 'Done!'});
};


const teamRoles = [
  env.ROLE_DIRECTOR,
  env.ROLE_SUCCESSOR,
  env.ROLE_SYSADMIN,
  env.ROLE_LEADDEV,
  env.ROLE_IRCADMIN,
  env.ROLE_DISCORDADMIN,
  env.ROLE_IRCOP,
  env.ROLE_MODERATOR,
  env.ROLE_TRIPSITTER,
  env.ROLE_TEAMTRIPSIT,
  env.ROLE_TRIPBOT2,
  env.ROLE_TRIPBOT,
  env.ROLE_BOT,
  env.ROLE_DEVELOPER,
];

const colorRoles = [
  env.ROLE_TREE,
  env.ROLE_SPROUT,
  env.ROLE_SEEDLING,
  env.ROLE_BOOSTER,
  env.ROLE_RED,
  env.ROLE_ORANGE,
  env.ROLE_YELLOW,
  env.ROLE_GREEN,
  env.ROLE_BLUE,
  env.ROLE_PURPLE,
  env.ROLE_PINK,
  // env.ROLE_BROWN,
  env.ROLE_BLACK,
  env.ROLE_WHITE,
];

const mindsetRoles = [
  env.ROLE_DRUNK,
  env.ROLE_HIGH,
  env.ROLE_ROLLING,
  env.ROLE_TRIPPING,
  env.ROLE_DISSOCIATING,
  env.ROLE_STIMMING,
  env.ROLE_NODDING,
  env.ROLE_SOBER,
];

const otherRoles = [
  env.ROLE_VERIFIED,
];

const ignoredRoles = `${teamRoles},${colorRoles},${mindsetRoles},${otherRoles}`;
