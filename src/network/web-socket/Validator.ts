import {IRequest, ICargo} from "types";
import round from "libs/round";
import {ParameterError, ParseError} from "errors/Validator";
import KeysEnum from "types/KeysEnum";


export namespace Validator {
    export function validate(request: string): IRequest {
        let parsed;
        try {
            parsed = JSON.parse(request) as IRequest;
        } catch {
            throw new ParseError();
        }

        return castProperties(parsed as IRequest);
    }

    function castProperties(request: IRequest): IRequest {
        request = {...request, cargo: {...request.cargo}};

        const checkOwnPropertyExists = (obj: any, property: string): void => {
            if (!obj.hasOwnProperty(property)) {
                throw new ParameterError(property, property + " is undefined");
            }
        }

        const IRequestKeys: KeysEnum<IRequest> = {
            cityTo: true,
            cityFrom: true,
            cargo: true
        };
        const ICargoKeys: KeysEnum<ICargo> = {
            length: true,
            width: true,
            height: true,
            weight: true,
            units: true,
            volume: true
        };

        Object.keys(IRequestKeys).forEach(key => checkOwnPropertyExists(request, key));
        Object.keys(ICargoKeys).filter(el => el !== "volume").forEach(key => checkOwnPropertyExists(request.cargo, key));

        request.cityTo = String(request.cityTo);
        request.cityFrom = String(request.cityFrom);

        request.cargo.units = parseInt(request.cargo.units as any);
        if (!isFinite(request.cargo.units) || request.cargo.units < 1) {
            throw new ParameterError("units", "units must be positive integer >= 1");
        }

        request.cargo.length = round(request.cargo.length);
        if (!isFinite(request.cargo.length) || request.cargo.length <= 0) {
            throw new ParameterError("length", "length must be positive float > 0");
        }

        request.cargo.width = round(request.cargo.width);
        if (!isFinite(request.cargo.width) || request.cargo.width <= 0) {
            throw new ParameterError("width", "width must be positive float > 0");
        }

        request.cargo.height = round(request.cargo.height);
        if (!isFinite(request.cargo.height) || request.cargo.height <= 0) {
            throw new ParameterError("height", "height must be positive float > 0");
        }

        request.cargo.weight = round(request.cargo.weight);
        if (!isFinite(request.cargo.weight) || request.cargo.weight <= 0) {
            throw new ParameterError("weight", "weight must be positive float > 0");
        }

        return request;
    }
}