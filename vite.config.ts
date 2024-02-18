import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    plugins: [react()],
    build: {
      sourcemap: true,
	  rollupOptions: {
		/**
		 * Ignore "use-client" waning since we are not using SSR
		 * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 
		 * Preserve 'use-client' directives TanStack/query#5161}
		 */
			onwarn(warning, warn) {
				if(warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes(`"use-client"`))
					return;

				warn(warning);
			},
		},
    },
    base: '/',
    resolve: {
      alias: {
        src: fileURLToPath(new URL('./src', import.meta.url)),
        public: fileURLToPath(new URL('./public', import.meta.url)),
      },
    },
	server : {
		host: true,
		watch: {
            // somehow vite in storybook keeps on detecting changes in these files without edits
            // see: https://github.com/storybookjs/storybook/issues/22253
            ignored: ["**/.env", "**/.env.local", "**/tsconfig.json", "**/tsconfig.node.json"],
        },
	}
  }
})
