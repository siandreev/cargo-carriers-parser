import express from "express";
import fs from "fs";
import util from "util";

global.readFile = util.promisify(fs.readFile);
global.writeFile = util.promisify(fs.writeFile);

const app: express.Application = express();

app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.listen(3000, function () {
    console.log("App is listening on port 3000!");
});
