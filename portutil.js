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