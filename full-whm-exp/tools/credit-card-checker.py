#!/usr/bin/env python3
"""
Credit Card Validator and Checker
WHOAMISec Offensive Security Toolkit
"""

import sys
import argparse
import re
import requests
import json
from datetime import datetime

def validate_card_number(card_number):
    """Validate credit card number using Luhn algorithm"""
    # Remove spaces and dashes
    card_number = re.sub(r'[\s-]', '', card_number)
    
    # Check if it's all digits and has valid length
    if not re.match(r'^\d{13,19}$', card_number):
        return False, "Invalid format - must be 13-19 digits"
    
    # Luhn algorithm
    def luhn_checksum(card_num):
        def digits_of(n):
            return [int(d) for d in str(n)]
        digits = digits_of(card_num)
        odd_digits = digits[-1::-2]
        even_digits = digits[-2::-2]
        checksum = sum(odd_digits)
        for d in even_digits:
            checksum += sum(digits_of(d*2))
        return checksum % 10
    
    is_valid = luhn_checksum(card_number) == 0
    return is_valid, "Valid" if is_valid else "Invalid checksum"

def detect_card_type(card_number):
    """Detect credit card type based on number patterns"""
    card_number = re.sub(r'[\s-]', '', card_number)
    
    patterns = {
        'Visa': r'^4[0-9]{12,18}$',
        'Mastercard': r'^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$',
        'American Express': r'^3[47][0-9]{13}$',
        'Discover': r'^6(?:011|5[0-9]{2})[0-9]{12}$',
        'Diners Club': r'^3[0689][0-9]{11,14}$',
        'JCB': r'^(?:2131|1800|35[0-9]{3})[0-9]{11}$'
    }
    
    for card_type, pattern in patterns.items():
        if re.match(pattern, card_number):
            return card_type
    
    return "Unknown"

def check_card_status(card_number):
    """Check card status via external API (simulated)"""
    # This is a simulated check - in real scenarios, this would use actual payment gateways
    # For security and legal reasons, this is just a simulation
    
    card_number = re.sub(r'[\s-]', '', card_number)
    
    # Simulate different card statuses based on number patterns
    last_digit = int(card_number[-1])
    
    if last_digit in [0, 1, 2]:
        return {
            "status": "Active",
            "bank": "Chase Bank",
            "country": "US",
            "level": "Standard"
        }
    elif last_digit in [3, 4, 5]:
        return {
            "status": "Active",
            "bank": "Bank of America",
            "country": "US",
            "level": "Gold"
        }
    elif last_digit in [6, 7]:
        return {
            "status": "Inactive",
            "bank": "Wells Fargo",
            "country": "US",
            "level": "Platinum"
        }
    else:
        return {
            "status": "Unknown",
            "bank": "Unknown Bank",
            "country": "Unknown",
            "level": "Unknown"
        }

def format_card_number(card_number):
    """Format card number with spaces for readability"""
    card_number = re.sub(r'[\s-]', '', card_number)
    
    # Format as XXXX XXXX XXXX XXXX
    if len(card_number) >= 16:
        return f"{card_number[:4]} {card_number[4:8]} {card_number[8:12]} {card_number[12:16]}"
    elif len(card_number) >= 13:
        return f"{card_number[:4]} {card_number[4:8]} {card_number[8:12]} {card_number[12:]}"
    else:
        return card_number

def main():
    parser = argparse.ArgumentParser(description='Credit Card Validator and Checker')
    parser.add_argument('--cardNumbers', required=True, help='Credit card numbers (comma-separated)')
    parser.add_argument('--output', choices=['json', 'text'], default='json', help='Output format')
    
    args = parser.parse_args()
    
    card_numbers = [card.strip() for card in args.cardNumbers.split(',')]
    results = []
    
    for card_number in card_numbers:
        if not card_number:
            continue
            
        result = {
            "card_number": card_number,
            "formatted_number": format_card_number(card_number),
            "timestamp": datetime.now().isoformat()
        }
        
        # Validate card
        is_valid, validation_message = validate_card_number(card_number)
        result["validation"] = {
            "is_valid": is_valid,
            "message": validation_message
        }
        
        # Detect card type
        card_type = detect_card_type(card_number)
        result["card_type"] = card_type
        
        # Check card status (simulated)
        status_info = check_card_status(card_number)
        result["status"] = status_info
        
        results.append(result)
    
    # Output results
    if args.output == 'json':
        print(json.dumps({
            "tool": "credit-card-checker",
            "timestamp": datetime.now().isoformat(),
            "total_cards": len(results),
            "results": results
        }, indent=2))
    else:
        print("=" * 60)
        print("CREDIT CARD VALIDATION RESULTS")
        print("=" * 60)
        
        for result in results:
            print(f"Card Number: {result['formatted_number']}")
            print(f"Type: {result['card_type']}")
            print(f"Valid: {'YES' if result['validation']['is_valid'] else 'NO'}")
            print(f"Message: {result['validation']['message']}")
            print(f"Status: {result['status']['status']}")
            print(f"Bank: {result['status']['bank']}")
            print(f"Country: {result['status']['country']}")
            print(f"Level: {result['status']['level']}")
            print("-" * 40)

if __name__ == '__main__':
    main()