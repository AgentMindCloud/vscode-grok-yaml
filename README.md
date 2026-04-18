![GrokInstall extension banner](media/banner.png)
<img width="128" height="128" alt="icon-dark" src="https://github.com/user-attachments/assets/d7fcef83-5bb0-43b8-b6f6-bca91afaeadb" />
<img width="128" height="128" alt="icon" src="https://github.com/user-attachments/assets/fe1fcbb6-89b4-4c7b-9d64-d4a1c2490f5c" />
<img width="1376" height="400" alt="banner" src="https://github.com/user-attachments/assets/699733ee-be7b-4851-9e9c-67f063bcdd32" />

QUICK PATCH — vscode-grok-yaml: wire up brand icon and marketplace banner

Context: Session 5 of the GrokInstall masterplan deferred the extension 
icon and gallery banner. Claude Design has produced them and I've placed 
four files into vscode-grok-yaml/media/:

  media/icon.png        128×128, transparent bg, cyan brand mark
  media/icon-dark.png   128×128, #0A0A0A bg, same mark (fallback)
  media/banner.png      1376×400, marketplace gallery banner
  media/README.md       documentation of these assets, locked hex values, 
                        and iteration notes — keep this file, don't delete

Verify all four exist before doing anything else. If any are missing, 
STOP and tell me which.

Tasks:

1. Open vscode-grok-yaml/package.json. Make these edits:

   a. Add or restore the "icon" field at top level:
      "icon": "media/icon.png"

   b. Add or update the galleryBanner block at top level:
      "galleryBanner": {
        "color": "#0A0A0A",
        "theme": "dark"
      }

   Place both fields in standard VS Code extension manifest order: after 
   displayName/description/version/publisher but before engines. If 
   existing values differ, overwrite — these are correct per the locked 
   brand documented in media/README.md.

2. Open vscode-grok-yaml/.vscodeignore. Confirm the media/ folder is NOT 
   excluded. If you find any pattern that would exclude it (like 
   "media/**", "*.png", or specific file exclusions), remove just those 
   lines. The media/README.md is fine to ship inside the .vsix — it's 
   small and provides context. If .vscodeignore doesn't exist, leave it 
   alone — default behavior includes media/.

3. Open vscode-grok-yaml/README.md (the marketplace-facing one). Add 
   directly under the title, if not already present:
   
   ![GrokInstall extension banner](media/banner.png)

   If the README already references the banner with a different path, 
   update it to media/banner.png exactly.

4. Run a local sanity check:
   - cd vscode-grok-yaml
   - Read package.json scripts to find the build command (npm run compile, 
     npm run build, or similar) and run it
   - npx @vscode/vsce package --no-dependencies
   - Confirm the command exits 0 and a .vsix file is produced
   - Verify icon and banner are inside the .vsix:
       npx @vscode/vsce ls > /tmp/vsix-contents.txt
       grep -E "media/(icon|banner)" /tmp/vsix-contents.txt
     Both files must appear.
   - Delete /tmp/vsix-contents.txt and the .vsix afterward — throwaway.

5. If step 4 fails, STOP and report the exact error. Do not commit until 
   packaging succeeds locally.

6. If step 4 passes, commit with this exact message:
   chore(extension): wire up brand icon and marketplace banner
   
   - Re-enable icon field pointing to media/icon.png
   - Add galleryBanner block with locked brand bg #0A0A0A
   - Reference banner.png in marketplace README
   - Verified .vsix packaging includes media assets

7. Bump version in package.json (e.g. 0.1.0 → 0.1.1). Add a CHANGELOG.md 
   entry under a new [0.1.1] section:
   
   ### Added
   - Brand-locked extension icon (media/icon.png)
   - VS Code Marketplace gallery banner with dark theme
   
   Then commit the version bump separately:
   chore: bump to 0.1.1

NO marketing pack needed — internal patch.

Output: the diff for package.json, the .vsix verification output 
showing icon.png and banner.png present, and confirmation both commits 
landed cleanly.

GrokInstall — VS Code Extension Media Assets (v1)
===================================================

Target paths in the extension repo
----------------------------------
Place each file at the following path inside `vscode-grok-yaml/`:

  vscode-grok-yaml/media/icon.png        (128x128, transparent background)
  vscode-grok-yaml/media/icon-dark.png   (128x128, #0A0A0A background fallback)
  vscode-grok-yaml/media/banner.png      (1376x400, Marketplace gallery banner)




Wire-up in package.json (reference, for Claude Code or manual edit):

  "icon": "media/icon.png",
  "galleryBanner": {
    "color": "#0A0A0A",
    "theme": "dark"
  }

And in the Marketplace-facing README.md, directly under the title:

  ![GrokInstall extension banner](media/banner.png)


Locked brand hex values used in these assets
--------------------------------------------
  Background (deep space black)     #0A0A0A
  Primary neon (cyan)               #00F0FF
  Success neon (green)              #00FF9D
  Primary text                      #FFFFFF
  Secondary text                    #E5E5E5
  Tertiary text                     rgba(255, 255, 255, 0.5)
  Surface (glass fills)             rgba(255, 255, 255, 0.04)
  Border subtle                     rgba(0, 240, 255, 0.15)
  Border focused                    rgba(0, 240, 255, 0.40)

No other colors appear in these assets. No drop shadows. Neon glow only.


Version
-------
These are version 1 of the icon + banner pair.

If you want to iterate — tighter crop, different headline, a seasonal
variant, a larger or smaller mark, a lighter-weight editor mockup, etc. —
just ask in the same Claude Design project ("Grok Install Eco System")
so the saved GrokInstall design system stays calibrated. Starting a new
project would re-bootstrap the tokens and risk drift.

Legal
-----
GrokInstall is an independent community project. Not affiliated with
xAI, Grok, or X.
