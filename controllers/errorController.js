const errorController = {}

errorController.get500 = (req, res, next) => {
    const error = new Error('Intentional Server Error');
    error.status = 500;
    next(error);
}

module.exports = errorController;