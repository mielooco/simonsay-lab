from pathlib import Path
import argparse
import base64
import json
import mimetypes
import shutil
import subprocess
import tempfile

p = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--bundler', help='Path to esbuild; otherwise use the cached npm package')
options = parser.parse_args()
assets = {f.name: 'data:' + mimetypes.guess_type(f.name)[0] + ';base64,' + base64.b64encode(f.read_bytes()).decode() for f in (p / 'assets').iterdir() if f.name.startswith('icon-') or f.name=='rhino-window.png'}
app = (p / 'app.js').read_text()
app = app.replace("const asset=name=>'assets/'+name;", 'const embeddedAssets=' + json.dumps(assets) + ";\nconst asset=name=>embeddedAssets[name]||'assets/'+name;")
app = app.replace("'./vendor/OrbitControls.js'", json.dumps(str(p / 'vendor/OrbitControls.js')))
app = app.replace("'./software-renderer.js'", json.dumps(str(p / 'software-renderer.js')))
bundler = [options.bundler] if options.bundler else [shutil.which('npm') or 'npm', 'exec', '--offline', '--yes', '--package=esbuild@0.25.0', '--', 'esbuild']
with tempfile.TemporaryDirectory(prefix='rhino-preview-') as tmp:
    entry = Path(tmp) / 'entry.js'
    bundle = Path(tmp) / 'bundle.js'
    entry.write_text(app)
    subprocess.run(bundler + [str(entry), '--bundle', '--format=iife', '--platform=browser', '--target=es2020', '--minify', '--legal-comments=inline', '--log-level=warning', '--alias:three=' + str(p / 'vendor/three.module.js'), '--outfile=' + str(bundle)], check=True)
    compiled = bundle.read_text()
assert 'import(' not in compiled, 'The local preview must not need dynamic module imports'
html = (p / 'source.html').read_text().replace('<link rel="stylesheet" href="style.css">', '<style>' + (p / 'style.css').read_text() + '</style>')
html = html.replace('<script type="importmap">{"imports":{"three":"./vendor/three.module.js"}}</script>', '')
html = html.replace('<script type="module" src="app.js"></script>', '<script>\n' + compiled + '\n</script>')
for name, data in assets.items():
    html = html.replace('href="assets/' + name + '"', 'href="' + data + '"')
for filename in ['index.html']:
    (p / filename).write_text(html)
print('Built Rhino surfaces unit:', len(html.encode()), 'bytes')
