import os

desktop = r'C:\Users\samud\OneDrive\Desktop'
app_dir = r'C:\Users\samud\OneDrive\Desktop\VasrshDristhi'

vbs_content = f'''Set oWS = WScript.CreateObject("WScript.Shell")

sLinkFile = "{desktop}\\SkyShield AI (1-Click Start).lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "{app_dir}\\START.bat"
oLink.WorkingDirectory = "{app_dir}"
oLink.Description = "Start SkyShield AI Platform"
oLink.Save

sLinkFile2 = "{desktop}\\SkyShield AI Control Panel.lnk"
Set oLink2 = oWS.CreateShortcut(sLinkFile2)
oLink2.TargetPath = "{app_dir}\\START_GUI.bat"
oLink2.WorkingDirectory = "{app_dir}"
oLink2.Description = "SkyShield AI GUI Control Center"
oLink2.Save
'''

vbs_path = os.path.join(app_dir, 'make_shortcuts.vbs')
with open(vbs_path, 'w', encoding='utf-8') as f:
    f.write(vbs_content)

os.system(f'cscript //nologo "{vbs_path}"')
if os.path.exists(vbs_path):
    os.remove(vbs_path)

print('Desktop shortcuts created successfully!')
