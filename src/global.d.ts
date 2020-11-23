declare module NodeJS  {
    interface Global {
        readFile: any,
        writeFile: any
    }
}