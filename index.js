#!/usr/bin/env node

import {Command} from "commander";
import run_update from "./run_update.js";
import run_list from "./run_list.js";
import run_downloadbin from "./run_downloadbin.js";
import run_download from "./run_download.js"
import * as Path from "path";
// import fs from "fs"
// d
global.__basedir = Path.dirname(process.argv[1]);

const program = new Command();

program
    .command("list")
    .action(run_list);

program
    .command("dlbin")
    .argument("<file>")
    .action(run_downloadbin);

program
    .command("dl")
    .argument("<file>")
    .action(run_download);

program
    .command("update")
    .action(run_update);

program.parse(process.argv);