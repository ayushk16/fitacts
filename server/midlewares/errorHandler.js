const errorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "something went wrong";
    res.status(error.statusCode).json({
        status: error.status,
        message: "something went wrong"
    })
    console.log(error);
}

export default errorHandler;