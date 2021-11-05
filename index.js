#!/usr/bin/env node

import {Command} from "commander";
import run_update from "./commands/run_update.js";
import run_list from "./commands/run_list.js";
import run_downloadbin from "./commands/run_downloadbin.js";
import run_download from "./commands/run_download.js"
import * as Path from "path";


global.__basedir = Path.dirname(process.argv[1]);

const program = new Command();
program.version("0.0.1");
program.alias("daq");

program
    .command("list")
    .description("Lists runs present in the car's storage.")
    .action(run_list);

program
    .command("dlbin")
    .description("Downloads the specified file from the car into the current directory.")
    .argument("<file>")
    .action(run_downloadbin);

program
    .command("dl")
    .description("Downloads and converts the specified file from the car into the current directory.")
    .argument("<file>")
    .action(run_download);

program
    .command("update")
    .description("Does nothing yet.")
    .action(run_update);

program.parse(process.argv);