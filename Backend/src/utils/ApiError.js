//API ky error ko standardize karnay ky liye likha hai
// neeche wala code taakay error jis tahana jaa rahe hai usko
// control kar sakay which is in asyncHandler.js file (APPROACH 2)

// node js aik class daita hai jo hai error class (search on Google using "node js api error")

class ApiError extends Error {
    constructor(
        statusCode,
        message = 'Something went wrong',
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        }else {
            Error.captureStackTrace(this, this.constructor);
        }
    }       
    
}

export { ApiError };