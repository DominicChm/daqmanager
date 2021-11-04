import {openTeensyPort} from "./portutil.js";
import fs from "fs"
import * as Path from "path";
import ParseManager from "daq-parse-lib"
import PapaParse from "papaparse"

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

    const vehicle_schema = JSON.parse(fs.readFileSync(Path.resolve(__basedir, "vehicle_config.json"), {encoding: "utf8"}))

    let col = [];
    const readings = [];
    const pm = new ParseManager((data) => {
        const obj = flattenObject(data);
        const keys = Object.keys(obj);
        col = [...new Set(col.concat(keys))];
        readings.push(obj);
    }, vehicle_schema);

    for (const b of dat) {
        pm.feedByte(b);
    }

    const outname = filearg.substr(0, filearg.lastIndexOf(".")) + ".csv";
    setTimeout(() => {
        console.log(col);
        const csv = PapaParse.unparse(readings, {columns: col, header: true});
        fs.writeFileSync(outname, csv);
        console.log(`Wrote to ${outname}`);
    }, 0);

    await port.close();
}

function flattenObject(obj) {
    const flattened = {}

    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(flattened, flattenObject(obj[key]))
        } else {
            flattened[key] = obj[key]
        }
    })

    return flattened
}