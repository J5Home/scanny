from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from typing import List, Dict, Any
import json

class Display:
    def __init__(self, output_format: str = 'text'):
        self.console = Console()
        self.output_format = output_format.lower()

    def show_results(self, results: List[Dict[str, Any]]) -> None:
        if self.output_format == 'json':
            self._show_json(results)
        else:
            self._show_text(results)

    def _show_json(self, results: List[Dict[str, Any]]) -> None:
        print(json.dumps(results, indent=2))

    def _show_text(self, results: List[Dict[str, Any]]) -> None:
        for result in results:
            self._show_host_result(result)

    def _show_host_result(self, result: Dict[str, Any]) -> None:
        self.console.print(Panel.fit(
            f"[bold cyan]Host:[/bold cyan] {result['host']}",
            border_style="cyan"
        ))

        if result.get('status') == 'error':
            self.console.print(f"[red]Error: {result['error']}[/red]")
            return

        # Server Information
        server_info = result.get('server', {})
        self.console.print("\n[bold yellow]Server Information:[/bold yellow]")
        self.console.print(f"Type: {server_info.get('type', 'unknown')}")
        
        if 'headers' in server_info:
            for header, value in server_info['headers'].items():
                self.console.print(f"{header}: {value}")

        # Protocol Results
        self.console.print("\n[bold yellow]Protocols:[/bold yellow]")
        table = Table(show_header=True, header_style="bold magenta")
        table.add_column("Protocol")
        table.add_column("Status")
        table.add_column("Details")

        for protocol, info in result.get('protocols', {}).items():
            status = "[green]✓[/green]" if info.get('supported') else "[red]✗[/red]"
            details = []
            
            if 'status' in info:
                details.append(f"Status: {info['status']}")
            if 'error' in info:
                details.append(f"[red]Error: {info['error']}[/red]")
            if 'message' in info:
                details.append(info['message'])

            table.add_row(
                protocol,
                status,
                "\n".join(details) if details else ""
            )

        self.console.print(table)
        self.console.print("\n" + "─" * 50 + "\n")