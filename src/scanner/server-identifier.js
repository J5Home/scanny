import fetch from 'node-fetch';
import { SERVER_SIGNATURES } from '../config/signatures.js';

export async function identifyServer(host) {
  try {
    const response = await fetch(`https://${host}`, {
      method: 'HEAD'
    });

    const headers = response.headers;
    const server = headers.get('server');
    const serverInfo = {
      type: 'unknown',
      headers: {}
    };

    if (server) {
      serverInfo.headers.server = server;
    }

    for (const [provider, signatures] of Object.entries(SERVER_SIGNATURES)) {
      for (const signature of signatures) {
        if (
          server?.toLowerCase().includes(signature.toLowerCase()) ||
          Array.from(headers.entries()).some(([key, value]) => 
            value.toLowerCase().includes(signature.toLowerCase())
          )
        ) {
          serverInfo.type = provider;
          break;
        }
      }
    }

    return serverInfo;
  } catch (error) {
    return {
      type: 'unknown',
      error: error.message
    };
  }
}