import { Hook } from '@oclif/config'
import * as fs from 'fs-extra'
import { Configure } from '../commands/configure'

/**
 * Hook lifecycle event before CLI is instantiated.
 * It is absolutely necessary that the `configPath`
 * within this hook is the same as the `configPath`
 * located at the `Configure` command.
 *
 * @see Configure
 *
 * @type {Hook}
 * @param options Not being used
 *
 */

export const hook: Hook<'init'> = async function (options) {
  /**
   *
   * Name of the config file to be used to store
   * User defined credentials and/or configurations
   *
   * @type {string}
   */

  const configFileName: string = '/config.json'
  /**
   *
   * Full path of the config directory appended
   * by the config file name
   *
   * @type {string}
   */
  const configPath: string = this.config.configDir + configFileName

  /**
   * If no config file is located, automatically execute
   * the `Configure` command.
   *
   * @see Configure
   *
   */

  const configExists: boolean = fs.pathExistsSync(configPath)
  if (!configExists) await Configure.run()
}

export default hook
