import { readFileSync } from 'fs';
import { scanFile } from '../scanner/scanner.js';
import { displayResults } from '../display/display.js';
import { outputJson } from '../display/json-output.js';

export async function runScanner(options) {
  try {
    // Validate file exists
    let content;
    try {
      content = readFileSync(options.file, 'utf8');
    } catch (error) {
      throw new Error(`Could not read file: ${options.file}\nPlease ensure the file exists and is readable.`);
    }

    // Validate file has content
    const hosts = content.split('\n').filter(line => line.trim());
    if (hosts.length === 0) {
      throw new Error(`File ${options.file} is empty.\nPlease add at least one host to scan.`);
    }

    // Validate protocols
    const protocols = options.protocols.split(',').map(p => p.trim().toUpperCase());
    const validProtocols = ['HTTPS', 'TCP', 'UDP'];
    const invalidProtocols = protocols.filter(p => !validProtocols.includes(p));
    if (invalidProtocols.length > 0) {
      throw new Error(`Invalid protocols: ${invalidProtocols.join(', ')}\nValid protocols are: ${validProtocols.join(', ')}`);
    }

    // Validate timeout
    const timeout = parseInt(options.timeout);
    if (isNaN(timeout) || timeout < 100) {
      throw new Error('Timeout must be a number greater than or equal to 100ms');
    }

    // Run scan
    const results = await scanFile(content, protocols, timeout);
    
    // Output results
    if (options.output.toLowerCase() === 'json') {
      outputJson(results);
    } else {
      displayResults(results);
    }
  } catch (error) {
    console.error('\nError:', error.message);
    process.exit(1);
  }
}