import {openTeensyPort, rxData, txData} from "../portutil.js";
import fs from "fs"

export default async function (file) {
    await openTeensyPort((port) => do_download(port, file));
}

async function do_download(port, filearg) {
    await port.write("int off\n");
    //port.on("data", data => console.log(data.toString()));
    await rxData(port, 100);
    await txData(port, `dl-bin ${filearg}\n`);
    const dat = await rxData(port, 1000);
    //console.log(dat);
    await port.close();

    fs.writeFileSync(filearg, dat);
}