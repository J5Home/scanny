from setuptools import setup, find_packages

setup(
    name="bugscanner-py",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        'aiohttp>=3.8.0',
        'rich>=13.0.0',
        'typer>=0.9.0',
        'dnspython>=2.4.0',
        'asyncio>=3.4.3',
        'aiofiles>=23.2.1',
    ],
    entry_points={
        'console_scripts': [
            'bugscanner=bugscanner:app',
        ],
    },
    python_requires='>=3.7',
    author="",
    description="Enhanced Python version of bugscanner for protocol and server scanning",
    long_description=open('README.md').read(),
    long_description_content_type="text/markdown",
    license="MIT",
    keywords="bugscanner protocol-scanner server-scanner network-tools",
)