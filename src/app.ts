import express from "express";
import GlavDostavka from "parsers/GlavDostavka/GlavDostavka";
import IRequest from "parsers/types/IRequest";
import Baikalsr from "parsers/Baikalsr/Baikalsr";
import Dellin from "parsers/Dellin/Dellin";

const app: express.Application = express();

app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.listen(3000, function () {
    console.log("App is listening on port 3000!");
});

const request: IRequest = {
    cityFrom: "Санкт-Петербург",
    cityTo: "Москва",
    cargo : {
        length: 1,
        width: 1,
        height: 1,
        weight: 40,
        units: 1
    }
};

//const gv = new GlavDostavka(request);
//gv.calculate().then((res: any) => console.log(res));

//const baikalsr = new Baikalsr(request);
//baikalsr.calculate().then(res => console.log(res));

const dellin = new Dellin(request);
dellin.calculate().then(res => console.log(res));