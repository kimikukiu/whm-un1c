#!/usr/bin/env python3
"""
JScan - Advanced Web Scanner v3.1
WHOAMISec Offensive Toolkit
WordPress vulnerability scanner and user enumeration
"""

import sys
import argparse
import requests
import json
from datetime import datetime
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

# Disable SSL warnings
import urllib3
urllib3.disable_warnings(urllib3.disable_warnings)

class JScanner:
    def __init__(self, target_url):
        self.target_url = target_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.vulnerabilities = []
        self.users = []
        self.plugins = []
        self.themes = []
        
    def check_wordpress(self):
        """Check if target is running WordPress"""
        wp_indicators = [
            '/wp-login.php',
            '/wp-admin/',
            '/wp-content/',
            '/wp-includes/',
            '/xmlrpc.php'
        ]
        
        for indicator in wp_indicators:
            try:
                response = self.session.get(self.target_url + indicator, timeout=10, verify=False)
                if response.status_code == 200:
                    return True
            except:
                continue
        
        # Check homepage for WordPress indicators
        try:
            response = self.session.get(self.target_url, timeout=10, verify=False)
            if 'wp-content' in response.text or 'wp-includes' in response.text:
                return True
        except:
            pass
            
        return False
    
    def enumerate_users(self):
        """Enumerate WordPress users"""
        users = []
        
        # Method 1: Author enumeration
        for i in range(1, 50):  # Check first 50 users
            try:
                response = self.session.get(f"{self.target_url}/?author={i}", timeout=5, verify=False)
                if response.status_code == 200:
                    # Extract username from redirect or content
                    if '/author/' in response.url:
                        username = response.url.split('/author/')[1].rstrip('/')
                        users.append(username)
                    else:
                        # Try to extract from content
                        soup = BeautifulSoup(response.text, 'html.parser')
                        author_links = soup.find_all('a', href=True)
                        for link in author_links:
                            if '/author/' in link['href']:
                                username = link['href'].split('/author/')[1].rstrip('/')
                                if username and username not in users:
                                    users.append(username)
            except:
                continue
        
        # Method 2: REST API
        try:
            response = self.session.get(f"{self.target_url}/wp-json/wp/v2/users", timeout=5, verify=False)
            if response.status_code == 200:
                data = response.json()
                for user in data:
                    if 'slug' in user and user['slug'] not in users:
                        users.append(user['slug'])
        except:
            pass
        
        # Method 3: RSS feed
        try:
            response = self.session.get(f"{self.target_url}/feed/", timeout=5, verify=False)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'xml')
                creators = soup.find_all('dc:creator')
                for creator in creators:
                    username = creator.text.strip()
                    if username and username not in users:
                        users.append(username)
        except:
            pass
        
        self.users = list(set(users))
        return self.users
    
    def detect_plugins(self):
        """Detect WordPress plugins"""
        plugins = []
        
        # Check homepage source
        try:
            response = self.session.get(self.target_url, timeout=10, verify=False)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find plugin references in source
            plugin_pattern = r'/wp-content/plugins/([^/]+)/'
            plugin_matches = re.findall(plugin_pattern, response.text)
            plugins.extend(plugin_matches)
            
            # Check for specific plugin files
            common_plugins = [
                'jetpack', 'wordfence', 'woocommerce', 'elementor', 'yoast-seo',
                'wp-super-cache', 'w3-total-cache', 'akismet', 'updraftplus',
                'contact-form-7', 'all-in-one-seo-pack', 'google-analytics-for-wordpress'
            ]
            
            for plugin in common_plugins:
                try:
                    plugin_url = f"{self.target_url}/wp-content/plugins/{plugin}/"
                    response = self.session.get(plugin_url, timeout=5, verify=False)
                    if response.status_code == 200 or response.status_code == 403:
                        plugins.append(plugin)
                except:
                    continue
                    
        except:
            pass
        
        self.plugins = list(set(plugins))
        return self.plugins
    
    def detect_themes(self):
        """Detect WordPress themes"""
        themes = []
        
        try:
            response = self.session.get(self.target_url, timeout=10, verify=False)
            
            # Find theme references
            theme_pattern = r'/wp-content/themes/([^/]+)/'
            theme_matches = re.findall(theme_pattern, response.text)
            themes.extend(theme_matches)
            
            # Check common themes
            common_themes = [
                'twentytwentyone', 'twentytwenty', 'twentynineteen', 'twentyseventeen',
                'avada', 'divi', 'astra', 'oceanwp', 'generatepress', 'hello-elementor'
            ]
            
            for theme in common_themes:
                try:
                    theme_url = f"{self.target_url}/wp-content/themes/{theme}/"
                    response = self.session.get(theme_url, timeout=5, verify=False)
                    if response.status_code == 200 or response.status_code == 403:
                        themes.append(theme)
                except:
                    continue
                    
        except:
            pass
        
        self.themes = list(set(themes))
        return self.themes
    
    def check_vulnerabilities(self):
        """Check for common WordPress vulnerabilities"""
        vulns = []
        
        # Check for XML-RPC enabled
        try:
            response = self.session.get(f"{self.target_url}/xmlrpc.php", timeout=5, verify=False)
            if response.status_code == 200 and 'XML-RPC' in response.text:
                vulns.append({
                    'type': 'xmlrpc_enabled',
                    'severity': 'medium',
                    'description': 'XML-RPC is enabled - can be used for brute force attacks'
                })
        except:
            pass
        
        # Check for wp-json exposure
        try:
            response = self.session.get(f"{self.target_url}/wp-json/", timeout=5, verify=False)
            if response.status_code == 200:
                vulns.append({
                    'type': 'rest_api_exposed',
                    'severity': 'low',
                    'description': 'REST API is publicly accessible'
                })
        except:
            pass
        
        # Check for directory listing
        directories = ['/wp-content/uploads/', '/wp-content/plugins/', '/wp-content/themes/']
        for directory in directories:
            try:
                response = self.session.get(f"{self.target_url}{directory}", timeout=5, verify=False)
                if response.status_code == 200 and 'Index of' in response.text:
                    vulns.append({
                        'type': 'directory_listing',
                        'severity': 'low',
                        'description': f'Directory listing enabled on {directory}'
                    })
            except:
                continue
        
        # Check for debug files
        debug_files = ['/wp-config.php~', '/wp-config.php.save', '/.wp-config.php.swp']
        for file in debug_files:
            try:
                response = self.session.get(f"{self.target_url}{file}", timeout=5, verify=False)
                if response.status_code == 200:
                    vulns.append({
                        'type': 'debug_file_exposed',
                        'severity': 'high',
                        'description': f'Debug/config file exposed: {file}'
                    })
            except:
                continue
        
        self.vulnerabilities = vulns
        return vulns
    
    def run_full_scan(self):
        """Run complete WordPress scan"""
        results = {
            'target': self.target_url,
            'timestamp': datetime.now().isoformat(),
            'is_wordpress': self.check_wordpress(),
            'users': self.enumerate_users(),
            'plugins': self.detect_plugins(),
            'themes': self.detect_themes(),
            'vulnerabilities': self.check_vulnerabilities()
        }
        
        return results

def main():
    parser = argparse.ArgumentParser(description='JScan - Advanced WordPress Scanner v3.1')
    parser.add_argument('--target', required=True, help='Target WordPress URL')
    parser.add_argument('--output', choices=['json', 'text'], default='json', help='Output format')
    
    args = parser.parse_args()
    
    print(f"[*] JScan v3.1 - WordPress Security Scanner")
    print(f"[*] Target: {args.target}")
    
    scanner = JScanner(args.target)
    results = scanner.run_full_scan()
    
    if args.output == 'json':
        print(json.dumps({
            "tool": "jscan-wordpress-scanner",
            "timestamp": datetime.now().isoformat(),
            "scan_results": results
        }, indent=2))
    else:
        print("\n" + "="*60)
        print("WORDPRESS SCAN RESULTS")
        print("="*60)
        print(f"Target: {results['target']}")
        print(f"Is WordPress: {'YES' if results['is_wordpress'] else 'NO'}")
        print(f"Users Found: {len(results['users'])}")
        print(f"Plugins Found: {len(results['plugins'])}")
        print(f"Themes Found: {len(results['themes'])}")
        print(f"Vulnerabilities: {len(results['vulnerabilities'])}")
        
        if results['users']:
            print("\nUsers:")
            for user in results['users']:
                print(f"  - {user}")
        
        if results['vulnerabilities']:
            print("\nVulnerabilities:")
            for vuln in results['vulnerabilities']:
                print(f"  - {vuln['type']} ({vuln['severity']}): {vuln['description']}")

if __name__ == '__main__':
    main()