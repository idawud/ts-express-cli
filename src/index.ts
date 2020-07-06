#!/usr/bin/env node
import chalk from 'chalk';
import figlet from 'figlet';
import program from 'commander';
import * as prompts from './prompts';

console.log(chalk.green(figlet.textSync('ts-express-cli', { horizontalLayout: 'full' })));

program
  .version('0.0.1')
  .description(
    'A simple cli tool to generate a minimal NodeJs express server with TypeScript'
  )
  .parse(process.argv);

prompts.promptsFn();
