//imports 
import express from "express";
import type { Request, Response } from "express";
import multer from "multer";
import { getBucket, getFireStore } from "./firebase.js";




//memory storage will keeofile in memory as buffer
const upload = multer({
    storage: multer.memoryStorage()
})


const router = express.Router();

//post request, with API name, thsis will be same endpoint to call in flutter
//img is a key
router.route("/addImages").post(upload.single("img"), async (req: Request, res: Response) => {
    //return response to flutter app
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file received" });
        }

        //firebase
        const bucket = getBucket();
        const fileName = `images/${Date.now()}.jpg`
        const file = bucket.file(fileName);

        //save the file buffer directly to firebase storage
        await file.save(req.file.buffer, {
            metadata: { contentType: "image/jpg" },
        });

        //make file publically accessible
        await file.makePublic();

        //constructing the public url
        const publicUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;


        return res.json({ path: publicUrl }); // returning path of image to flutter
    }
    catch (e) {
        //e is unknown and can be many types, check if error object before using
        const error = e instanceof Error ? e.message : "Unknown Error";
        return res.json({ error: error });
    }
});

router.get("/messages/:chatId", async (req: Request, res: Response) => {
    const chatId = req.params.chatId;


    try {

        const db = getFireStore();

        //getting snapshot of firebase DB
        const messagesSnap = await db
            .collection("messages")
            .where("chatId", "==", chatId) //only this chat
            .orderBy("createdAt", "asc") //oldest first
            .get();

        console.log("rom here" + chatId);


        const userId = Number(req.query.userId);

        //creating messages object to return to front end
        const messages = messagesSnap.docs.map(doc => {
            const data = doc.data();
            return {
                type: data.senderId === userId ? "source" : "destination",
                message: data.text,
                time: data.createdAt?.toDate().toISOString().substring(11, 16) || "", //HH:mm
                path: data.imageUrl || null,
            };
        });

        console.log("Messages found:", messages.length);
        console.log(messages);


        //send the messages to flutter
        res.json({ messages });
    } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Unknown Error" });
    }
})

//exporting
export default router; 