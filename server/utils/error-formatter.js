module.exports = (errors) => {
    const extractedErrors = {};
    errors.array({ onlyFirstError: true }).map(err => extractedErrors[err.param] = err.msg);
    return extractedErrors;
}