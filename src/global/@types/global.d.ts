import { ButtonBuilder, Client, Guild } from 'discord.js';

declare global {
  var guildInvites: Collection; // eslint-disable-line
  var reactionRoles: { [key: string]: any };// eslint-disable-line
  var bootTime: Date; // eslint-disable-line
  var client: Client; // eslint-disable-line
  var announcements: string[]; // eslint-disable-line
  var lpmDict: LpmDict; // eslint-disable-line
  var lpmTime: number[]; // eslint-disable-line
  var emojiGuildA: Guild; // eslint-disable-line
  var emojiGet: (name:string) => Emoji; // eslint-disable-line
  var buttons: Buttons; // eslint-disable-line
}

export {};

export type GameName = 'Coinflip' | 'Roulette' | 'Blackjack' | 'Slots';

export type Buttons = {
  'name': ButtonBuilder,
  'accept': ButtonBuilder,
  'decline': ButtonBuilder,
  'start': ButtonBuilder,
  'quit': ButtonBuilder,
  'town': ButtonBuilder,
  'bounties': ButtonBuilder,
  'market': ButtonBuilder,
  'arcade': ButtonBuilder,
  'home': ButtonBuilder,
  'quest': ButtonBuilder,
  'dungeon': ButtonBuilder,
  'raid': ButtonBuilder,
  'inventory': ButtonBuilder,
  'stats': ButtonBuilder,
  'guild': ButtonBuilder,
  'buy': ButtonBuilder,
  'slotMachine': ButtonBuilder,
  'coinFlip': ButtonBuilder,
  'roulette': ButtonBuilder,
  'blackjack': ButtonBuilder,
  'trivia': ButtonBuilder,
  'wager1': ButtonBuilder,
  'wager10': ButtonBuilder,
  'wager100': ButtonBuilder,
  'wager1000': ButtonBuilder,
  'wager10000': ButtonBuilder,
  'wager100000': ButtonBuilder,
  'coinflipHeads': ButtonBuilder,
  'coinflipTails': ButtonBuilder,
  'rouletteRed': ButtonBuilder,
  'rouletteBlack': ButtonBuilder,
  'rouletteFirst': ButtonBuilder,
  'rouletteSecond': ButtonBuilder,
  'rouletteThird': ButtonBuilder,
  'rouletteOdd': ButtonBuilder,
  'rouletteEven': ButtonBuilder,
  'roulette1to12': ButtonBuilder,
  'roulette13to24': ButtonBuilder,
  'roulette25to36': ButtonBuilder,
  'rouletteHigh': ButtonBuilder,
  'rouletteLow': ButtonBuilder,
  'rouletteZero': ButtonBuilder,
  'blackjackHit': ButtonBuilder,
  'blackjackStand': ButtonBuilder,
  'blackjackDouble': ButtonBuilder,
  'blackjackSplit': ButtonBuilder,
  'blackjackSurrender': ButtonBuilder,
};

export type LpmDict = {
  [key: string]: {
    position: number;
    name: string;
    alert: number;
    lp1: number;
    lp1Max: number;
    lp5: number;
    lp5Max: number;
    lp10: number;
    lp10Max: number;
    lp30: number;
    lp30Max: number;
    lp60: number;
    lp60Max: number;
  }
};
