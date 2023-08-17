import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  ContextMenuCommandBuilder,
  GuildMember,
  ModalSubmitInteraction,
} from 'discord.js';
import {
  ApplicationCommandType,
  TextInputStyle,
} from 'discord-api-types/v10';
import { stripIndents } from 'common-tags';
import { MessageCommand } from '../../@types/commandDef';
// import log from '../../../global/utils/log';
import { moderate } from '../../../global/commands/g.moderate';
import commandContext from '../../utils/context';
import { UserActionType } from '../../../global/@types/database';

const F = f(__filename);

export const mReport: MessageCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('Report')
    .setType(ApplicationCommandType.Message),
  async execute(interaction) {
    log.info(F, await commandContext(interaction));
    await interaction.showModal(new ModalBuilder()
      .setCustomId(`reportModal~${interaction.id}`)
      .setTitle('Tripbot Report')
      .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
        .setLabel('Why are you reporting this?')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Please be descriptive!')
        .setRequired(true)
        .setCustomId('internalNote'))));
    const filter = (i:ModalSubmitInteraction) => i.customId.includes('reportModal');
    interaction.awaitModalSubmit({ filter, time: 0 })
      .then(async i => {
        if (i.customId.split('~')[1] !== interaction.id) return;
        await i.deferReply({ ephemeral: true });
        // log.debug(F, `Result: ${result}`);
        await i.editReply(await moderate(
          interaction.member as GuildMember,
          'REPORT' as UserActionType,
          interaction.targetMessage.member?.id ?? interaction.targetMessage.author.id,
          stripIndents`
            ${i.fields.getTextInputValue('internalNote')}
        
            **The offending message**
            > ${interaction.targetMessage.cleanContent}
            ${interaction.targetMessage.url}
          `,
          null,
          null,
        ));
      });
    return true;
  },
};

export default mReport;
