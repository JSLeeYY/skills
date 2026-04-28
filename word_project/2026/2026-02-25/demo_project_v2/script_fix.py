import os
import re

base = r'D:\DevelopmentLocation\agent skill\skills\word_project\2026\2026-02-25\demo_project_v2'

path = os.path.join(base, 'components.js')
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix `return { data, ` to `return { data: props.data, `
# Same for `contracts`
text = re.sub(r'return \{ data,', 'return { data: props.data,', text)
text = re.sub(r'return \{ data ', 'return { data: props.data ', text)
text = re.sub(r'return \{ data:', 'return { data:', text) # Safe fallback

# Wait, the destructuring could be anywhere: `{ data, addModal }`
# Let's cleanly replace it.
text = text.replace('{ data, ', '{ data: props.data, ')
text = text.replace('{ contracts, ', '{ contracts: props.contracts, ')
text = text.replace('{ data }', '{ data: props.data }')

# Fix: PersonnelPage returns { data, detailModal }
text = text.replace('{ data: props.data, detailModal }', '{ data: props.data, detailModal }') # already replaced above

# We also had: return { data, activeTab
text = text.replace('return { data, activeTab', 'return { data: props.data, activeTab')

# Fix fmtW is not a function
# ProfitPage: return { data, profitClass, fmtW, fmtW2 };
# I'll just change `app.js` to register them! Wait, `fmtW` is already returned mostly. Where did I forget `fmtW`?
# In comp_1.js ContractPage:
# `return { data: props.data, detailModal, terminateModal, fmt, fmtW, statusClass: ... }`
# In DashboardPage:
# `return { fmtW, totalContract: ... }`

# Actually, I'll write a small regex to just make sure `fmtW` is there or I can just use app.config.globalProperties in app.js.
with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

# Also let's fix app.js
app_j_path = os.path.join(base, 'app.js')
with open(app_j_path, 'r', encoding='utf-8') as f:
    app_text = f.read()

app_text = app_text.replace("createApp(App).mount('#app');", """
const app = createApp(App);
app.config.globalProperties.fmt = fmt;
app.config.globalProperties.fmtW = fmtW;
app.config.globalProperties.fmtW2 = (typeof fmtW2 !== 'undefined' ? fmtW2 : (n)=>(n/10000).toFixed(1));
app.mount('#app');
""")

with open(app_j_path, 'w', encoding='utf-8') as f:
    f.write(app_text)

print("Fixed variables!")
