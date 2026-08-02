import appConfig from '../../app.json';

export function formatAppVersion(): string {
  return `v${appConfig.expo.version}`;
}
