from rich.console import Console
from rich.panel import Panel

def display_banner() -> None:
    console = Console()
    banner = """
[cyan]╔══════════════════════════════════════╗
║           [bold]BUGSCANNER PY[/bold]             ║
╚══════════════════════════════════════╝[/cyan]
  [dim]Server and Protocol Scanner
  Enhanced Python version of bugscanner[/dim]
"""
    console.print(banner)