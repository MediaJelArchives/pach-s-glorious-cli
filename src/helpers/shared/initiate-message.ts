import { cli } from 'cli-ux'

export default function initiateMessage(message: string): void {
  cli.action.start(message, '', { stdout: true })
}
