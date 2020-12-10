import expressWs from "express-ws";
import {Validator} from "./Validator";
import {ResponseCreator} from "./ResponseCreator";
import CalculatorError from "errors/CalculatorError";
import {IRequest, IResponse} from "types";
import ParsersManager from "core/ParsersManager";

export default function(app: expressWs.Application) {
    app.ws("/", (ws) => {
        ws.on('message', msg => {
            try {
                const request: IRequest =  Validator.validate(String(msg));
                const callback = function(result: IResponse) {
                    ws.send(
                        JSON.stringify(ResponseCreator.stringifyProcessingResponse(result))
                    );
                }
                const parsersManager = new ParsersManager(request);
                parsersManager.calculate(callback).then(() =>
                    ws.send(
                        JSON.stringify(ResponseCreator.stringifySuccessfulClose())
                    )
                )
            } catch (e) {
                if (e instanceof CalculatorError) {
                    ws.send(JSON.stringify(ResponseCreator.stringifyErrorClose(e)));
                } else {
                    console.log(e);
                    ws.send(JSON.stringify(ResponseCreator.stringifyUnexpectedErrorClose()));
                }
                ws.close(1000);
            }
        });
    })
}