import { sveltekit } from '@sveltejs/kit/vite';
import replace from "@rollup/plugin-replace";
import { readFileSync } from 'fs';
import { defineConfig } from 'vite';

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

export default defineConfig({
  plugins: [
    sveltekit(),
    replace({
      __GIT_REVISION__: getGitRevision(),
      __GIT_BRANCH__: getGitBranch(),
      __APP_VERSION__: getVersion(),
      preventAssignment: true,
  }),
  ],
});
