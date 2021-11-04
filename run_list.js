import SerialPort from "serialport"
import {promisify} from "util";
import {openTeensyPort} from "./portutil.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

export default async function () {
    await openTeensyPort(doList)
}

async function doList(port) {
    await port.write("int off\n");
    //port.on("data", data => console.log(data.toString()));
    await recieveData(port, 100);
    await port.write("list\n");
    const dat = await recieveData(port, 500);
    const files = dat
        .toString()
        .split("\n")
        .map(s => s.trim())
        .filter(f => f && f.length > 0);
    console.log(`${files.length} files found: `);

    for (const file of files)
        console.log(file);


    await port.close();
}