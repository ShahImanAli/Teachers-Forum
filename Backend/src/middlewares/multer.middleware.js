//multer ka use kar kay middleware banaye gaye means jahan jahan file upload
// karni ho wahan ye middleware use kar sakte hain

// multer ke docs github pr hai in readme file


import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})
 