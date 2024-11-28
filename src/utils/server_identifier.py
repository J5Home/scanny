import aiohttp
from typing import Dict, Any

SERVER_SIGNATURES = {
    'cloudflare': ['cloudflare', 'cf-ray'],
    'cloudfront': ['cloudfront', 'amazon'],
    'google': ['gws', 'Google Frontend', 'Google Cloud', 'GFE'],
    'fastly': ['fastly'],
    'akamai': ['akamai', 'akamaighost'],
    'nginx': ['nginx'],
    'apache': ['apache'],
    'microsoft': ['microsoft-iis', 'azure'],
    'amazon': ['amazon', 'aws', 'ec2'],
    'cdn': ['cdn', 'cdnjs', 'jsdelivr']
}

async def identify_server(host: str, session: aiohttp.ClientSession, timeout: float) -> Dict[str, Any]:
    try:
        async with session.head(f'https://{host}') as response:
            headers = dict(response.headers)
            server_info = {
                'type': 'unknown',
                'headers': {}
            }

            # Store relevant headers
            for header in ['server', 'x-powered-by', 'x-server', 'via']:
                if header in headers:
                    server_info['headers'][header] = headers[header]

            # Check all headers for server signatures
            headers_str = ' '.join(str(v).lower() for v in headers.values())
            
            for provider, signatures in SERVER_SIGNATURES.items():
                if any(sig.lower() in headers_str for sig in signatures):
                    server_info['type'] = provider
                    break

            return server_info
    except Exception as e:
        return {
            'type': 'unknown',
            'error': str(e)
        }