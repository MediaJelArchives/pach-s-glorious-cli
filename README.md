# Pach's glorious CLI v2

An evolution of the original Pach's handy dandy cli but better.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->
* [Pach's glorious CLI v2](#pachs-glorious-cli-v2)
* [Installation](#installation)
* [Additional set up](#additional-set-up)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Installation

One of the reasons why I remade the Pach CLI in node-js is for
ease of dependency management. Whereas in bash you'd have to
manually install relevant dependencies which may be more difficult
or easy (especially to archlinux user, I use Arch btw.) Everyone has `npm` or at least everyone `should.` Who knows I might even dockerize this...

Run these commands to install:

```bash

npm install -g pach-cli ##Sudo if you have to


```

# Additional set up

It is absolutely IMPORTANT you add your snowflake credentials as an
`environment variable` on your terminal. Do the following command for eaze of use:

```bash
## Expected output
#!/bin/bash

export SNOWFLAKE_ACCOUNT=<SNOWFLAKE_ACCOUNT_NAME>
export SNOWFLAKE_USERNAME=<SNOWFLAKE_USER_NAME>
export SNOWFLAKE_PASSWORD=<SNOWFLAKE_PASSWORD>
export SNOWFLAKE_REGION=<SNOWFLAKE_REGION>
export SNOWFLAKE_DATABASE=<SNOWFLAKE_DATABASE>
export SNOWFLAKE_WAREHOUSE=<SNOWFLAKE_REPORTING>


CTRL + A # In your setup.sh file

CTRL + C # Copy that

Open your terminal

CTRL + V # Pase it

## This will add the environment files permanently on your
## parent terminal's scope. You can use `source` but I do not
## recommend it because it's temporary.
```

# Usage

<!-- usage -->
```sh-session
$ npm install -g pach-cli
$ pach COMMAND
running command...
$ pach (-v|--version|version)
pach-cli/1.1.0 linux-x64 node-v16.4.2
$ pach --help [COMMAND]
USAGE
  $ pach COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`pach help [COMMAND]`](#pach-help-command)
* [`pach query TYPE`](#pach-query-type)

## `pach help [COMMAND]`

display help for pach

```
USAGE
  $ pach help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `pach query TYPE`

Query specific app ids from Snowflake database

```
USAGE
  $ pach query TYPE

OPTIONS
  -a, --appId=appId  [default: null] flag to declare the app id to query
  -l, --limit=limit  [default: NULL] flag to declare the limit of entries to be returned (note: 'NULL' === no limits)
```

_See code: [src/commands/query.ts](https://github.com/pacholoamit/pach-cli-v2/blob/v1.1.0/src/commands/query.ts)_
<!-- commandsstop -->
