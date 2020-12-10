import path from "path";
import fs from "fs";
import util from "util";
import csv from "async-csv";
import CsvAsync from "async-csv";

export namespace io {

    /**
     *
     * @param {string} dirname the __dirname variable
     * @param {string} relative relative path to file
     * @param options encoding options
     */
    export function readFile(dirname: string, relative: string, options: any): Promise<Buffer> {
        return util.promisify(fs.readFile)(path.resolve(dirname, relative), options)
    }

    /**
     *
     * @param {string} dirname the __dirname variable
     * @param {string} relative relative path to file
     * @param options encoding options
     */
    export async function readFileAsString(dirname: string, relative: string, options: any): Promise<string> {
        const content = await util.promisify(fs.readFile)(path.resolve(dirname, relative), options);
        return content.toString();
    }

    /**
     *
     * @param {string} dirname the __dirname variable
     * @param {string} relative relative path to file
     * @param options encoding options
     */
    export async function readFileAsJSON(dirname: string, relative: string, options: any): Promise<Object> {
        const content = await util.promisify(fs.readFile)(path.resolve(dirname, relative), options);
        return JSON.parse(content.toString());
    }

    /**
     *
     * @param {string} dirname the __dirname variable
     * @param {string} relative relative path to file
     * @param options encoding options
     */
    export async function readFilesAsCSV(dirname: string, relative: string, options: any): Promise<Array<unknown>> {
        const content = await util.promisify(fs.readFile)(path.resolve(dirname, relative), options);
        return await csv.parse(content.toString());
    }

    /**
     *
     * @param {string} dirname the __dirname variable
     * @param {string} relative relative path to file
     * @param data data to write
     * @param options encoding options
     */
    export async function writeFile(dirname: string, relative: string, data: any, options?: any): Promise<void> {
        await util.promisify(fs.writeFile)(path.resolve(dirname, relative), data, options)
    }

    /**
     *
     * @param {string} dirname the __dirname variable
     * @param {string} relative relative path to file
     * @param data data to write
     * @param csvOptions options for csv generation
     * @param options encoding options
     */
    export async function writeFileAsCSV(dirname: string, relative: string, data: Array<Array<string | number>>,
                                         csvOptions?: CsvAsync.CsvStringifyOptions, options?: any) {
        const stringifies = await csv.stringify(data, csvOptions);
        await util.promisify(fs.writeFile)(path.resolve(dirname, relative), stringifies, options)
    }
}