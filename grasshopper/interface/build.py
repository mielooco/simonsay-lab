from pathlib import Path
import base64
p=Path(__file__).resolve().parent
html=(p/'source.html').read_text().replace('<link rel="stylesheet" href="style.css">','<style>\n'+(p/'style.css').read_text()+'\n</style>').replace('<script src="app.js"></script>','<script>\n'+(p/'app.js').read_text()+'\n</script>')
# Embed the reference images and the official Rhino command icon.
for name in ['interface-reference.png','windows-reference.png','grasshopper-icon.png']:
 html=html.replace('assets/'+name,'data:image/png;base64,'+base64.b64encode((p/'assets'/name).read_bytes()).decode())
# Dynamic image switches use the same embedded sources.
embedded={name:'data:image/png;base64,'+base64.b64encode((p/'assets'/name).read_bytes()).decode() for name in ['interface-reference.png','windows-reference.png']}
import json
html=html.replace("'assets/'+l.image",'('+json.dumps(embedded)+')[l.image]')
(p/'index.html').write_text(html)
print('Built Grasshopper interface unit:',len(html.encode()),'bytes')
