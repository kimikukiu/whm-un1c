#!/usr/bin/env python3
"""
SQLi Dorks Generator Pro - WHOAMISec Offensive Toolkit
Generate Google dorks for SQL injection vulnerabilities
"""

import sys
import argparse
import json
import random
from datetime import datetime

class SQLiDorksGenerator:
    def __init__(self):
        self.basic_dorks = [
            "inurl:\"index.php?id=\"",
            "inurl:\"page.php?id=\"",
            "inurl:\"product.php?id=\"",
            "inurl:\"article.php?id=\"",
            "inurl:\"news.php?id=\"",
            "inurl:\"item.php?id=\"",
            "inurl:\"view.php?id=\"",
            "inurl:\"show.php?id=\"",
            "inurl:\"detail.php?id=\"",
            "inurl:\"content.php?id=\"",
            "inurl:\"category.php?id=\"",
            "inurl:\"list.php?id=\"",
            "inurl:\"display.php?id=\"",
            "inurl:\"info.php?id=\"",
            "inurl:\"profile.php?id=\"",
            "inurl:\"user.php?id=\"",
            "inurl:\"member.php?id=\"",
            "inurl:\"account.php?id=\"",
            "inurl:\"customer.php?id=\"",
            "inurl:\"client.php?id=\""
        ]
        
        self.advanced_dorks = [
            "inurl:\"admin.php?id=\"",
            "inurl:\"panel.php?id=\"",
            "inurl:\"dashboard.php?id=\"",
            "inurl:\"manage.php?id=\"",
            "inurl:\"control.php?id=\"",
            "inurl:\"edit.php?id=\"",
            "inurl:\"update.php?id=\"",
            "inurl:\"delete.php?id=\"",
            "inurl:\"remove.php?id=\"",
            "inurl:\"modify.php?id=\"",
            "inurl:\"change.php?id=\"",
            "inurl:\"add.php?id=\"",
            "inurl:\"insert.php?id=\"",
            "inurl:\"create.php?id=\"",
            "inurl:\"new.php?id=\"",
            "inurl:\"form.php?id=\"",
            "inurl:\"submit.php?id=\"",
            "inurl:\"process.php?id=\"",
            "inurl:\"action.php?id=\"",
            "inurl:\"handler.php?id=\""
        ]
        
        self.cms_specific = {
            'wordpress': [
                "inurl:\"/wp-content/plugins/\" inurl:\"?id=\"",
                "inurl:\"/wp-content/themes/\" inurl:\"?id=\"",
                "inurl:\"/wp-admin/admin-ajax.php?id=\"",
                "inurl:\"/wp-json/wp/v2/\" inurl:\"?id=\"",
                "inurl:\"wp-login.php?id=\""
            ],
            'joomla': [
                "inurl:\"/index.php?option=com_\" inurl:\"&id=\"",
                "inurl:\"/administrator/index.php?option=com_\"",
                "inurl:\"/components/com_\" inurl:\"?id=\"",
                "inurl:\"/modules/mod_\" inurl:\"?id=\"",
                "inurl:\"/plugins/system/\" inurl:\"?id=\""
            ],
            'drupal': [
                "inurl:\"/node/\" inurl:\"?id=\"",
                "inurl:\"/user/\" inurl:\"?id=\"",
                "inurl:\"/taxonomy/term/\" inurl:\"?id=\"",
                "inurl:\"/admin/\" inurl:\"?id=\"",
                "inurl:\"/modules/\" inurl:\"?id=\""
            ],
            'prestashop': [
                "inurl:\"/product.php?id=\"",
                "inurl:\"/category.php?id=\"",
                "inurl:\"/supplier.php?id=\"",
                "inurl:\"/manufacturer.php?id=\"",
                "inurl:\"/cart.php?id=\""
            ],
            'magento': [
                "inurl:\"/catalog/product/view/id/\"",
                "inurl:\"/catalog/category/view/id/\"",
                "inurl:\"/customer/account/\"",
                "inurl:\"/checkout/cart/\"",
                "inurl:\"/admin/\""
            ]
        }
        
        self.country_specific = {
            'US': ['site:.us', 'site:.com', 'site:.org'],
            'UK': ['site:.uk', 'site:.co.uk', 'site:.org.uk'],
            'CA': ['site:.ca', 'site:.gc.ca'],
            'AU': ['site:.au', 'site:.com.au'],
            'DE': ['site:.de', 'site:.bund.de'],
            'FR': ['site:.fr', 'site:.gouv.fr'],
            'IT': ['site:.it', 'site:.gov.it'],
            'ES': ['site:.es', 'site:.gob.es'],
            'NL': ['site:.nl', 'site:.gov.nl'],
            'BE': ['site:.be', 'site:.fgov.be']
        }
        
        self.file_extensions = [
            'php', 'asp', 'aspx', 'jsp', 'jspx', 'cfm', 'cfml', 'pl', 'py', 'rb'
        ]
        
        self.keywords = [
            'login', 'admin', 'user', 'member', 'customer', 'client', 'account',
            'profile', 'dashboard', 'panel', 'control', 'manage', 'settings',
            'config', 'setup', 'install', 'setup', 'config', 'administrator'
        ]
    
    def generate_basic_dorks(self, count=50):
        """Generate basic SQL injection dorks"""
        dorks = []
        
        # Basic parameter-based dorks
        for dork in self.basic_dorks[:count]:
            dorks.append(dork)
        
        return dorks
    
    def generate_advanced_dorks(self, count=30):
        """Generate advanced SQL injection dorks"""
        dorks = []
        
        for dork in self.advanced_dorks[:count]:
            dorks.append(dork)
        
        return dorks
    
    def generate_cms_dorks(self, cms_type, count=10):
        """Generate CMS-specific dorks"""
        dorks = []
        
        if cms_type in self.cms_specific:
            cms_dorks = self.cms_specific[cms_type]
            for dork in cms_dorks[:count]:
                dorks.append(dork)
        
        return dorks
    
    def generate_country_dorks(self, country, count=20):
        """Generate country-specific dorks"""
        dorks = []
        
        if country in self.country_specific:
            country_tlds = self.country_specific[country]
            basic_dorks = self.generate_basic_dorks(count)
            
            for tld in country_tlds:
                for basic_dork in basic_dorks:
                    dorks.append(f"{tld} {basic_dork}")
        
        return dorks[:count]
    
    def generate_custom_dorks(self, extension='php', keyword='admin', count=15):
        """Generate custom dorks based on parameters"""
        dorks = []
        
        templates = [
            f"inurl:\"{keyword}.{extension}?id=\"",
            f"inurl:\"{keyword}.{extension}?page=\"",
            f"inurl:\"{keyword}.{extension}?user=\"",
            f"inurl:\"{keyword}.{extension}?cat=\"",
            f"inurl:\"{keyword}.{extension}?product=\"",
            f"inurl:\"{keyword}.{extension}?item=\"",
            f"inurl:\"{keyword}.{extension}?article=\"",
            f"inurl:\"{keyword}.{extension}?news=\"",
            f"inurl:\"{keyword}.{extension}?post=\"",
            f"inurl:\"{keyword}.{extension}?thread=\"",
            f"inurl:\"{keyword}.{extension}?topic=\"",
            f"inurl:\"{keyword}.{extension}?file=\"",
            f"inurl:\"{keyword}.{extension}?doc=\"",
            f"inurl:\"{keyword}.{extension}?report=\"",
            f"inurl:\"{keyword}.{extension}?search=\""
        ]
        
        for template in templates[:count]:
            dorks.append(template)
        
        return dorks
    
    def generate_error_based_dorks(self, count=20):
        """Generate error-based SQL injection dorks"""
        dorks = []
        
        error_patterns = [
            '"You have an error in your SQL syntax"',
            '"mysql_fetch_array()"',
            '"ORA-"',
            '"Microsoft OLE DB Provider for ODBC Drivers"',
            '"Microsoft OLE DB Provider for SQL Server"',
            '"Error Executing Database Query"',
            '"ODBC SQL Server Driver"',
            '"SQLServer JDBC Driver"',
            '"SqlException"',
            '"PostgreSQL query failed"',
            '"Warning: mysql_"',
            '"Warning: pg_"',
            '"SQLServer JDBC Driver"',
            '"Unclosed quotation mark"',
            '"ODBC Drivers error"'
        ]
        
        basic_dorks = self.generate_basic_dorks(count)
        
        for error_pattern in error_patterns[:count]:
            for basic_dork in basic_dorks[:3]:
                dorks.append(f"{basic_dork} {error_pattern}")
        
        return dorks[:count]
    
    def generate_union_based_dorks(self, count=15):
        """Generate UNION-based SQL injection dorks"""
        dorks = []
        
        union_patterns = [
            '"UNION SELECT"',
            '"UNION ALL SELECT"',
            '"ORDER BY"',
            '"GROUP BY"',
            '"HAVING"',
            '"LIMIT"',
            '"OFFSET"'
        ]
        
        basic_dorks = self.generate_basic_dorks(count)
        
        for union_pattern in union_patterns:
            for basic_dork in basic_dorks[:2]:
                dorks.append(f"{basic_dork} {union_pattern}")
        
        return dorks[:count]
    
    def generate_all_dorks(self, count=100):
        """Generate comprehensive list of dorks"""
        all_dorks = []
        
        # Basic dorks
        all_dorks.extend(self.generate_basic_dorks(20))
        
        # Advanced dorks
        all_dorks.extend(self.generate_advanced_dorks(15))
        
        # CMS-specific dorks
        for cms in ['wordpress', 'joomla', 'drupal', 'prestashop', 'magento']:
            all_dorks.extend(self.generate_cms_dorks(cms, 5))
        
        # Error-based dorks
        all_dorks.extend(self.generate_error_based_dorks(10))
        
        # Union-based dorks
        all_dorks.extend(self.generate_union_based_dorks(10))
        
        # Custom dorks
        all_dorks.extend(self.generate_custom_dorks('php', 'admin', 10))
        
        # Remove duplicates and shuffle
        all_dorks = list(set(all_dorks))
        random.shuffle(all_dorks)
        
        return all_dorks[:count]

def main():
    parser = argparse.ArgumentParser(description='SQLi Dorks Generator Pro - WHOAMISec Toolkit')
    parser.add_argument('--type', choices=['basic', 'advanced', 'cms', 'country', 'custom', 'error', 'union', 'all'], 
                       default='all', help='Type of dorks to generate')
    parser.add_argument('--cms', choices=['wordpress', 'joomla', 'drupal', 'prestashop', 'magento'], 
                       help='CMS type (for cms type)')
    parser.add_argument('--country', help='Country code (for country type)')
    parser.add_argument('--extension', default='php', help='File extension (for custom type)')
    parser.add_argument('--keyword', default='admin', help='Keyword (for custom type)')
    parser.add_argument('--count', type=int, default=50, help='Number of dorks to generate')
    parser.add_argument('--output', help='Output file to save dorks')
    parser.add_argument('--format', choices=['json', 'txt'], default='json', help='Output format')
    
    args = parser.parse_args()
    
    print(f"[*] SQLi Dorks Generator Pro - WHOAMISec Toolkit")
    print(f"[*] Type: {args.type}")
    print(f"[*] Count: {args.count}")
    
    generator = SQLiDorksGenerator()
    dorks = []
    
    if args.type == 'basic':
        dorks = generator.generate_basic_dorks(args.count)
    elif args.type == 'advanced':
        dorks = generator.generate_advanced_dorks(args.count)
    elif args.type == 'cms':
        if not args.cms:
            print("Error: --cms required for cms type")
            sys.exit(1)
        dorks = generator.generate_cms_dorks(args.cms, args.count)
    elif args.type == 'country':
        if not args.country:
            print("Error: --country required for country type")
            sys.exit(1)
        dorks = generator.generate_country_dorks(args.country, args.count)
    elif args.type == 'custom':
        dorks = generator.generate_custom_dorks(args.extension, args.keyword, args.count)
    elif args.type == 'error':
        dorks = generator.generate_error_based_dorks(args.count)
    elif args.type == 'union':
        dorks = generator.generate_union_based_dorks(args.count)
    elif args.type == 'all':
        dorks = generator.generate_all_dorks(args.count)
    
    # Output results
    if args.format == 'json':
        result = {
            "tool": "sqli-dorks-generator",
            "timestamp": datetime.now().isoformat(),
            "type": args.type,
            "total_dorks": len(dorks),
            "dorks": dorks
        }
        
        if args.cms:
            result["cms"] = args.cms
        if args.country:
            result["country"] = args.country
        if args.type == 'custom':
            result["extension"] = args.extension
            result["keyword"] = args.keyword
        
        print(json.dumps(result, indent=2))
    else:
        print(f"\n[+] Generated {len(dorks)} SQL injection dorks:")
        for i, dork in enumerate(dorks, 1):
            print(f"{i:3d}. {dork}")
    
    # Save to file if specified
    if args.output:
        try:
            with open(args.output, 'w', encoding='utf-8') as f:
                if args.format == 'json':
                    json.dump(result, f, indent=2)
                else:
                    for dork in dorks:
                        f.write(dork + '\n')
            print(f"\n[+] Dorks saved to: {args.output}")
        except Exception as e:
            print(f"[-] Failed to save dorks: {e}")

if __name__ == '__main__':
    main()