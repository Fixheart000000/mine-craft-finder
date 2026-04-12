// vite.config.ts
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

const config = defineConfig({
  plugins: [
    devtools({ removeDevtoolsOnBuild: true }),
    nitro(),
    tailwindcss(),
    tanstackStart(),
    react(),
    babel({
        presets: [reactCompilerPreset()],
    }),
  ],
});

export default config;