FROM oven/bun:latest as base
WORKDIR /usr/upvite

# requires previous bun install
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# build app
ENV NODE_ENV=production
RUN bun run build

# run the app
## some node modules are read-protected, root user is needed
#USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["bun", "build/index.js"]
