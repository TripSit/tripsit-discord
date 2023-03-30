export default validateEnv;

export const validateEnv = () => {
  const F = f(__filename);
  // log.info(F, `You are in ${process.env.NODE_ENV?.toUpperCase()}`);
  if (!process.env.DISCORD_CLIENT_ID) {
    log.error(F, 'Missing DISCORD_CLIENT_ID: You wont be able to login to discord.');
    return false;
  }

  if (!process.env.DISCORD_GUILD_ID) {
    log.error(F, 'Missing DISCORD_GUILD_ID: You get this from your discord bot.');
    return false;
  }

  if (!process.env.DISCORD_CLIENT_TOKEN) {
    log.error(F, 'Missing DISCORD_CLIENT_TOKEN: You wont be able to login to discord.');
    return false;
  }

  if (!process.env.POSTGRES_DB_URL) {
    log.warn(F, 'Missing POSTGRES_DB_URL: You wont be able to use the database!');
  }
  if (!process.env.KEYCLOAK_BASE_URL || !process.env.KEYCLOAK_REALM_NAME || !process.env.KEYCLOAK_CLIENT_ID || !process.env.KEYCLOAK_CLIENT_SECRET) {
    log.warn(F, 'Missing keycloak credentials: You won\'t be able to interact with KeyCloak.');
  }

  // if (!process.env.DISCORD_CLIENT_SECRET) {
  //   log.warn(F, 'Missing DISCORD_CLIENT_SECRET: I think this is an oauth thing?');
  // }

  if (!process.env.MATRIX_HOMESERVER_URL) {
    log.warn(F, 'Missing MATRIX_HOMESERVER_URL, won\'t be able to connect to matrix homeserver.');
  }

  if (!process.env.MATRIX_ACCESS_TOKEN) {
    log.warn(F, 'Missing MATRIX_ACCESS_TOKEN, you won\'t be able to log into matrix');
  }

  if (!process.env.GITHUB_TOKEN) {
    log.warn(F, 'Missing GITHUB_TOKEN: You wont be able to use /issue');
  }

  if (!process.env.RAPID_TOKEN) {
    log.warn(F, 'Missing RAPID_TOKEN: You wont be able to use /joke');
  }

  if (!process.env.IMGUR_ID || !process.env.IMGUR_SECRET) {
    log.warn(F, 'Missing IMGUR_ID or IMGUR_SECRET: You wont be able to use /imgur');
  }

  if (!process.env.YOUTUBE_TOKEN) {
    log.warn(F, 'Missing YOUTUBE_TOKEN: You wont be able to use /youtube');
  }

  if (!process.env.IMDB_TOKEN) {
    log.warn(F, 'Missing IMDB_TOKEN: You wont be able to use /imdb');
  }

  return true;
};
