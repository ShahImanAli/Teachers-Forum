
//request or response hum core node js mai nhi kar rahe hai express mai 
// kar rahe hai aur express humay ApiError.js ke tarhana koi class nhi deta
//toh hum ny apni khud ki class bana li hai taakay hum apnay response ko standardize kar sakay


class ApiResponse { 
    constructor(statusCode, data, message ="Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = this.statusCode < 400;

        //status code 400 sy less hoo b/c api repsonse hai 400 sy upar hoo tou api error
        // sy send hogaa yeh hamara khud ka standard hai

    }
}


export {ApiResponse}