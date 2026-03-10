//imports 
import express from "express";
import type { Request, Response } from "express";
import multer from "multer";

//file will be uploaded from flutter
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads"); //destination where to store image
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".jpg"); //timestampvalue.jpg, this will be file name 
    }
})


//storage must be provided to multer
const upload = multer({
    storage: storage
})


const router = express.Router();

//post request, with API name, thsis will be same endpoint to call in flutter
//img is a key
router.route("/addImages").post(upload.single("img"), (req: Request, res: Response) => {
    //return response to flutter app
    try {
        res.json({ path: req.file?.filename }); // returning path of image to flutter
    }
    catch (e) {
        return res.json({ error: e });
    }
});

//exporting
export default router; 