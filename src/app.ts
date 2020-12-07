import express from "express";
import "core/ParsersFactory/ParsersStorage";
import "parsers";
import IRequest from "parsers/types/IRequest";
import ParsersManager from "core/ParsersManager";

const app: express.Application = express();



app.listen(8080, function () {
    console.log("App is listening on port 8000");
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

const manager = new ParsersManager(request);
manager.calculate((res: any) => console.log(res));