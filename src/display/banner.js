import chalk from 'chalk';

export function displayBanner() {
  console.log(chalk.cyan(`
╔══════════════════════════════════════╗
║           ${chalk.bold('BUGSCANNER JS')}             ║
╚══════════════════════════════════════╝
  ${chalk.gray('Server and Protocol Scanner')}
  ${chalk.gray('Inspired by aztecrabbit/bugscanner')}
`));
}