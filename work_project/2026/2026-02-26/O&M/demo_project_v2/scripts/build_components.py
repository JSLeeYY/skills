import os

base_dir = r"D:\DevelopmentLocation\agent skill\skills\word_project\2026\2026-02-26\O&M\demo_project_v2"
scripts_dir = os.path.join(base_dir, "scripts")

chunks = ["chunk0.js", "chunk1.js", "chunk2.js", "chunk3.js", "chunk4.js", "chunk5.js"]

combined_code = []

# Write a header
combined_code.append("// ===================================================================\n")
combined_code.append("// 此文件为自动化生成的组件大全，包含所有页面的Vue结构和细化弹窗(全量V1还原版)\n")
combined_code.append("// ===================================================================\n\n")

for chunk in chunks:
    chunk_path = os.path.join(scripts_dir, chunk)
    with open(chunk_path, "r", encoding="utf-8") as f:
        combined_code.append(f.read())
        combined_code.append("\n\n")

# Write to components.js
output_path = os.path.join(base_dir, "components.js")
with open(output_path, "w", encoding="utf-8") as f:
    f.writelines(combined_code)

print("✅ Successfully built components.js with all chunks!")
