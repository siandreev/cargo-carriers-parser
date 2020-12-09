import ValidationError from "./ValidationError";

class ParseError extends ValidationError {
    constructor(message?: string) {
        super(message || "Incorrect input parameters format");
    }
}

export default ParseError;