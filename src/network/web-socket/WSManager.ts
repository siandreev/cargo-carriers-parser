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
                const processingCallback = function(result: IResponse) {
                    ws.send(
                        JSON.stringify(ResponseCreator.stringifyProcessingResponse(result))
                    );
                }
                const doneCallBack = function() {
                    ws.send(
                        JSON.stringify(ResponseCreator.stringifySuccessfulClose())
                    );
                }
                const parsersManager = new ParsersManager(request);
                parsersManager.calculate(processingCallback, doneCallBack);
            } catch (e) {
                if (e instanceof CalculatorError) {
                    ws.close(1000, JSON.stringify(ResponseCreator.stringifyErrorClose(e)));
                } else {
                    console.log(e);
                    ws.close(1000, JSON.stringify(ResponseCreator.stringifyUnexpectedErrorClose()));
                }
            }
        });
    })
}