import { Command } from 'commander';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url))
);

export const program = new Command()
  .name('bugscanner')
  .description('Scan servers for protocols and server information')
  .version(packageJson.version)
  .requiredOption('-f, --file <path>', 'Path to the input file containing hosts (one per line)')
  .option('-p, --protocols <items>', 'Protocols to scan for (comma-separated)', 'HTTPS,TCP,UDP')
  .option('-t, --timeout <ms>', 'Timeout for each request in milliseconds', '5000')
  .option('-o, --output <format>', 'Output format (text/json)', 'text')
  .addHelpText('after', `
Example usage:
  $ bugscanner -f hosts.txt
  $ bugscanner -f hosts.txt -p HTTPS,TCP -t 3000 -o json

Input file format:
  example.com
  cloudflare.com
  google.com`);