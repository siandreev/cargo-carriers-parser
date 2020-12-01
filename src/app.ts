import express from "express";
import GlavDostavka from "parsers/GlavDostavka/GlavDostavka";
import IRequest from "parsers/types/IRequest";

const app: express.Application = express();

app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.listen(3000, function () {
    console.log("App is listening on port 3000!");
});

const request: IRequest = {
    cityFrom: "Тула",
    cityTo: "Москва",
    cargo : {
        length: 1,
        width: 1,
        height: 1,
        weight: 40,
        units: 2
    }
};

const gv = new GlavDostavka(request);

gv.calculate().then((res: any) => console.log(res));