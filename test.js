import { mkdir, rm, readdir, readFile, copyFile, constants } from 'node:fs/promises';
import { statSync, existsSync } from 'node:fs';
import path from 'node:path';

const outputDir = "output"
const kitsDir = "kits"

const testKit = async (name) => {
    console.log(`--- Testing kit ${name} ---`)

    const sourceDir = path.join(kitsDir, name)
    const targetDir = path.join(outputDir, name)
    await mkdir(targetDir)
    console.log(`Target dir: ${targetDir}`)
    const kitConfig = JSON.parse(await readFile(path.join(kitsDir, `${name}.json`)))
    await processKit(kitConfig, sourceDir, targetDir)
}

const processKit = async (config, sourceDir, targetDir) => {
    for await (const item of config) {
        const srcDir = item.kit ? item.kit : sourceDir
        const toDir = path.join(targetDir, item.to)
        mkdir(toDir, { recursive: true })
        if (Array.isArray(item.from)) {
            for await (const from of item.from) {
                await cp(path.join(srcDir, from), toDir);
            }
        } else {
            await cp(path.join(srcDir, item.from), toDir, item.name);
        }
    }
}

const cp = async (source, targetDir, fileName) => {
    const target = fileName ? path.join(targetDir, fileName) : path.join(targetDir, path.basename(source))
    console.log(`Copying ${source} → ${target}…`)
    await copyFile(source, target, constants.COPYFILE_EXCL | constants.COPYFILE_FICLONE)
}

if (existsSync(outputDir)) {
    // cleanup
    await rm(outputDir, { recursive: true })
}
await mkdir(outputDir, { recursive: true })

const kitNames = (await readdir("kits"))
    .filter(name => name.endsWith(".json"))
    .filter(name => !name.startsWith("."))
    .filter(name => statSync(path.join(kitsDir, name)).isFile())
    .map(name => name.slice(0, -5))
    
for await (const name of kitNames) {
    await testKit(name)
}