#!/usr/bin/env python3
"""
Network Scanner Module
WHOAMISec Offensive Security Toolkit
"""

import sys
import argparse
import socket
import threading
import json
import time
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

def is_port_open(host, port, timeout=3):
    """Check if a port is open on the target host"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(timeout)
            result = sock.connect_ex((host, port))
            if result == 0:
                try:
                    # Try to get service banner
                    sock.send(b'HEAD / HTTP/1.0\r\n\r\n')
                    banner = sock.recv(1024).decode('utf-8', errors='ignore').strip()
                    return True, banner
                except:
                    return True, ""
            return False, ""
    except socket.gaierror:
        return False, "Host not found"
    except socket.error:
        return False, "Connection error"
    except Exception:
        return False, "Unknown error"

def get_service_name(port):
    """Get common service name for port"""
    common_ports = {
        21: "FTP",
        22: "SSH",
        23: "Telnet",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        111: "RPC",
        135: "MSRPC",
        139: "NetBIOS",
        143: "IMAP",
        443: "HTTPS",
        445: "SMB",
        993: "IMAPS",
        995: "POP3S",
        1433: "MSSQL",
        1521: "Oracle",
        3306: "MySQL",
        3389: "RDP",
        5432: "PostgreSQL",
        5900: "VNC",
        5984: "CouchDB",
        6379: "Redis",
        8080: "HTTP-Proxy",
        8443: "HTTPS-Alt",
        9200: "Elasticsearch",
        27017: "MongoDB"
    }
    return common_ports.get(port, "Unknown")

def detect_service_version(banner):
    """Try to detect service version from banner"""
    if not banner:
        return "Unknown"
    
    # Common patterns
    if "SSH" in banner.upper():
        return "SSH"
    elif "HTTP" in banner.upper():
        if "nginx" in banner.lower():
            return "nginx"
        elif "apache" in banner.lower():
            return "Apache"
        elif "iis" in banner.lower():
            return "IIS"
        else:
            return "HTTP"
    elif "FTP" in banner.upper():
        return "FTP"
    elif "MySQL" in banner.upper():
        return "MySQL"
    elif "PostgreSQL" in banner.upper():
        return "PostgreSQL"
    
    return "Unknown"

def scan_port_range(host, start_port, end_port, max_threads=50):
    """Scan a range of ports"""
    results = []
    
    def scan_port(port):
        is_open, banner = is_port_open(host, port)
        if is_open:
            service = get_service_name(port)
            version = detect_service_version(banner)
            return {
                "port": port,
                "state": "open",
                "service": service,
                "version": version,
                "banner": banner[:100] if banner else ""
            }
        return None
    
    with ThreadPoolExecutor(max_workers=max_threads) as executor:
        # Submit all port scanning tasks
        futures = {executor.submit(scan_port, port): port for port in range(start_port, end_port + 1)}
        
        # Collect results as they complete
        for future in as_completed(futures):
            result = future.result()
            if result:
                results.append(result)
    
    return sorted(results, key=lambda x: x["port"])

def parse_port_range(port_range):
    """Parse port range string"""
    ports = []
    parts = port_range.split(',')
    
    for part in parts:
        part = part.strip()
        if '-' in part:
            # Range like 1-1000
            start, end = part.split('-')
            ports.extend(range(int(start), int(end) + 1))
        else:
            # Single port
            ports.append(int(part))
    
    return sorted(set(ports))

def resolve_host(host):
    """Resolve hostname to IP address"""
    try:
        ip = socket.gethostbyname(host)
        return ip, True
    except socket.gaierror:
        return host, False

def main():
    parser = argparse.ArgumentParser(description='Network Port Scanner')
    parser.add_argument('--target', required=True, help='Target host/IP to scan')
    parser.add_argument('--ports', default='1-1000', help='Port range to scan (e.g., 1-1000,80,443)')
    parser.add_argument('--threads', type=int, default=50, help='Number of threads to use')
    parser.add_argument('--timeout', type=int, default=3, help='Connection timeout in seconds')
    parser.add_argument('--output', choices=['json', 'text'], default='json', help='Output format')
    
    args = parser.parse_args()
    
    print(f"[*] Starting network scan on {args.target}")
    start_time = time.time()
    
    # Resolve hostname
    resolved_ip, resolved = resolve_host(args.target)
    if not resolved and args.target != resolved_ip:
        print(f"[!] Failed to resolve hostname: {args.target}")
        sys.exit(1)
    
    print(f"[*] Target resolved to: {resolved_ip}")
    
    # Parse port range
    try:
        ports_to_scan = parse_port_range(args.ports)
        print(f"[*] Scanning {len(ports_to_scan)} ports")
    except ValueError as e:
        print(f"[!] Invalid port range: {e}")
        sys.exit(1)
    
    # Scan ports
    results = []
    
    def scan_single_port(port):
        is_open, banner = is_port_open(resolved_ip, port, args.timeout)
        if is_open:
            service = get_service_name(port)
            version = detect_service_version(banner)
            return {
                "port": port,
                "state": "open",
                "service": service,
                "version": version,
                "banner": banner[:100] if banner else ""
            }
        return None
    
    # Use ThreadPoolExecutor for scanning
    with ThreadPoolExecutor(max_workers=args.threads) as executor:
        # Submit all port scanning tasks
        futures = {executor.submit(scan_single_port, port): port for port in ports_to_scan}
        
        # Collect results as they complete
        for future in as_completed(futures):
            result = future.result()
            if result:
                results.append(result)
                print(f"[+] Port {result['port']}/tcp - {result['state']} - {result['service']} {result['version']}")
    
    # Sort results by port number
    results.sort(key=lambda x: x["port"])
    
    scan_time = time.time() - start_time
    
    # Output results
    if args.output == 'json':
        print(json.dumps({
            "tool": "network-scanner",
            "timestamp": datetime.now().isoformat(),
            "target": args.target,
            "resolved_ip": resolved_ip,
            "scan_time": round(scan_time, 2),
            "ports_scanned": len(ports_to_scan),
            "open_ports": len(results),
            "results": results
        }, indent=2))
    else:
        print("\n" + "=" * 60)
        print("NETWORK SCAN RESULTS")
        print("=" * 60)
        print(f"Target: {args.target} ({resolved_ip})")
        print(f"Scan Time: {round(scan_time, 2)}s")
        print(f"Ports Scanned: {len(ports_to_scan)}")
        print(f"Open Ports: {len(results)}")
        print("-" * 60)
        
        if results:
            print(f"{'PORT':<8} {'STATE':<8} {'SERVICE':<12} {'VERSION'}")
            print("-" * 60)
            for result in results:
                print(f"{result['port']:<8} {result['state']:<8} {result['service']:<12} {result['version']}")
        else:
            print("No open ports found.")

if __name__ == '__main__':
    main()