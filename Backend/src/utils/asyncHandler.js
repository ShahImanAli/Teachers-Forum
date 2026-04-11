
//wrapper function using promise (db sy baat karnay k lye aik wrapper takay reuse kar sakay everytime)

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error)=>next(error));
    }

}

export { asyncHandler }





// APPROACH 2

//wrapper function using try catch 

// const asyncHandler = (fn) => async (err, req, res, next) => { 
//     try {
//         await fn(req, res, next)
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         });
        
//     }
// }