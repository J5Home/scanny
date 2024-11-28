import dns from 'dns';
import { promisify } from 'util';
import fetch from 'node-fetch';

const dnsResolve = promisify(dns.resolve);

export async function checkProtocol(host, protocol, timeout) {
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
  return {
    supported: 'unknown',
    message: 'UDP check not implemented'
  };
}