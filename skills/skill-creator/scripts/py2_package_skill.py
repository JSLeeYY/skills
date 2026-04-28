#!/usr/bin/env python2
# -*- coding: utf-8 -*-

"""
Python 2 Compatible Skill Packager
"""

import sys
import os
import shutil
import yaml
import re
import zipfile
from os.path import join, exists, basename, abspath, isdir

def validate_skill(skill_path):
    """Reuse the validation logic briefly"""
    skill_md = join(skill_path, 'SKILL.md')
    if not exists(skill_md):
        return False, "SKILL.md not found"
    
    # Simple check for frontmatter
    try:
        with open(skill_md, 'r') as f:
            content = f.read()
    except Exception as e:
        return False, "Could not open SKILL.md"
        
    if not content.startswith('---'):
        return False, "No YAML frontmatter"
    
    return True, "Valid"

def package_skill(skill_path, output_dir=None):
    """Package the skill into a .skill file (zip archive)"""
    skill_path = abspath(skill_path)
    skill_name = basename(skill_path)
    
    if not isdir(skill_path):
        return False, "Skill path is not a directory: " + skill_path
        
    # Validate first
    valid, message = validate_skill(skill_path)
    if not valid:
        return False, "Validation failed: " + message
        
    # Determine output path
    if output_dir:
        if not exists(output_dir):
            try:
                os.makedirs(output_dir)
            except OSError:
                return False, "Could not create output directory"
        output_path = join(output_dir, skill_name + ".skill")
    else:
        output_path = skill_path + ".skill"
        
    print "Packaging skill '" + skill_name + "' to " + output_path
    
    try:
        # Create zip file
        zf = zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED)
        
        # Walk directory
        for root, dirs, files in os.walk(skill_path):
            # Skip hidden files/dirs
            files = [f for f in files if not f.startswith('.')]
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            for file in files:
                abs_file = join(root, file)
                rel_path = os.path.relpath(abs_file, skill_path)
                
                # Use forward slashes for zip compatibility
                rel_path = rel_path.replace('\\', '/')
                
                zf.write(abs_file, rel_path)
        
        zf.close()
        return True, "Successfully packaged skill to: " + output_path
        
    except Exception as e:
        return False, "Packaging failed: " + str(e)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "Usage: python py2_package_skill.py <skill_directory> [output_directory]"
        sys.exit(1)
        
    skill_dir = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else None
    
    success, msg = package_skill(skill_dir, out_dir)
    print msg
    sys.exit(0 if success else 1)
