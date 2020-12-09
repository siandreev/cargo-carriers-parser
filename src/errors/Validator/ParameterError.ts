import ValidationError from "./ValidationError";

class ParameterError extends ValidationError {
    constructor(parameter: string, message: string) {
        super(`Incorrect request parameter "${parameter}". ${message}`);
    }
}

export default ParameterError;