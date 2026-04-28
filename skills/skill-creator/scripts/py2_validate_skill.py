#!/usr/bin/env python2
# -*- coding: utf-8 -*-

"""
Python 2 Compatible Quick Validation Script for Skills
"""

import sys
import os
import re
import yaml
from os.path import join, exists, isfile

def validate_skill(skill_path):
    """Basic validation of a skill (Python 2 version)"""
    
    print "Validating skill at: " + skill_path

    # Check SKILL.md exists
    skill_md = join(skill_path, 'SKILL.md')
    if not exists(skill_md):
        return False, "SKILL.md not found"

    # Read and validate frontmatter
    try:
        with open(skill_md, 'r') as f:
            content = f.read()
    except Exception as e:
        return False, "Could not read SKILL.md: " + str(e)

    if not content.startswith('---'):
        return False, "No YAML frontmatter found"

    # Extract frontmatter
    # Use DOTALL flag for multiline matching
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "Invalid frontmatter format"

    frontmatter_text = match.group(1)

    # Parse YAML frontmatter
    try:
        frontmatter = yaml.safe_load(frontmatter_text)
        if not isinstance(frontmatter, dict):
            return False, "Frontmatter must be a YAML dictionary"
    except yaml.YAMLError as e:
        return False, "Invalid YAML in frontmatter: " + str(e)

    # Define allowed properties
    ALLOWED_PROPERTIES = set(['name', 'description', 'license', 'allowed-tools', 'metadata'])

    # Check for unexpected properties (excluding nested keys under metadata)
    unexpected_keys = set(frontmatter.keys()) - ALLOWED_PROPERTIES
    if unexpected_keys:
        return False, "Unexpected key(s) in SKILL.md frontmatter: " + ', '.join(sorted(list(unexpected_keys)))

    # Check required fields
    if 'name' not in frontmatter:
        return False, "Missing 'name' in frontmatter"
    if 'description' not in frontmatter:
        return False, "Missing 'description' in frontmatter"

    # Extract name for validation
    name = frontmatter.get('name', '')
    if not isinstance(name, basestring):
        return False, "Name must be a string"
    name = name.strip()
    if name:
        # Check naming convention (hyphen-case: lowercase with hyphens)
        if not re.match(r'^[a-z0-9-]+$', name):
            return False, "Name '" + name + "' should be hyphen-case (lowercase letters, digits, and hyphens only)"
        if name.startswith('-') or name.endswith('-') or '--' in name:
            return False, "Name '" + name + "' cannot start/end with hyphen or contain consecutive hyphens"
        # Check name length (max 64 characters per spec)
        if len(name) > 64:
            return False, "Name is too long (" + str(len(name)) + " characters). Maximum is 64 characters."

    # Extract and validate description
    description = frontmatter.get('description', '')
    if not isinstance(description, basestring):
        return False, "Description must be a string"
    description = description.strip()
    if description:
        # Check for angle brackets
        if '<' in description or '>' in description:
            return False, "Description cannot contain angle brackets (< or >)"
        # Check description length (max 1024 characters per spec)
        if len(description) > 1024:
            return False, "Description is too long (" + str(len(description)) + " characters). Maximum is 1024 characters."

    return True, "Skill is valid!"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print "Usage: python py2_validate_skill.py <skill_directory>"
        sys.exit(1)
    
    valid, message = validate_skill(sys.argv[1])
    print message
    sys.exit(0 if valid else 1)
