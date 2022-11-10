require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

export default {
  NODE_ENV: isProd ? 'production' : 'development',
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_CLIENT_REDIRECT_URI: process.env.DISCORD_CLIENT_REDIRECT_URI,
  DISCORD_CLIENT_TOKEN: process.env.DISCORD_CLIENT_TOKEN,

  POSTGRES_DBURL: isProd ? process.env.POSTGRES_PASSWORD : 'postgres://tripsit:TripSitLol123@localhost:5432/tripsit',

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

  CHANNEL_TICKETBOOTH: isProd ? '1014889750206881792' : '1026488494446608437',
  CHANNEL_WELCOME: isProd ? '1021385869262864464' : '1026488481444270131',

  CHANNEL_STATS_TOTAL: isProd ? '' : '1039713346783555665',
  CHANNEL_STATS_ONLINE: isProd ? '' : '1039713294618996766',
  CHANNEL_STATS_MAX: isProd ? '' : '1039715752002986035',

  CATEGORY_GATEWAY: isProd ? '538811485158244373' : '960606558134362219',
  CHANNEL_START: isProd ? '955482136075436043' : '960606558134362221',
  CHANNEL_ANNOUNCEMENTS: isProd ? '834959455111348244' : '977022868686798878',
  CHANNEL_RULES: isProd ? '834959422627381279' : '960606558134362220',
  CHANNEL_BOTSPAM: isProd ? '955809644524216390' : '960606558549594162',
  CHANNEL_HELPDESK: isProd ? '970695525693288498' : '974329684751970334',
  CHANNEL_KUDOS: isProd ? '1001229603911782410' : '1020770348569985034',
  CHANNEL_BESTOF: isProd ? '991811665484071003' : '991798359948009615',
  CHANNEL_TALKTOTS: isProd ? '955495651200872549' : '960606558549594168',

  CATEGROY_HARMREDUCTIONCENTRE: isProd ? '848555446394552370' : '1005166815321796748',
  CHANNEL_TRIPSITMETA: isProd ? '1022851085884477471' : '960606558373441561',
  CHANNEL_TRIPSIT: isProd ? '955834628881653791' : '960606558373441559',
  // CHANNEL_OPENTRIPSIT: isProd ? '988160957979185212' : '988100570470572052',
  CHANNEL_OPENTRIPSIT1: isProd ? '979179104903524394' : '981268129273491497',
  CHANNEL_OPENTRIPSIT2: isProd ? '988161015680225350' : '988100661159804928',
  CHANNEL_WEBTRIPSIT: isProd ? '' : '',
  CHANNEL_WEBTRIPSIT1: isProd ? '1021398463059083274' : '',
  CHANNEL_WEBTRIPSIT2: isProd ? '1021398501915119757' : '',
  CHANNEL_RTRIPSIT: isProd ? '997485248503885894' : '1005168112670359642',
  CHANNEL_HRRESOURCES: isProd ? '1020172722304729088' : '960606559573008414',
  CHANNEL_DRUGQUESTIONS: isProd ? '1019792079498530867' : '960606558373441558',

  CATEGORY_CAMPGROUND: isProd ? '848731346959335445' : '960606558373441563',
  CHANNEL_GENERAL: isProd ? '538811092084850708' : '960606558373441556',
  CHANNEL_PETS: isProd ? '978686531852189747' : '983899717798854736',
  CHANNEL_FOOD: isProd ? '981920414898991104' : '983899682835148891',
  CHANNEL_MUSIC: isProd ? '954887822786048001' : '960606558549594164',
  CHANNEL_MEMES: isProd ? '1005232942269857843' : '1020770119321915482',
  CHANNEL_MOVIES: isProd ? '992136601767514162' : '992159734939521117',
  CHANNEL_GAMING: isProd ? '873385311613382677' : '960606558549594165',
  CHANNEL_SCIENCE: isProd ? '975037860644261939' : '977023342152401016',
  CHANNEL_CREATIVE: isProd ? '958727922699628564' : '960606558549594166',
  CHANNEL_COMPSCI: isProd ? '1025919891011797112' : '',

  CATEGORY_BACKSTAGE: isProd ? '992484502909747230' : '1020773016986193950',
  CHANNEL_LOUNGE: isProd ? '851192630469722133' : '992489471306109000',
  CHANNEL_VIPLOUNGE: isProd ? '848826318308507658' : '960606558549594163',
  CHANNEL_GOLDLOUNGE: isProd ? '974304894037155880' : '977023412960657418',
  CHANNEL_REALTALK: isProd ? '993562308355833947' : '1020770403364388875',
  CHANNEL_SANCTUARY: isProd ? '851141955080421396' : '960606558373441560',
  CHANNEL_TREES: isProd ? '1006911613690970142' : '1020770274326609931',
  CHANNEL_OPIATES: isProd ? '992134995625922620' : '992159960685346939',
  CHANNEL_STIMULANTS: isProd ? '988161828825743400' : '992160082873819137',
  CHANNEL_DEPRESSANTS: isProd ? '848826987048075294' : '992160140977504256',
  CHANNEL_DISSOCIATIVES: isProd ? '978051567989178388' : '992160192013815920',
  CHANNEL_PSYCHEDELICS: isProd ? '996096935805063188' : '978031761739116544',

  CATEGORY_CAMPFIRE: isProd ? '992484502909747230' : '1020773016986193950',

  CHANNEL_CAMPFIRE: isProd ? '1000559873232207902' : '1028055589856759868',

  CATEGORY_ARCADE: isProd ? '1025976352723185726' : '1027290748351164457',
  CHANNEL_TRIVIA: isProd ? '1007725155981733970' : '1020770137277730997',
  CHANNEL_GAMES: isProd ? '1024259114056036402' : '',
  CHANNEL_MIDJOURNEY: isProd ? '1024348745770471484' : '',

  CATEGORY_COLLABORATION: isProd ? '991688510325133362' : '',

  CATEGORY_TEAMTRIPSIT: isProd ? '1002624862151512124' : '960606558801264706',
  CHANNEL_MODHAVEN: isProd ? '946466454142877747' : '960606558801264710',
  CHANNEL_TEAMTRIPSIT: isProd ? '327616683248189440' : '1039233961488044032',
  CHANNEL_MODERATORS: isProd ? '332618867970932737' : '960606559140974654',
  CHANNEL_MODLOG: isProd ? '943552707564830760' : '960606558801264709',
  CHANNEL_BOTLOG: isProd ? '992492502131150848' : '1025097862549356584',
  CHANNEL_TEAMMEETING: isProd ? '851117188815126568' : '960606558801264708',

  CATEGORY_DEVELOPMENT: isProd ? '961979608553640046' : '977023500827127818',
  CHANNEL_APPLICATIONS: isProd ? '1022849531974529104' : '1019409788293107832',
  CHANNEL_DEVANNCOUNCE: isProd ? '978752443007520898' : '1027293926056529981',
  CHANNEL_DEVOFFTOPIC: isProd ? '975038983245545472' : '978655974556590090',
  CHANNEL_DEVELOPMENT: isProd ? '834965529239355424' : '978656013647507456',
  CHANNEL_DISCORD: isProd ? '973734296835739708' : '978656163614830612',
  CHANNEL_TRIPBOT: isProd ? '960158893957345311' : '960606558373441564',
  CHANNEL_WIKICONTENT: isProd ? '946833118269145109' : '978656057415065650',
  CHANNEL_DESIGN: isProd ? '991398683444781206' : '1027294003839909898',
  CHANNEL_IRC: isProd ? '983801414897791067' : '1027294040653316237',
  CHANNEL_MATRIX: isProd ? '1022542674055671861' : '1027294091618295829',
  CHANNEL_TRIPMOBILE: isProd ? '961979713713238106' : '978656111072796693',
  CHANNEL_SANDBOX: isProd ? '943599582921756732' : '960606558373441565',
  CHANNEL_DEVELOPMENTVOICE: isProd ? '970848692158464021' : '',

  CATEGORY_ARCHIVED: isProd ? '' : '',
  CHANNEL_SANDBOX_DEV: isProd ? '' : '960606558373441565',
  CHANNEL_MINECRAFTADMIN: isProd ? '984546313079234610' : '',
  CHANNEL_CLOSEDTRIPSIT: isProd ? '986717482368782366' : '986726748173525062',
  CHANNEL_TRIPSITREDDIT: isProd ? '968307686020091925' : '978656311623446689',
  CHANNEL_VIPWELCOME: isProd ? '978051268134203402' : '978030823892733973',
  CHANNEL_CLEARMIND: isProd ? '978051375474806864' : '978031512429670421',
  CHANNEL_PSYCHONAUT: isProd ? '991439973498769560' : '960606558549594167',
  CHANNEL_DISSONAUT: isProd ? '978051567989178388' : '978032903541911662',

  CHANNEL_DELERIANTS: isProd ? '992134853816483870' : '992160017971155066',
  CHANNEL_MINECRAFT: isProd ? '984546283861737512' : '988100049944850493',
  CHANNEL_TRIPSITME: isProd ? '332618560675512320' : '960606559140974656',
  CHANNEL_OPERATORS: isProd ? '334014182678593536' : '960606559140974655',

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
  ROLE_TRIPBOTDEV: isProd ? '999359483455217675' : '1040031870525649006',

  ROLE_NEWBIE: isProd ? '' : '960606557622657031',
  ROLE_MUTED: isProd ? '959577073561767936' : '981905918650351656',
  ROLE_TEMPVOICE: isProd ? '955841809899221072' : '960606558050480155',

  ROLE_HELPER: isProd ? '956960918640656457' : '960606558050480154',
  ROLE_NEEDSHELP: isProd ? '955853983287754782' : '960606558071435314',
  ROLE_RESEARCHER: isProd ? '976283188768956417' : '978040177987575890',
  ROLE_CLEARMIND: isProd ? '978050265645187122' : '978039843751858267',
  ROLE_CONSULTANT: isProd ? '834911723361402943' : '978039765691686922',
  ROLE_MEMBER: isProd ? '1009864163478216775' : '1005233837867012136',
  ROLE_UNDERBAN: isProd ? '958017108036448287' : '1007306515226562601',
  ROLE_DJ: isProd ? '955451412878331974' : '960606558050480157',
  ROLE_VERIFIED: isProd ? '980839544855334962' : '980567459549544508',
  ROLE_UNVERIFIED: isProd ? '1009864163478216775' : '1009862883108212766',

  ROLE_VIP: isProd ? '943600905289334784' : '1038430958271086623',
  ROLE_VIP_5: isProd ? '1007115915734831185' : '1038434412024565871',
  ROLE_VIP_10: isProd ? '955451412878331974' : '1038431127699992648',
  ROLE_VIP_20: isProd ? '1002618571949625385' : '1038431172306415648',
  ROLE_VIP_30: isProd ? '1002259862199206038' : '1038431200357916702',
  ROLE_VIP_40: isProd ? '1002618888422428802' : '1038431238538678333',
  ROLE_VIP_50: isProd ? '1002262327481081977' : '1038431327613112350',
  ROLE_VIP_60: isProd ? '1002619161421283338' : '1038431331685781504',
  // ROLE_VIP_70: isProd ? '' : '1038431336903495730',
  // ROLE_VIP_80: isProd ? '' : '1038431343840862258',
  // ROLE_VIP_90: isProd ? '' : '1038431367438028851',
  // ROLE_VIP_100: isProd ? '' : '1038431372332761088',


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

  EMOJI_HELPER: isProd ? '<:ts_helper:979362238789992538>' : '<:ts_helper:980934790956077076>',
  EMOJI_INVISIBLE: isProd ? '<:invisible:976853930489298984>' : '<:invisible:976824380564852768>',
  EMOJI_DRUNK: isProd ? '<:ts_drunk:979362236613160990>' : '<:ts_drunk:980917123322896395>',
  EMOJI_HIGH: isProd ? '<:ts_high:979362238349578250>' : '<:ts_high:980917339698634853>',
  EMOJI_ROLLING: isProd ? '<:ts_rolling:979362238936797194>' : '<:ts_rolling:980917339837038672>',
  EMOJI_TRIPPING: isProd ? '<:ts_tripping:979362238437670922>' : '<:ts_tripping:980917339778326638>',
  EMOJI_DISSOCIATING: isProd ? '<:ts_dissociating:979362236575387698>' : '<:ts_dissociating:980917339761569812>',
  EMOJI_STIMMING: isProd ? '<:ts_stimming:979362237452025936>' : '<:ts_stimming:980917339895787580>',
  EMOJI_SEDATED: isProd ? '<:ts_nodding:979362238534123520>' : '<:ts_nodding:980917339803512902>',
  EMOJI_SOBER: isProd ? '<:ts_sober:979362237695295508>' : '<:ts_sober:980917339728007188>',
  EMOJI_TALKATIVE: isProd ? '<:ts_talkative:981799227141259304>' : '<:ts_talkative:981910870567309312>',
  EMOJI_WORKING: isProd ? '<:ts_working:979362237691093022>' : '<:ts_working:981925646953504869>',
  EMOJI_VOTEUP: isProd ? '<:ts_voteup:958721361587630210>' : '<:ts_voteup:980917845472985189>',
  EMOJI_VOTEDOWN: isProd ? '<:ts_votedown:960161563849932892>' : '<:ts_votedown:980917845015818251>',
  EMOJI_THUMBUP: isProd ? '<:ts_thumbup:979721167332052992>' : '<:ts_thumbup:980917845640773653>',
  EMOJI_THUMBDOWN: isProd ? '<:ts_thumbdown:979721915390369822>' : '<:ts_thumbdown:980917845527519312>',
  EMOJI_PINKHEART: isProd ? '<:pink_heart:958072815884582922>' : '<:pink_heart:977926946656763904>',
  EMOJI_RESEARCHER: isProd ? '<:ts_researcher:979557718648057916>' : '<:ts_researcher:980934790867984415>',
  EMOJI_CONSULTANT: isProd ? '<:ts_coder:979557703972163644>' : '<:ts_coder:980934790893142106>',
  EMOJI_CLEARMIND: isProd ? '<:ts_clearmind:979557762621136997>' : '<:ts_clearmind:980934790834442240>',
};
