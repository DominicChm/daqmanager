import SerialPort from "serialport";

export async function openTeensyPort(callback) {
    const ports = await SerialPort.list();
    const teensyPort = ports.find(p => p.vendorId === "16C0")
    if (!teensyPort) {
        console.warn("Couldn't find connected teensy!");
        return;
    }
    const port = new SerialPort(teensyPort.path, {baudRate: 115200}, () => callback(port));
}

// Aggregates serial port data until none is received for timeout ms.
// Good for download an unknown amount of data.
// Promise-based
export function rxData(port, timeout = 100) {
    return new Promise(res => {
        let buf = Buffer.alloc(0);
        let tout = setTimeout(end, timeout);
        let active = true;

        function cb(data) {
            if (!active) return;
            buf = Buffer.concat([buf, data]);

            //reset timeout on data RX.
            clearTimeout(tout);
            tout = setTimeout(end, timeout);
        }

        function end() {
            active = false;
            port.off("data", cb);
            res(buf);
        }

        port.on("data", cb);
    });
}

export function txData(port, data) {
    return new Promise((res, rej) => {
        port.write(data, (err) => {
            if (err)
                rej(err);
            else
                res();
        })
    })
}