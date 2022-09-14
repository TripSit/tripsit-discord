require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

export default {
  NODE_ENV: isProd ? 'production' : 'development',
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_CLIENT_REDIRECT_URI: process.env.DISCORD_CLIENT_REDIRECT_URI,
  DISCORD_CLIENT_TOKEN: process.env.DISCORD_CLIENT_TOKEN,

  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  YOUTUBE_TOKEN: process.env.YOUTUBE_TOKEN,
  IMGUR_ID: process.env.IMGUR_ID,
  RAPID_TOKEN: process.env.RAPID_TOKEN,
  IMDB_TOKEN: process.env.IMDB_TOKEN,

  FIREBASE_DB_URL: process.env.FIREBASE_DB_URL,
  FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_REALTIME_KEY: process.env.FIREBASE_REALTIME_KEY,
  IRC_PASSWORD: process.env.IRC_PASSWORD,

  PORT: '8080',
  TS_ICON_URL: 'https://fossdroid.com/images/icons/me.tripsit.tripmobile.13.png',
  FLAME_ICON_URL: 'https://imgur.com/b923xK2.png',
  DISCLAIMER: 'Dose responsibly!',
  DISCORD_OWNER_ID: '177537158419054592',
  DISCORD_GUILD_ID: isProd ? '179641883222474752' : '960606557622657026',
  FIREBASE_DB_TICKETS: isProd ? 'tickets_v5' : 'tickets_dev',
  FIREBASE_DB_GUILDS: isProd ? 'guilds_v5' : 'guilds_dev',
  FIREBASE_DB_USERS: isProd ? 'users_v5' : 'users_dev',
  FIREBASE_DB_TIMERS: isProd ? 'timers_v5' : 'timers_dev',
  IRC_SERVER: 'innsbruck.tripsit.me',
  IRC_USERNAME: isProd ? 'TSModRelay' : 'TSDev',
  IRC_BOTPREFIX: '!',

  CATEGORY_GATEWAY: isProd ? '' : '',
  CHANNEL_TICKETBOOTH: isProd ? '' : '',
  CHANNEL_START: isProd ? '955482136075436043' : '960606558134362221',
  CHANNEL_ANNOUNCEMENTS: isProd ? '834959455111348244' : '834959455111348244',
  CHANNEL_BOTSPAM: isProd ? '955809644524216390' : '960606558549594162',
  CHANNEL_RULES: isProd ? '834959422627381279' : '960606558134362220',
  CHANNEL_TECHHELP: isProd ? '970695525693288498' : '974329684751970334',

  CATEGORY_VOLUNTEERS: isProd ? '' : '',
  CHANNEL_HOWTOTRIPSIT: isProd ? '973659526572150794' : '976835771585687712',
  CHANNEL_TRIPSITTERS: isProd ? '955831869549719573' : '960606558373441561',
  CHANNEL_RTRIPSIT: isProd ? '' : '',

  CATEGROY_HARMREDUCTIONCENTRE: isProd ? '' : '',
  CHANNEL_TRIPSIT: isProd ? '955834628881653791' : '960606558373441559',
  CHANNEL_OPENTRIPSIT: isProd ? '988160957979185212' : '988100570470572052',
  CHANNEL_OPENTRIPSIT1: isProd ? '979179104903524394' : '981268129273491497',
  CHANNEL_OPENTRIPSIT2: isProd ? '988161015680225350' : '988100661159804928',
  CHANNEL_CLOSEDTRIPSIT: isProd ? '986717482368782366' : '986726748173525062',
  CHANNEL_SANCTUARY: isProd ? '851141955080421396' : '960606558373441560',
  CHANNEL_HRRESOURCES: isProd ? '' : '',
  CHANNEL_DRUGQUESTIONS: isProd ? '960554949836685382' : '960606558373441558',

  CATEGORY_CAMPGROUND: isProd ? '' : '',
  CHANNEL_GENERAL: isProd ? '538811092084850708' : '960606558373441556',
  CHANNEL_PETS: isProd ? '978686531852189747' : '983899717798854736',
  CHANNEL_FOOD: isProd ? '981920414898991104' : '983899682835148891',
  CHANNEL_MUSIC: isProd ? '954887822786048001' : '960606558549594164',
  CHANNEL_MOVIES: isProd ? '992136601767514162' : '992159734939521117',
  CHANNEL_SCIENCE: isProd ? '975037860644261939' : '977023342152401016',
  CHANNEL_GAMING: isProd ? '873385311613382677' : '960606558549594165',
  CHANNEL_CREATIVE: isProd ? '958727922699628564' : '960606558549594166',
  CHANNEL_MEMES: isProd ? '' : '',
  CHANNEL_TRIVIA: isProd ? '' : '',

  CATEGORY_BACKSTAGE: isProd ? '' : '',
  CHANNEL_LOUNGE: isProd ? '851192630469722133' : '992489471306109000',
  CHANNEL_OPIATES: isProd ? '992134995625922620' : '992159960685346939',
  CHANNEL_STIMULANTS: isProd ? '988161828825743400' : '992160082873819137',
  CHANNEL_DEPRESSANTS: isProd ? '848826987048075294' : '992160140977504256',
  CHANNEL_DISSOCIATIVES: isProd ? '978051567989178388' : '992160192013815920',
  CHANNEL_PSYCHEDELICS: isProd ? '996096935805063188' : '978031761739116544',

  CATEGORY_VIPCABINS: isProd ? '' : '',
  CHANNEL_KUDOS: isProd ? '' : '',
  CHANNEL_VIPLOUNGE: isProd ? '848826318308507658' : '960606558549594163',
  CHANNEL_ADULTSWIM: isProd ? '' : '',
  CHANNEL_GOLDLOUNGE: isProd ? '974304894037155880' : '977023412960657418',
  CHANNEL_TALKTOTS: isProd ? '955495651200872549' : '960606558549594168',
  CHANNEL_BESTOF: isProd ? '991811665484071003' : '991798359948009615',
  CHANNEL_MINECRAFT: isProd ? '984546283861737512' : '988100049944850493',
  CHANNEL_HUB: isProd ? '1000559873232207902' : '960606558801264702',

  CATEGORY_COLLABORATION: isProd ? '' : '',

  CATEGORY_TEAMTRIPSIT: isProd ? '' : '',
  CHANNEL_TRIPSITME: isProd ? '332618560675512320' : '960606559140974656',
  CHANNEL_MODHAVEN: isProd ? '946466454142877747' : '960606558801264710',
  CHANNEL_TEAMTRIPSIT: isProd ? '327616683248189440' : '327616683248189440',
  CHANNEL_MODERATORS: isProd ? '332618867970932737' : '960606559140974654',
  CHANNEL_OPERATORS: isProd ? '334014182678593536' : '960606559140974655',
  CHANNEL_MODLOG: isProd ? '943552707564830760' : '960606558801264709',
  CHANNEL_TEAMMEETING: isProd ? '851117188815126568' : '960606558801264708',

  CATEGORY_DEVELOPMENT: isProd ? '' : '',
  CHANNEL_DEVWELCOME: isProd ? '978662545160274011' : '978657631768023060',
  CHANNEL_DEVANNCOUNCE: isProd ? '' : '',
  CHANNEL_DEVOFFTOPIC: isProd ? '975038983245545472' : '978655974556590090',
  CHANNEL_DEVELOPMENT: isProd ? '834965529239355424' : '978656013647507456',
  CHANNEL_DEVPOLLS: isProd ? '' : '',
  CHANNEL_TRIPCORD: isProd ? '973734296835739708' : '978656163614830612',
  CHANNEL_TRIPBOT: isProd ? '960158893957345311' : '960606558373441564',
  CHANNEL_DESIGN: isProd ? '' : '',
  CHANNEL_SANDBOX: isProd ? '943599582921756732' : '',
  CHANNEL_SANDBOX_DEV: isProd ? '' : '960606558373441565',
  CHANNEL_WIKICONTENT: isProd ? '946833118269145109' : '978656057415065650',
  CHANNEL_MINECRAFTADMIN: isProd ? '984546313079234610' : '',
  CHANNEL_TRIPBOTLOGS: isProd ? '992492502131150848' : '984087147973853234',

  CATEGORY_ARCHIVED: isProd ? '' : '',
  CHANNEL_TRIPBMOBILE: isProd ? '961979713713238106' : '978656111072796693',
  CHANNEL_TRIPSITREDDIT: isProd ? '968307686020091925' : '978656311623446689',
  CHANNEL_VIPWELCOME: isProd ? '978051268134203402' : '978030823892733973',
  CHANNEL_CLEARMIND: isProd ? '978051375474806864' : '978031512429670421',
  CHANNEL_PSYCHONAUT: isProd ? '991439973498769560' : '960606558549594167',
  CHANNEL_DISSONAUT: isProd ? '978051567989178388' : '978032903541911662',
  CHANNEL_TEMPVOICE: isProd ? '1000559873232207902' : '1019557396932218910',
  CATEGORY_TEMPVOICE: isProd ? '978029881852055582' : '960606558373441563',
  CHANNEL_DELERIANTS: isProd ? '992134853816483870' : '992160017971155066',

  ROLE_DIRECTOR: isProd ? '185175683184590849' : '960606558134362217',
  ROLE_SUCCESSOR: isProd ? '980235574868865084' : '981901028813328444',
  ROLE_SYSADMIN: isProd ? '980235889001267230' : '981901132446191626',
  ROLE_LEADDEV: isProd ? '980237741721788476' : '981901424642379826',
  ROLE_IRCADMIN: isProd ? '980236747067752549' : '981904740264869898',
  ROLE_DISCORDADMIN: isProd ? '978640233715355729' : '981901480225292328',
  ROLE_IRCOP: isProd ? '955818629654523914' : '960606558134362216',
  ROLE_MODERATOR: isProd ? '251468986141638667' : '960606558134362215',
  ROLE_TRIPSITTER: isProd ? '327619241953984513' : '960606558134362214',
  ROLE_DEVELOPER: isProd ? '972964801955364944' : '960606558050480151',
  ROLE_TEAMTRIPSIT: isProd ? '947906522824986716' : '960606558134362213',

  ROLE_NEWBIE: isProd ? '' : '960606557622657031',
  ROLE_MUTED: isProd ? '959577073561767936' : '981905918650351656',
  ROLE_TEMPVOICE: isProd ? '955841809899221072' : '960606558050480155',

  ROLE_HELPER: isProd ? '956960918640656457' : '960606558050480154',
  ROLE_NEEDSHELP: isProd ? '955853983287754782' : '960606558071435314',
  ROLE_RESEARCHER: isProd ? '976283188768956417' : '978040177987575890',
  ROLE_CLEARMIND: isProd ? '978050265645187122' : '978039843751858267',
  ROLE_CODER: isProd ? '834911723361402943' : '978039765691686922',
  ROLE_MEMBER: isProd ? '1009864163478216775' : '1005233837867012136',
  ROLE_UNDERBAN: isProd ? '958017108036448287' : '1007306515226562601',
  ROLE_VIP: isProd ? '943600905289334784' : '960606558050480156',
  ROLE_DJ: isProd ? '955451412878331974' : '960606558050480157',
  ROLE_VERIFIED: isProd ? '980839544855334962' : '980567459549544508',
  ROLE_UNVERIFIED: isProd ? '1009864163478216775' : '1009862883108212766',

  ROLE_HR_PRESENTER: isProd ? '958387147084296232' : '960606557622657030',
  ROLE_HR_LISTENER: isProd ? '958387225782026271' : '960606557622657029',
  ROLE_HR_MODERATOR: isProd ? '958387343058960434' : '960606557622657028',

  ROLE_VOTEBANNED: isProd ? '991811000301015140' : '989286991633977368',
  ROLE_VOTEKICKED: isProd ? '991811100922364114' : '989287048621985812',
  ROLE_VOTETIMEOUT: isProd ? '991811200901976259' : '989287095367528578',
  ROLE_VUTEUNDERBAN: isProd ? '991811318464139416' : '989287082222579792',

  ROLE_TRIPBOT2: isProd ? '954170679903805454' : '975113464509005847',
  ROLE_TRIPBOT: isProd ? '957783151718047745' : '976854619860910133',
  ROLE_BOT: isProd ? '848557098726850590' : '960606558134362212',

  ROLE_TREE: isProd ? '954133862601089095' : '960606558050480148',
  ROLE_PATRON: isProd ? '954133862601089095' : '960606558050480148',
  ROLE_SPROUT: isProd ? '955618510631993414' : '960606557622657033',
  ROLE_SEEDLING: isProd ? '955618661274644491' : '960606557622657032',
  ROLE_BOOSTER: isProd ? '853082033224024135' : '980116577846431774',

  ROLE_DRUNK: isProd ? '955485069294854154' : '960606558071435322',
  ROLE_HIGH: isProd ? '955482289335320626' : '960606558109188096',
  ROLE_ROLLING: isProd ? '955485203592261633' : '960606558071435323',
  ROLE_TRIPPING: isProd ? '955485936915980348' : '960606558071435319',
  ROLE_DISSOCIATING: isProd ? '955485314305101874' : '960606558071435321',
  ROLE_STIMMING: isProd ? '955485549035126815' : '960606558071435318',
  ROLE_NODDING: isProd ? '955485615879749682' : '960606558071435320',
  ROLE_SOBER: isProd ? '955486188268056656' : '960606558071435317',
  ROLE_TALKATIVE: isProd ? '981437055030677554' : '981905326506922024',
  ROLE_WORKING: isProd ? '955486102549049344' : '960606558071435316',
  ROLE_RED: isProd ? '957299004415295539' : '960606558109188103',
  ROLE_GREEN: isProd ? '957299256941740072' : '960606558109188100',
  ROLE_BLUE: isProd ? '957299516833411163' : '960606558109188099',
  ROLE_YELLOW: isProd ? '957299118546518017' : '960606558109188101',
  ROLE_PURPLE: isProd ? '957299595644403772' : '960606558109188098',
  ROLE_ORANGE: isProd ? '957299049499877378' : '960606558109188102',
  ROLE_WHITE: isProd ? '957298729675784273' : '960606558109188105',
  ROLE_BLACK: isProd ? '957298800236564481' : '960606558109188104',
  ROLE_BROWN: isProd ? '977641967829782588' : '',
  ROLE_PINK: isProd ? '958073126485368922' : '960606558109188097',
};
