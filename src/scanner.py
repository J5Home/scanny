import asyncio
import aiohttp
import dns.resolver
from typing import List, Dict, Any
from .utils.server_identifier import identify_server
from .utils.protocols import check_https, check_tcp, check_udp

class Scanner:
    def __init__(self, protocols: List[str], timeout: float, max_concurrent: int = 10):
        self.protocols = protocols
        self.timeout = timeout
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.session = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=self.timeout))
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def scan_host(self, host: str) -> Dict[str, Any]:
        try:
            async with self.semaphore:
                result = {
                    'host': host,
                    'protocols': {},
                    'server': await identify_server(host, self.session, self.timeout),
                    'status': 'active'
                }

                tasks = []
                for protocol in self.protocols:
                    if protocol.upper() == 'HTTPS':
                        tasks.append(check_https(host, self.session, self.timeout))
                    elif protocol.upper() == 'TCP':
                        tasks.append(check_tcp(host, self.timeout))
                    elif protocol.upper() == 'UDP':
                        tasks.append(check_udp(host, self.timeout))

                protocol_results = await asyncio.gather(*tasks, return_exceptions=True)
                
                for protocol, proto_result in zip(self.protocols, protocol_results):
                    if isinstance(proto_result, Exception):
                        result['protocols'][protocol] = {
                            'supported': False,
                            'error': str(proto_result)
                        }
                    else:
                        result['protocols'][protocol] = proto_result

                return result
        except Exception as e:
            return {
                'host': host,
                'error': str(e),
                'status': 'error'
            }

    async def scan_hosts(self, hosts: List[str]) -> List[Dict[str, Any]]:
        async with self:
            tasks = [self.scan_host(host) for host in hosts]
            return await asyncio.gather(*tasks)