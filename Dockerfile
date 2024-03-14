FROM oven/bun:latest as base
WORKDIR /usr/src/upvite

# requires previous bun install
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --production --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# build app
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/scr/upvite/. .
COPY --from=prerelease /usr/src/upvite/package.json .
# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "build/index.js"]
