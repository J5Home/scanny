#!/usr/bin/env node

import { program } from '../src/cli/program.js';
import { runScanner } from '../src/cli/runner.js';

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

// Run the program
program.parse(process.argv);
runScanner(program.opts());