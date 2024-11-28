import { Command } from 'commander';
import { readFileSync } from 'fs';
import { scanFile } from './scanner.js';
import { displayResults } from './display.js';

const program = new Command();

program
  .name('protocol-scanner')
  .description('Scan text files for protocols and server information')
  .version('1.0.0')
  .requiredOption('-f, --file <path>', 'Path to the input file')
  .option('-p, --protocols <items>', 'Protocols to scan for (comma-separated)', 'HTTPS,TCP,UDP')
  .option('-t, --timeout <ms>', 'Timeout for each request in milliseconds', '5000')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    const content = readFileSync(options.file, 'utf8');
    const protocols = options.protocols.split(',');
    const timeout = parseInt(options.timeout);

    const results = await scanFile(content, protocols, timeout);
    displayResults(results);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();