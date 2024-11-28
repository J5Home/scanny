#!/usr/bin/env python3

import typer
import asyncio
from rich.console import Console
from rich.progress import Progress
from pathlib import Path
from typing import List, Optional
from src.scanner import Scanner
from src.display import Display
from src.utils.banner import display_banner

app = typer.Typer()
console = Console()

@app.command()
def scan(
    file: Path = typer.Option(..., '--file', '-f', help='Path to the input file'),
    protocols: str = typer.Option('HTTPS,TCP,UDP', '--protocols', '-p', help='Protocols to scan'),
    timeout: int = typer.Option(5000, '--timeout', '-t', help='Timeout in milliseconds'),
    output: str = typer.Option('text', '--output', '-o', help='Output format (text/json)'),
    concurrent: int = typer.Option(10, '--concurrent', '-c', help='Number of concurrent scans')
):
    """Scan hosts for protocols and server information"""
    try:
        if not file.exists():
            console.print(f"[red]Error: File {file} not found[/red]")
            raise typer.Exit(1)

        display_banner()
        
        # Read hosts from file
        hosts = file.read_text().splitlines()
        hosts = [host.strip() for host in hosts if host.strip()]
        
        if not hosts:
            console.print("[yellow]Warning: No hosts found in file[/yellow]")
            raise typer.Exit(1)

        # Initialize scanner and display
        scanner = Scanner(
            protocols=protocols.split(','),
            timeout=timeout/1000,  # Convert to seconds
            max_concurrent=concurrent
        )
        display = Display(output_format=output)

        # Run the scan
        results = asyncio.run(scanner.scan_hosts(hosts))
        display.show_results(results)

    except Exception as e:
        console.print(f"[red]Error: {str(e)}[/red]")
        raise typer.Exit(1)

if __name__ == "__main__":
    app()