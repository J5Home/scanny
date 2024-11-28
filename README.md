# BugScanner PY

An enhanced Python implementation of the bugscanner tool for scanning servers and protocols. This version includes improved accuracy, async operations, and better error handling.

## Features

- Asynchronous scanning for better performance
- Enhanced protocol detection (HTTPS, TCP, UDP)
- Improved server identification
- Detailed header analysis
- JSON output support
- Rich terminal interface
- Progress tracking
- Concurrent scanning support
- Termux compatible

## Installation

### Termux Installation

1. Install required packages:
```bash
pkg update && pkg upgrade
pkg install python git
```

2. Clone the repository:
```bash
git clone https://github.com/J5Home/bugscanner-py.git
```

3. Install the package:
```bash
cd bugscanner-py
pip install -e .
```

### Global Installation (pip)

```bash
pip install bugscanner-py
```

## Usage

Basic usage:
```bash
bugscanner -f hosts.txt
```

Advanced usage:
```bash
bugscanner -f hosts.txt -p HTTPS,TCP -t 5000 -o json -c 20
```

### Options

- `-f, --file`: Input file containing hosts (required)
- `-p, --protocols`: Protocols to scan (default: "HTTPS,TCP,UDP")
- `-t, --timeout`: Timeout in milliseconds (default: 5000)
- `-o, --output`: Output format: text/json (default: "text")
- `-c, --concurrent`: Number of concurrent scans (default: 10)

### Input File Format

Create a text file with one host per line:
```
example.com
cloudflare.com
google.com
```

## Improvements over Original

1. Asynchronous Operations
   - Concurrent scanning using asyncio
   - Configurable concurrency levels
   - Better timeout handling

2. Enhanced Server Detection
   - More detailed server signature database
   - Header analysis for better accuracy
   - Multiple identifier support

3. Better Protocol Scanning
   - Improved HTTPS checking
   - More reliable TCP detection
   - Extensible UDP framework

4. Rich Output
   - Colored terminal output
   - Progress tracking
   - Detailed error reporting
   - JSON export option

## License

MIT License

## Credits

Enhanced Python version inspired by [aztecrabbit's bugscanner](https://github.com/aztecrabbit/bugscanner)
