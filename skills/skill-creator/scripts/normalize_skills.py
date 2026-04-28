#!/usr/bin/env python2
# -*- coding: utf-8 -*-

import os
import shutil
import re
from os.path import join, exists, isdir, isfile

SKILLS_DIR = r"d:\DevelopmentLocation\agent skill\skills\skills"
TARGET_SKILLS = ['xlsx', 'pptx', 'pdf']

def normalize_skill(skill_name):
    skill_path = join(SKILLS_DIR, skill_name)
    print "Processing " + skill_name + "..."
    
    if not exists(skill_path):
        print "  Skipping: path not found."
        return

    scripts_dir = join(skill_path, 'scripts')
    references_dir = join(skill_path, 'references')
    assets_dir = join(skill_path, 'assets')
    
    if not exists(scripts_dir): os.makedirs(scripts_dir)
    if not exists(references_dir): os.makedirs(references_dir)
    if not exists(assets_dir): os.makedirs(assets_dir)
    
    skill_md_path = join(skill_path, 'SKILL.md')
    with open(skill_md_path, 'r') as f:
        skill_content = f.read()
        
    original_content = skill_content
    
    # 1. Move root .md files to references (exclude SKILL.md, LICENSE*)
    for f in os.listdir(skill_path):
        if f.lower().endswith('.md') and f != 'SKILL.md' and not f.lower().startswith('license') and not f.lower().startswith('readme'):
            src = join(skill_path, f)
            dst = join(references_dir, f)
            print "  Moving " + f + " to references/"
            shutil.move(src, dst)
            
            # Update replacement - simple string replacement for markdown links
            # Pattern: [Label](Filename.md) -> [Label](references/Filename.md)
            # Also: ["Filename.md"] -> ["references/Filename.md"]
            # To be safe, look for exact filename boundary
            skill_content = skill_content.replace('(' + f + ')', '(references/' + f + ')')
            skill_content = skill_content.replace('["' + f + '"]', '["references/' + f + '"]')
            skill_content = skill_content.replace("['" + f + "']", "['references/" + f + "']")
            skill_content = skill_content.replace('`' + f + '`', '`references/' + f + '`')

    # 2. Move root .py files to scripts
    for f in os.listdir(skill_path):
        if f.lower().endswith('.py') and isfile(join(skill_path, f)):
            src = join(skill_path, f)
            dst = join(scripts_dir, f)
            print "  Moving " + f + " to scripts/"
            shutil.move(src, dst)
            
            # Update references
            # Pattern: python Filename.py -> python scripts/Filename.py
            skill_content = skill_content.replace('python ' + f, 'python scripts/' + f)
            skill_content = skill_content.replace('`' + f + '`', '`scripts/' + f + '`')

    # 3. Handle ooxml folder special case (for pptx)
    ooxml_path = join(skill_path, 'ooxml')
    if isdir(ooxml_path):
        print "  Processing ooxml directory..."
        
        # Move scripts
        ooxml_scripts = join(ooxml_path, 'scripts')
        if isdir(ooxml_scripts):
            for f in os.listdir(ooxml_scripts):
                src = join(ooxml_scripts, f)
                dst = join(scripts_dir, f)
                if isdir(src):
                    # validation dir case
                    if exists(dst): shutil.rmtree(dst)
                    shutil.move(src, dst)
                else:
                    if exists(dst): os.remove(dst)
                    shutil.move(src, dst)
            print "  Moved ooxml/scripts to scripts/"

        # Move schemas
        ooxml_schemas = join(ooxml_path, 'schemas')
        if isdir(ooxml_schemas):
            dst_schemas = join(assets_dir, 'schemas')
            if exists(dst_schemas): shutil.rmtree(dst_schemas)
            shutil.move(ooxml_schemas, dst_schemas)
            print "  Moved ooxml/schemas to assets/schemas"
            
            # Update validation/base.py if it exists (fix schema path)
            base_py = join(scripts_dir, 'validation', 'base.py')
            if exists(base_py):
                 with open(base_py, 'r') as bf:
                     bcontent = bf.read()
                 bcontent = bcontent.replace('.parent / "schemas"', '.parent / "assets" / "schemas"')
                 with open(base_py, 'w') as bf:
                     bf.write(bcontent)
                 print "  Updated validation/base.py schema path"

        # Update SKILL.md for ooxml paths
        skill_content = skill_content.replace('ooxml/scripts/', 'scripts/')
        skill_content = skill_content.replace('python ooxml/', 'python assets/') # fallback? No.
        
        # Remove ooxml dir
        shutil.rmtree(ooxml_path)
        print "  Removed ooxml directory"

    # Save SKILL.md if changed
    if skill_content != original_content:
        with open(skill_md_path, 'w') as f:
            f.write(skill_content)
        print "  Updated SKILL.md"

def get_all_skills():
    return [d for d in os.listdir(SKILLS_DIR) if isdir(join(SKILLS_DIR, d)) and not d.startswith('.')]

if __name__ == "__main__":
    target_skills = get_all_skills()
    # Exclude already processed ones if we want, but re-running is safe
    # But let's be thorough
    
    for skill in target_skills:
        try:
            # Special logic for reference -> references renaming
            skill_path = join(SKILLS_DIR, skill)
            old_ref = join(skill_path, 'reference')
            new_ref = join(skill_path, 'references')
            if exists(old_ref) and not exists(new_ref):
                print "Renaming reference -> references for " + skill
                shutil.move(old_ref, new_ref)
                
                # Update SKILL.md
                skill_md = join(skill_path, 'SKILL.md')
                if exists(skill_md):
                     with open(skill_md, 'r') as f: content = f.read()
                     new_content = content.replace('reference/', 'references/')
                     if content != new_content:
                         with open(skill_md, 'w') as f: f.write(new_content)
                         print "  Updated SKILL.md for reference path"
            
            normalize_skill(skill)
        except Exception as e:
            print "Error processing " + skill + ": " + str(e)
