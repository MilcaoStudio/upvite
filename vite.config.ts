import { sveltekit } from '@sveltejs/kit/vite';
import replace from "@rollup/plugin-replace";
import { readFileSync } from 'fs';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

function getGitRevision() {
  try {
    const rev = readFileSync(".git/HEAD").toString().trim();
    if (rev.indexOf(":") == -1) {
      return rev
    }

    return readFileSync(`.git/${rev.substring(5)}`)
      .toString()
      .trim()
  } catch (err) {
    console.error("Failed to get Git revision.");
    return "?"
  }
}

function getGitBranch() {
  try {
    const rev = readFileSync(".git/HEAD").toString().trim();
    if (rev.indexOf(":") == -1) {
      return "DETACHED"
    }

    return rev.split("/").pop();
  } catch (err) {
    console.error("Failed to get Git branch.");
    return "?"
  }
}

function getVersion() {
  return JSON.parse(readFileSync("package.json").toString()).version
}

function getLibraryVersion() {
  return JSON.parse(readFileSync("node_modules/revolt.js/package.json").toString()).version
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@sveltejs/kit")) {
            return "sveltekit"
          }
          if (id.includes("svelte/")) {
            return "svelte"
          }
          if (id.includes("lib/stores/")) {
            return "stores"
          }
          if (id.includes("revolt") || id.includes("revkit")) {
            return "revolt"
          }
          if (id.includes("boxicons")) {
            return "icons"
          }
          if (id.includes("prism")) {
            return "prism"
          }
          
        }
      }
    }
  },
  plugins: [
    sveltekit(),
    replace({
      __GIT_REVISION__: getGitRevision(),
      __GIT_BRANCH__: getGitBranch(),
      __APP_VERSION__: getVersion(),
      __REVOLTJS_VERSION__: getLibraryVersion(),
      preventAssignment: true,
    }),
  ],
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        "external"
      ]
    }
  },
  resolve: {
    preserveSymlinks: true,
  },
},);
