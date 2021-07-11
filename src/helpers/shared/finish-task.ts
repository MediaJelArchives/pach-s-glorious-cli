import cli from 'cli-ux'
import * as notifier from 'node-notifier'

export default function finishTask(message: string, timeout = 2000) {
  setTimeout(() => {
    cli.action.stop(message)
    notifier.notify({
      title: 'Task completed!',
      message: message,
      sound: true,
      wait: true,
    })
  }, timeout)
}
