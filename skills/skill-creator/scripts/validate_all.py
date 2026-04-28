#!/usr/bin/env python2
# -*- coding: utf-8 -*-

import os
import sys
from os.path import join, isdir, exists
import json

# Import the validation logic from our existing script
sys.path.append(r"d:\DevelopmentLocation\agent skill\skills\skills\skill-creator\scripts")
try:
    from py2_validate_skill import validate_skill
except ImportError:
    # Fallback if path appending didn't work as expected or file not found
    print "Error loading validation script. Ensure py2_validate_skill.py is in skill-creator/scripts"
    sys.exit(1)

SKILLS_DIR = r"d:\DevelopmentLocation\agent skill\skills\skills"

def validate_all_skills():
    skills = [d for d in os.listdir(SKILLS_DIR) if isdir(join(SKILLS_DIR, d)) and not d.startswith('.')]
    
    print "\n=== Validating All Skills ===\n"
    
    results = {'succeeded': [], 'failed': []}
    
    for skill in skills:
        skill_path = join(SKILLS_DIR, skill)
        sys.stdout.write("Checking " + skill + "... ")
        
        try:
            valid, message = validate_skill(skill_path)
            if valid:
                print "PASS"
                results['succeeded'].append(skill)
            else:
                print "FAIL"
                print "  -> " + message
                results['failed'].append({'name': skill, 'message': message})
        except Exception as e:
            print "ERROR: " + str(e)
            results['failed'].append({'name': skill, 'message': "Exception: " + str(e)})

    print "\n=== Summary ==="
    print "Total Skills: " + str(len(skills))
    print "Passed: " + str(len(results['succeeded']))
    print "Failed: " + str(len(results['failed']))
    
    if results['failed']:
        print "\nFailures details:"
        for fail in results['failed']:
            print " - " + fail['name'] + ": " + fail['message']
    
    return len(results['failed']) == 0

if __name__ == "__main__":
    success = validate_all_skills()
    sys.exit(0 if success else 1)
