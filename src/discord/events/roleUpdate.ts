import {
  TextChannel,
} from 'discord.js';
import {
  AuditLogEvent,
} from 'discord-api-types/v10';
import {
  roleUpdateEvent,
} from '../@types/eventDef';
import env from '../../global/utils/env.config';
// import logger from '../../global/utils/logger';
// import * as path from 'path';
// const PREFIX = path.parse(__filename).name;

// https://discordjs.guide/popular-topics/audit-logs.html#who-deleted-a-message

export const roleUpdate: roleUpdateEvent = {
  name: 'roleUpdate',
  async execute(oldRole, newRole) {
    // Only run on Tripsit, we don't want to snoop on other guilds ( ͡~ ͜ʖ ͡°)
    if (newRole.guild.id !== env.DISCORD_GUILD_ID) {
      return;
    }

    const fetchedLogs = await newRole.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.ChannelUpdate,
    });

    // Since there's only 1 audit log entry in this collection, grab the first one
    const creationLog = fetchedLogs.entries.first();

    const botlog = client.channels.cache.get(env.CHANNEL_BOTLOG) as TextChannel;

    // Perform a coherence check to make sure that there's *something*
    if (!creationLog) {
      botlog.send(`${newRole.name} was updated, but no relevant audit logs were found.`);
      return;
    }

    let response = '' as string;

    if (creationLog.executor) {
      response = `${newRole.name} was updated by ${creationLog.executor.tag}:`;
      response = `${creationLog.changes.map((change) => `\`${change.key}\` changed from \`${change.old}\` to \`${change.new}\``).join('\n')}`; // eslint-disable-line max-len
    } else {
      response = `${newRole.name} was updated, but the audit log was inconclusive.`;
      response = `${creationLog.changes.map((change) => `\`${change.key}\` changed from \`${change.old}\` to \`${change.new}\``).join('\n')}`; // eslint-disable-line max-len
    }

    botlog.send(response);
  },
};
