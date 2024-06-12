import { existsSync, readFileSync, } from "fs";
import axios from "axios";
import { writeFile } from "fs/promises";

const target = process.env.ASSETS + "/badges";
const DEFAULT_DIRECTORY = "static/public_badges";
const OUT_DIRECTORY = "static/badges";
const files = ["amog.svg", "amorbus.svg", "developer.svg", "early_adopter.svg", "founder.svg", "moderation.svg"]

(async () => {
    try {
        await access(OUT_DIRECTORY);
        if (process.argv[2] == "--check") return;
    } catch (err) {}

    if (target) {
        for(const file of files){
            const target_path = `${target}/${file}`;
            const local_path = `${OUT_DIRECTORY}/${file}`;
            const remote_checksum = (await axios(target_path + ".md5", {responseType: "text"})).data;
            console.info("> Remote checksum from", target_path + ".md5", ":", remote_checksum);
            if (existsSync(target_path + ".md5")) {
                const local_checksum = readFileSync(local_path + ".md5", {encoding: "utf-8"});
                console.info("> Local checksum located in", local_path + ".md5", ":", local_checksum);
                if (remote_checksum == local_checksum) {
                    return;
                }
                console.warn("Local checksum and remote checksum are not equal.");
            }
            writeFile(local_path + ".md5", remote_checksum, {encoding: "utf-8"})
                .then(()=>console.info("> Checksum updated"));
            const icon = (await axios(target_path, {responseType: "text"})).data;
            console.info("> Downloaded icon", icon.slice(0, 30));
        }
    } else {
        await copy(DEFAULT_DIRECTORY, OUT_DIRECTORY);
    }
})();