class CalculatorError extends Error {
    constructor(message?: string) {
        super(message || "An unhandled server error has occurred");
        this.name = this.constructor.name;
    }
}

export default CalculatorError;