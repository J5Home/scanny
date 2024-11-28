import asyncio
import aiohttp
import dns.resolver
from typing import Dict, Any

async def check_https(host: str, session: aiohttp.ClientSession, timeout: float) -> Dict[str, Any]:
    try:
        async with session.head(f'https://{host}') as response:
            return {
                'status': response.status,
                'supported': True,
                'headers': dict(response.headers)
            }
    except Exception as e:
        return {
            'status': 0,
            'supported': False,
            'error': str(e)
        }

async def check_tcp(host: str, timeout: float) -> Dict[str, Any]:
    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, dns.resolver.resolve, host)
        return {
            'supported': True
        }
    except Exception as e:
        return {
            'supported': False,
            'error': str(e)
        }

async def check_udp(host: str, timeout: float) -> Dict[str, Any]:
    # Implement more sophisticated UDP checking if needed
    return {
        'supported': 'unknown',
        'message': 'UDP check requires additional implementation'
    }