import chalk from 'chalk';

export function displayResults(results) {
  console.log(chalk.bold('\nScan Results:\n'));

  for (const result of results) {
    console.log(chalk.bold('─'.repeat(50)));
    console.log(chalk.bold(`Host: ${result.host}`));
    
    if (result.status === 'error') {
      console.log(chalk.red(`Error: ${result.error}`));
      continue;
    }

    console.log(chalk.cyan(`Server Type: ${result.server.type}`));
    if (result.server.headers) {
      Object.entries(result.server.headers).forEach(([key, value]) => {
        console.log(chalk.cyan(`${key}: ${value}`));
      });
    }

    console.log(chalk.yellow('\nProtocols:'));
    Object.entries(result.protocols).forEach(([protocol, info]) => {
      const status = info.supported ? 
        chalk.green('✓ Supported') : 
        chalk.red('✗ Not Supported');
      
      console.log(`${protocol}: ${status}`);
      if (info.status) {
        console.log(`  Status: ${info.status}`);
      }
      if (info.error) {
        console.log(chalk.red(`  Error: ${info.error}`));
      }
    });
    
    console.log();
  }
}