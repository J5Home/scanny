import fetch from 'node-fetch';

const SERVER_SIGNATURES = {
  'cloudflare': ['cloudflare', 'cf-ray'],
  'cloudfront': ['cloudfront'],
  'google': ['gws', 'Google Frontend'],
  'fastly': ['fastly'],
  'akamai': ['akamai'],
  'nginx': ['nginx'],
  'apache': ['apache']
};

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

    // Check server header
    if (server) {
      serverInfo.headers.server = server;
    }

    // Check for specific headers that indicate the server type
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