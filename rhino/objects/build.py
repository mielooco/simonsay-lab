from pathlib import Path
import base64,json
p=Path(__file__).resolve().parent
b64=lambda name:base64.b64encode((p/name).read_bytes()).decode()
boot="const moduleURL=s=>URL.createObjectURL(new Blob([s],{type:'text/javascript'}));\nconst unpack=s=>new TextDecoder().decode(Uint8Array.from(atob(s),c=>c.charCodeAt(0)));\n"
boot+='const coreURL=moduleURL(unpack('+json.dumps(b64('vendor/three.core.js'))+'));\n'
boot+='const threeURL=moduleURL(unpack('+json.dumps(b64('vendor/three.module.js'))+').replaceAll("\'./three.core.js\'",JSON.stringify(coreURL)));\n'
boot+='const THREE=await import(threeURL);\n'
boot+='const orbitURL=moduleURL(unpack('+json.dumps(b64('vendor/OrbitControls.js'))+').replaceAll("\'three\'",JSON.stringify(threeURL)));\nconst {OrbitControls}=await import(orbitURL);\n'
app=(p/'app.js').read_text().replace("import * as THREE from 'three';",'').replace("import {OrbitControls} from './vendor/OrbitControls.js';",'')
for asset in (p/'assets').rglob('*'):
 if asset.suffix.lower() in ('.png','.gif'):
  mime='image/gif' if asset.suffix.lower()=='.gif' else 'image/png'
  app=app.replace(asset.relative_to(p).as_posix(),'data:'+mime+';base64,'+base64.b64encode(asset.read_bytes()).decode())
for icon in (p/'assets/icons').glob('*.png'):
 app=app.replace('assets/icons/'+icon.name,'data:image/png;base64,'+base64.b64encode(icon.read_bytes()).decode())
# Command icons are assigned from names at runtime; embed their actual official bytes.
icon_data={icon.stem:'data:image/png;base64,'+base64.b64encode(icon.read_bytes()).decode() for icon in (p/'assets/icons').glob('*.png')}
app=app.replace("icon:'assets/icons/'+name.toLowerCase()+'.png'", "icon:("+json.dumps(icon_data)+")[name.toLowerCase()]")
html=(p/'source.html').read_text().replace('<link rel="stylesheet" href="style.css">','<style>'+(p/'style.css').read_text()+'</style>').replace('<link rel="stylesheet" href="layout.css">','<style>'+(p/'layout.css').read_text()+'</style>').replace('<link rel="stylesheet" href="toolbar-guide.css">','<style>'+(p/'toolbar-guide.css').read_text()+'</style>').replace('<script type="importmap">{"imports":{"three":"./vendor/three.module.js"}}</script>','').replace('<script type="module" src="app.js"></script>','<script type="module">'+boot+app+'</script>')
(p/'index.html').write_text(html)
print('Built Rhino unit:',len(html),'characters')
