"""Keep the homepage and About page styled when opened directly as local files."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
assets = [
    ('index.html', 'assets/course-groups.css', 'course-layout', 'style', '<link rel="stylesheet" href="assets/course-groups.css">'),
    ('index.html', 'assets/course-groups.js', 'course-navigation', 'script', '<script src="assets/course-groups.js"></script>'),
    ('about/index.html', 'assets/about.css', 'about-layout', 'style', '<link rel="stylesheet" href="../assets/about.css">'),
]
for page, source, identifier, tag, original in assets:
    path = root / page
    raw = path.read_bytes()
    newline = '\r\n' if b'\r\n' in raw else '\n'
    html = raw.decode().replace('\r\n', '\n')
    content = (root / source).read_text().rstrip()
    block = f'<{tag} id="{identifier}">\n{content}\n</{tag}>'
    pattern = rf'<{tag} id="{identifier}">[\s\S]*?</{tag}>'
    if re.search(pattern, html):
        html = re.sub(pattern, lambda _: block, html, count=1)
    else:
        if original not in html:
            raise ValueError(f'Missing asset marker in {page}: {source}')
        html = html.replace(original, block, 1)
    path.write_bytes(html.replace('\n', newline).encode())
print('Embedded homepage styles/navigation and About styles.')
