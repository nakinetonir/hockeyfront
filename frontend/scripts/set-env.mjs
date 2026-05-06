import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputFile = `${__dirname}/../src/environments/environment.ts`;
const rawApiUrl = process.env.NG_APP_API_URL?.trim() || '/api';
const apiUrl = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const content = `export const environment = {\n  apiUrl: '${apiUrl}'\n};\n`;

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, content, 'utf8');
console.log(`environment.ts generado con apiUrl=${apiUrl}`);
