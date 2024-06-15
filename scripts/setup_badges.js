import { existsSync, createReadStream, } from "fs";
import axios from "axios";
import crypto from "crypto";
import { writeFile } from "fs/promises";

const target = process.env.ASSETS + "/badges";
const DEFAULT_DIRECTORY = "static/public_badges";
const OUT_DIRECTORY = "static/badges";

function createMD5(filePath) {
    return new Promise((Ok) => {
        const hash = crypto.createHash("md5");

        const rStream = createReadStream(filePath);

        rStream.on('data', (data) => hash.update(data));

        rStream.on('end', () => Ok(hash.digest('hex')));
    })
}

(async () => {
    try {
        await access(OUT_DIRECTORY);
        if (process.argv[2] == "--check") return;
    } catch (err) { }

    if (target) {
        const content = (await axios(target + "/badges.md5", {responseType: "text"})).data;
        console.info("> Checksum file fetched from", target + "/badges.md5 :", content);
        const lines = content.split("\n");
        for (const line of lines) {
            const [remote_checksum, file] = line.split(/\s+/);
            const local_path = `${OUT_DIRECTORY}/${file}`;
            const target_path = `${target}/${file}`;
            if (existsSync(local_path)) {
                const local_checksum = await createMD5(local_path);
                console.info("> Local checksum generated from", local_path, ":", local_checksum);
                if (local_checksum == remote_checksum) {
                    console.info("> Success: Checksum match.");
                    continue;
                }
                console.info("Checksums don't match. Updating icons from ", target_path);
            }
            const icon = (await axios(target_path, { responseType: "text" })).data;
            console.info("> Downloaded icon", icon.slice(0, 30));
            await writeFile(local_path, icon, { encoding: "utf-8" });
        }
    } else {
        await copy(DEFAULT_DIRECTORY, OUT_DIRECTORY);
    }
})();