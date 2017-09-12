//////////////////////////////
///  yichen

class ArgumentError extends Error {
    constructor(argumentName, message = undefined) {
        super(message);
        this.argumentName = argumentName;
    }
};

class ArgumentNullError extends ArgumentError {
    constructor(argumentName, message = undefined) {
        super(argumentName, message);
    }
};

class ExtendTypeError extends TypeError {
    constructor(message = undefined) {
        super(message);
    }
};

module.exports = { ArgumentError, ArgumentNullError, ExtendTypeError };