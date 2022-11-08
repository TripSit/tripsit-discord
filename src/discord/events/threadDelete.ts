import {
  TextChannel,
} from 'discord.js';
import {
  AuditLogEvent,
} from 'discord-api-types/v10';
import {
  threadDeleteEvent,
} from '../@types/eventDef';
import env from '../../global/utils/env.config';
import {db, getOpenTicket} from '../../global/utils/knex';
import {TicketStatus, UserTickets} from '../../global/@types/pgdb';
// import logger from '../../global/utils/logger';
// import * as path from 'path';
// const PREFIX = path.parse(__filename).name;

// https://discordjs.guide/popular-topics/audit-logs.html#who-deleted-a-message

export const threadDelete: threadDeleteEvent = {
  name: 'threadDelete',
  async execute(thread) {
    // Only run on Tripsit, we don't want to snoop on other guilds ( ͡~ ͜ʖ ͡°)
    if (!thread.guild) return;
    if (thread.guild.id !== env.DISCORD_GUILD_ID) {
      return;
    }

    const fetchedLogs = await thread.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.RoleCreate,
    });

    // Since there's only 1 audit log entry in this collection, grab the first one
    const auditLog = fetchedLogs.entries.first();

    const botlog = thread.client.channels.cache.get(env.CHANNEL_BOTLOG) as TextChannel;

    // Find if the channel is used as a thread_id in any tickets
    const ticketData = await getOpenTicket(null, thread.id);

    if (ticketData) {
      // log.debug(`[${PREFIX}] closing ticket: ${JSON.stringify(ticketData, null, 2)}`);
      // If it is, close the ticket
      await db<UserTickets>('user_tickets')
        .update({
          status: 'CLOSED' as TicketStatus,
        })
        .where('id', ticketData.id);
    }

    // Perform a coherence check to make sure that there's *something*
    if (!auditLog) {
      botlog.send(`${thread.name} was deleted, but no relevant audit logs were found.`);
      return;
    }

    let response = '' as string;

    if (auditLog.executor) {
      response = `${thread.name} was deleted by ${auditLog.executor.tag}.`;
    } else {
      response = `${thread.name} was deleted, but the audit log was inconclusive.`;
    }

    botlog.send(response);
  },
};
