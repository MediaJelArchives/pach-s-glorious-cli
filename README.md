# Pach's glorious CLI v2

An evolution of the original Pach's handy dandy cli but better.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->

- [Prerequisites](#Prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Prerequisites

It is absolutely IMPORTANT you add your snowflake credentials as an
`environment variable` on your terminal. Do the following command for eaze of use:

```bash
git clone https://github.com/pacholoamit/pach-s-glorious-cli.git

cd pach-s-glorious-cli

nano setup.sh

# Expected output
#!/bin/bash

export SNOWFLAKE_ACCOUNT=<SNOWFLAKE_ACCOUNT_NAME>
export SNOWFLAKE_USERNAME=<SNOWFLAKE_USER_NAME>
export SNOWFLAKE_PASSWORD=<SNOWFLAKE_PASSWORD>
export SNOWFLAKE_REGION=<SNOWFLAKE_REGION>
export SNOWFLAKE_DATABASE=<SNOWFLAKE_DATABASE>
export SNOWFLAKE_WAREHOUSE=<SNOWFLAKE_REPORTING>

# Please for the love of God, add your credentials or
# all of this will be for nothing. After replacing the
# necessary fields with your creds

CTRL + A # In your setup.sh file

CTRL + C # Copy that

Open your terminal

CTRL + V # Pase it

# This will add the environment files permanently on your
# parent terminal's scope. You can use `source` but I do not
# recommend it because it's temporary.
```

# Installation

One of the reasons why I remade the Pach CLI in node-js is for
ease of dependency management. Whereas in bash you'd have to
manually install relevant dependencies which may be more difficult
or easy (especially to archlinux user, I use Arch btw.) Everyone has `npm` or at least everyone `should.` Who knows I might even dockerize this...

Run these commands to install:

```bash


npm install #Sudo if you have to

npm link
```

# Usage

<!-- usage -->

```sh-session

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
