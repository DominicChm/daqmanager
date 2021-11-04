import {openTeensyPort} from "./portutil.js";
import fs from "fs"

function recieveData(port, timeout) {
    return new Promise(res => {
        let buf = Buffer.alloc(0);

        function cb(data) {
            buf = Buffer.concat([buf, data]);
        }

        port.on("data", cb);
        setTimeout(() => {
            port.off("data", cb);
            res(buf);

        }, timeout);
    });
}


export default async function (file) {
    await openTeensyPort((port) => do_download(port, file));
}

async function do_download(port, filearg) {
    await port.write("int off\n");
    //port.on("data", data => console.log(data.toString()));
    await recieveData(port, 100);
    await port.write(`dl-bin ${filearg}\n`);
    const dat = await recieveData(port, 1000);
    console.log(dat);
    fs.writeFileSync(filearg, dat);

    await port.close();
}