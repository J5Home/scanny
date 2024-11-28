#!/usr/bin/env node

import { program } from '../src/cli/program.js';
import { runScanner } from '../src/cli/runner.js';
import { displayBanner } from '../src/display/banner.js';

// Display banner
displayBanner();

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.error('\nError:', error.message);
  if (!process.argv.includes('-f') && !process.argv.includes('--file')) {
    console.log('\nUsage example:');
    console.log('  bugscanner -f hosts.txt');
    console.log('\nFor more options:');
    console.log('  bugscanner --help\n');
  }
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('\nError:', error.message);
  process.exit(1);
});

// Run the program
program.parse();
const options = program.opts();

// Validate required file option
if (!options.file) {
  console.log('\nError: Missing required option: -f, --file <path>');
  console.log('\nUsage example:');
  console.log('  bugscanner -f hosts.txt');
  console.log('\nFor more options:');
  console.log('  bugscanner --help\n');
  process.exit(1);
}

// Run scanner with validated options
runScanner(options);