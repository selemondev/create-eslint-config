// eslint-disable-next-line node/prefer-global/process
const userAgent = process.env.npm_config_user_agent ?? '';
const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm';
export default packageManager;
