# Pach's glorious CLI v2

An evolution of the original Pach's handy dandy cli but better.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/pach-cli-v2.svg)](https://npmjs.org/package/pach-cli-v2)
[![Downloads/week](https://img.shields.io/npm/dw/pach-cli-v2.svg)](https://npmjs.org/package/pach-cli-v2)
[![License](https://img.shields.io/npm/l/pach-cli-v2.svg)](https://github.com/pacholoamit/pach-cli-v2/blob/master/package.json)

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Installation

One of the reasons why I remade the Pach CLI in node-js is for
ease of dependency management. Whereas in bash you'd have to
manually install relevant dependencies which may be more difficult
or easy (especially to archlinux user, I use Arch btw.) Everyone has `npm` or at least everyone `should.` Who knows I might even dockerize this...

Run these commands to install:

```bash
git clone
```

# Usage

<!-- usage -->

```sh-session

$ npm install -g pach-cli-v2
$ pach COMMAND

running command...

$ pach (-v|--version|version)
pach-cli-v2/1.0.0 linux-x64 node-v16.4.2

$ pach --help [COMMAND]

USAGE
  $ pach COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`pach help [COMMAND]`](#pach-help-command)
- [`pach query [APP_ID]`](#pach-query-file)

## `pach help [COMMAND]`

display help for pach commands

```
USAGE
  $ pach help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
  query  see all flags & args for the query command
```

## `pach query [APP_ID]`

describe the command here

```
USAGE
  $ pach query [APP_ID]

OPTIONS
  -h, --help                show CLI help
  -p, --pageviews=APP_ID    query all pageview data based on app ID sorted by date from snowflake
  -t, --transactions=APP_ID  query all transaction data based on app ID sorted by date from snowflake
```

_See code: [src/commands/query.ts](https://github.com/pacholoamit/pach-cli-v2/blob/v1.0.0/src/commands/query.ts)_

<!-- commandsstop -->
