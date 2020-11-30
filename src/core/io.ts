import path from "path";
import fs from "fs";
import util from "util";

export default {

    /**
     *
     * @param {string} dirname the __dirname variable
     * @param {string} relative relative path to file
     * @param options encoding options
     */
    readFile: (dirname: string, relative: string, options: any): Promise<Buffer> =>
        util.promisify(fs.readFile)(path.resolve(dirname, relative), options),

    /**
     *
     * @param {string} dirname the __dirname variable
     * @param {string} relative relative path to file
     * @param options encoding options
     */
    readFileAsString: async (dirname: string, relative: string, options: any): Promise<string> => {
        const content = await util.promisify(fs.readFile)(path.resolve(dirname, relative), options);
        return content.toString();
    },

    /**
     *
     * @param {string} dirname the __dirname variable
     * @param {string} relative relative path to file
     * @param options encoding options
     */
    readFileAsJSON: async (dirname: string, relative: string, options: any): Promise<Object> => {
        const content = await util.promisify(fs.readFile)(path.resolve(dirname, relative), options);
        return JSON.parse(content.toString());
    },

    /**
     *
     * @param {string} dirname the __dirname variable
     * @param {string} relative relative path to file
     * @param data data to write
     * @param options encoding options
     */
    writeFile: (dirname: string, relative: string, data: any, options?: any) =>
        util.promisify(fs.writeFile)(path.resolve(dirname, relative), data, options)
}