import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

const files = ['index.html', 'style.css', 'app.js'];
const directories = ['public', 'fonts'];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of files) {
  await cp(join(root, file), join(dist, file));
}

for (const directory of directories) {
  await cp(join(root, directory), join(dist, directory), {
    recursive: true,
    force: true,
  });
}
