import {IWSDoneResponse, IWSProcessingResponse, WSResultType, WSStatus} from "network/web-socket/IWS";
import IResponse from "types/IResponse";
import CalculatorError from "errors/CalculatorError";

export namespace ResponseCreator {
    export function stringifyProcessingResponse(parserResponses: IResponse): IWSProcessingResponse {
        return {
            status: WSStatus.PROCESSING,
            result: parserResponses
        }
    }

    export function stringifySuccessfulClose(): IWSDoneResponse {
        return {
            status: WSStatus.DONE,
            result: {
                type: WSResultType.SUCCESS
            }
        }
    }

    export function stringifyUnexpectedErrorClose(): IWSDoneResponse {
        return {
            status: WSStatus.DONE,
            result: {
                type: WSResultType.ERROR,
                description: "An unhandled server error has occurred"
            }
        }
    }

    export function stringifyErrorClose(error: CalculatorError): IWSDoneResponse {
        return {
            status: WSStatus.DONE,
            result: {
                type: WSResultType.ERROR,
                description: error.toString()
            }
        }
    }
}