import os
import re

base = r'D:\DevelopmentLocation\agent skill\skills\word_project\2026\2026-02-25\demo_project_v2'
path = os.path.join(base, 'components.js')
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# I will find all `setup(props) {` or `setup(props, { emit }) {`
# And insert `const { role, data, contracts } = props;` at the beginning of the block.
# Wait, this will define local variables, so `return { role, data, contracts... }` will work perfectly!
# Even better, Vue props are automatically exposed to the template, but since I returned them inside `{...}` before, returning destructured props is perfectly fine.
# But wait, `data` might shadow something else? No, `data` is from props!
# So inserting `const data = props.data; const role = props.role; const contracts = props.contracts;` at the top of every setup block avoids all ReferenceErrors!

def fix_setup(match):
    prefix = match.group(0)
    # Insert safely
    return prefix + '\n        const data = props.data; const role = props.role; const contracts = props.contracts;'

text = re.sub(r'setup\(props[^\)]*\)\s*\{', fix_setup, text)

# I also need to reverse the previous `data: props.data` mess back to `data` or just leave it. If `data` is a local variable now, `data: props.data` is still perfectly valid syntax. `data: props.data` is redundant but fine.
# Let's clean up `contracts` which is returning `contracts` anyway. Now `contracts` local var will exist!

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Injected props aliases!")
