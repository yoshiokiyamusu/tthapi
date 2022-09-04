const errorHandler = (err, req, res, next) =>{
    let error = { ...err };
    console.log(err.stack.red);

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;