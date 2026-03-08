//imports 
import express from "express";
import multer from "multer";

const router: unknown = express.Router();

//patch request, with API name
router.route("/addImages").patch();