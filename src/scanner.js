import dns from 'dns';
import { promisify } from 'util';
import fetch from 'node-fetch';
import { identifyServer } from './serverIdentifier.js';

const dnsResolve = promisify(dns.resolve);

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

async function checkProtocol(host, protocol, timeout) {
  switch (protocol.toUpperCase()) {
    case 'HTTPS':
      return await checkHttps(host, timeout);
    case 'TCP':
      return await checkTcp(host, timeout);
    case 'UDP':
      return await checkUdp(host, timeout);
    default:
      throw new Error(`Unsupported protocol: ${protocol}`);
  }
}

async function checkHttps(host, timeout) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`https://${host}`, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return {
      status: response.status,
      supported: true
    };
  } catch (error) {
    return {
      status: 0,
      supported: false,
      error: error.message
    };
  }
}

async function checkTcp(host, timeout) {
  try {
    await dnsResolve(host);
    return {
      supported: true
    };
  } catch (error) {
    return {
      supported: false,
      error: error.message
    };
  }
}

async function checkUdp(host, timeout) {
  // UDP check implementation would go here
  // This is a simplified version
  return {
    supported: 'unknown',
    message: 'UDP check not implemented'
  };
}