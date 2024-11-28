import { checkProtocol } from './protocol-checker.js';
import { identifyServer } from './server-identifier.js';

export async function scanFile(content, protocols, timeout) {
  const hosts = content.split('\n').filter(line => line.trim());
  const results = [];

  for (const host of hosts) {
    try {
      const result = {
        host,
        protocols: {},
        server: await identifyServer(host),
        status: 'active'
      };

      for (const protocol of protocols) {
        result.protocols[protocol] = await checkProtocol(host, protocol, timeout);
      }

      results.push(result);
    } catch (error) {
      results.push({
        host,
        error: error.message,
        status: 'error'
      });
    }
  }

  return results;
}