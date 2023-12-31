import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';

let certFilePath = '';
let keyFilePath = '';
const prod = process.env.ENVIRONMENT == 'PRODUCTION';
console.log(`Prod=${prod}`);

if (process.env.ENVIRONMENT != 'PRODUCTION') {
const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ''
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME}/.aspnet/https`;

        const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : "vueapp";

if (!certificateName) {
    console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
    process.exit(-1);
}

certFilePath = path.join(baseFolder, `${certificateName}.pem`);
keyFilePath = path.join(baseFolder, `${certificateName}.key`);

}
const targetUrl = process.env.TARGET_URL != null ? process.env.TARGET_URL : "https://localhost:7222/";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/api/prompt': {
                target: `${targetUrl}`,
                secure: false
            },
            '^/api/dropbox/template': {
                target: `${targetUrl}`,
                secure: false
            },
            '^/api/dropbox/sign': {
                target: `${targetUrl}`,
                secure: false
            },
            '^/api/contract/get': {
                target: targetUrl,
                secure: false
            },
            '^/api/contract/prompt': {
                target: targetUrl,
                secure: false
            }
        },
        port: 5173,
        https: prod ? undefined : {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
