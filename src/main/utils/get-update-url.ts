import { app } from 'electron'

export function getUpdateUrl(): string {
  return `https://update.electronjs.org/riotrah/browseratops/darwin-${
    process.arch
  }/${app.getVersion()}`
}
