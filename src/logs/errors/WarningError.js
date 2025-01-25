class WarningError extends Error {
    constructor(message) {
        super(message);

        this.name = "WarnningError";
    }
}

module.exports = WarningError;