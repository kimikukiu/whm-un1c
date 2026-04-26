#!/usr/bin/env python
"""
Email Extractor Pro - Advanced Email Extraction Tool
WHOAMISec Offensive Security Toolkit
"""

import sys
import argparse
import re
import requests
import json
import time
from urllib.parse import urljoin, urlparse
from concurrent.futures import ThreadPoolExecutor
import urllib3

urllib3.disable_warnings()

class EmailExtractorPro:
    def __init__(self):
        self.emails = set()
        self.visited_urls = set()
        self.email_pattern = re.compile(
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        )
        
        # Common email domains to filter
        self.common_domains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
            'icloud.com', 'mail.com', 'yandex.com', 'protonmail.com',
            'zoho.com', 'fastmail.com', 'tutanota.com'
        ]
    
    def extract_from_text(self, text):
        """Extract emails from text content"""
        emails = self.email_pattern.findall(text)
        return [email.lower() for email in emails]
    
    def extract_from_url(self, url, depth=0, max_depth=3):
        """Extract emails from a URL"""
        if depth > max_depth or url in self.visited_urls:
            return []
        
        self.visited_urls.add(url)
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10, verify=False)
            response.raise_for_status()
            
            # Extract emails from content
            emails = self.extract_from_text(response.text)
            
            # Look for mailto links
            mailto_pattern = re.compile(r'mailto:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})')
            mailto_emails = mailto_pattern.findall(response.text)
            emails.extend(mailto_emails)
            
            # Find more URLs to crawl
            if depth < max_depth:
                url_pattern = re.compile(r'href=["\'](https?://[^"\']+)["\']')
                found_urls = url_pattern.findall(response.text)
                
                for found_url in found_urls:
                    if self.is_same_domain(url, found_url):
                        self.extract_from_url(found_url, depth + 1, max_depth)
            
            return emails
            
        except Exception as e:
            print(f"[!] Error extracting from {url}: {e}")
            return []
    
    def extract_from_file(self, file_path):
        """Extract emails from a file"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            return self.extract_from_text(content)
        except Exception as e:
            print(f"[!] Error reading file {file_path}: {e}")
            return []
    
    def is_same_domain(self, url1, url2):
        """Check if two URLs are from the same domain"""
        try:
            domain1 = urlparse(url1).netloc
            domain2 = urlparse(url2).netloc
            return domain1 == domain2
        except:
            return False
    
    def filter_emails(self, emails):
        """Filter and validate emails"""
        filtered = []
        
        for email in emails:
            # Basic validation
            if '@' not in email or '.' not in email:
                continue
            
            # Check for common invalid patterns
            if any(invalid in email for invalid in ['..', '@.', '.@', 'mailto']):
                continue
            
            # Extract domain
            try:
                domain = email.split('@')[1].lower()
                
                # Skip common noreply/invalid emails
                if any(invalid in email for invalid in [
                    'noreply', 'no-reply', 'donotreply', 'admin', 'webmaster',
                    'postmaster', 'root', 'info', 'support', 'abuse'
                ]):
                    continue
                
                filtered.append(email.lower())
                
            except:
                continue
        
        return filtered
    
    def extract_emails(self, target, target_type='url', max_depth=3):
        """Main extraction function"""
        print(f"[+] Starting email extraction from {target_type}: {target}")
        
        if target_type == 'url':
            emails = self.extract_from_url(target, 0, max_depth)
        elif target_type == 'file':
            emails = self.extract_from_file(target)
        elif target_type == 'text':
            emails = self.extract_from_text(target)
        else:
            raise ValueError("Invalid target type. Use 'url', 'file', or 'text'")
        
        # Filter emails
        filtered_emails = self.filter_emails(emails)
        self.emails.update(filtered_emails)
        
        # Additional processing for URLs
        if target_type == 'url':
            # Try common pages
            common_pages = [
                '/contact', '/contact-us', '/about', '/team', '/staff',
                '/directory', '/people', '/members', '/users', '/profiles'
            ]
            
            base_url = target.rstrip('/')
            
            def crawl_page(page):
                try:
                    page_url = urljoin(base_url, page)
                    return self.extract_from_url(page_url, 0, 1)
                except:
                    return []
            
            with ThreadPoolExecutor(max_workers=5) as executor:
                results = executor.map(crawl_page, common_pages)
                for result in results:
                    if result:
                        filtered = self.filter_emails(result)
                        self.emails.update(filtered)
        
        return list(self.emails)
    
    def get_statistics(self):
        """Get extraction statistics"""
        domains = {}
        for email in self.emails:
            domain = email.split('@')[1]
            domains[domain] = domains.get(domain, 0) + 1
        
        return {
            'total_emails': len(self.emails),
            'unique_domains': len(domains),
            'top_domains': sorted(domains.items(), key=lambda x: x[1], reverse=True)[:10],
            'common_domains': sum(1 for domain in domains if domain in self.common_domains)
        }

def main():
    parser = argparse.ArgumentParser(description='Email Extractor Pro - Advanced Email Extraction Tool')
    parser.add_argument('--target', required=True, help='Target URL, file path, or text content')
    parser.add_argument('--type', required=True, choices=['url', 'file', 'text'], help='Type of target')
    parser.add_argument('--depth', type=int, default=3, help='Crawl depth for URL extraction')
    parser.add_argument('--output', choices=['json', 'text'], default='json', help='Output format')
    
    args = parser.parse_args()
    
    print("""
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║  ✋✋✋ EMAIL EXTRACTOR PRO - ADVANCED EMAIL HARVESTING ✋✋✋                             ║
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
║        {Fore.YELLOW}EMAIL EXTRACTOR PRO - ADVANCED EMAIL HARVESTING{Fore.RED}                 ║
║   {Fore.GREEN}Multi-Source Extraction | Domain Filtering | Bulk Processing{Fore.RED}         ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
    """)
    
    # Create extractor instance
    extractor = EmailExtractorPro()
    
    try:
        # Extract emails
        emails = extractor.extract_emails(args.target, args.type, args.depth)
        
        # Get statistics
        stats = extractor.get_statistics()
        
        # Output results
        if args.output == 'json':
            result = {
                "tool": "email-extractor-pro",
                "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
                "target": args.target,
                "target_type": args.type,
                "total_emails": len(emails),
                "statistics": stats,
                "emails": sorted(emails)
            }
            print(json.dumps(result, indent=2))
        else:
            print("\n" + "=" * 60)
            print("EMAIL EXTRACTION RESULTS")
            print("=" * 60)
            print(f"Target: {args.target}")
            print(f"Type: {args.type}")
            print(f"Total Emails Found: {len(emails)}")
            print(f"Unique Domains: {stats['unique_domains']}")
            print(f"Common Domains: {stats['common_domains']}")
            print(f"Top 5 Domains:")
            for domain, count in stats['top_domains'][:5]:
                print(f"  {domain}: {count} emails")
            print("\nExtracted Emails:")
            for email in sorted(emails):
                print(f"  {email}")
    
    except Exception as e:
        print(f"[!] Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()