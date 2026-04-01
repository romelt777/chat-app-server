import admin from "firebase-admin"; //server side firebase library
import { readFileSync } from "fs"; //for reading local firebase credentials
import "dotenv/config";


//reading credential
const serviceAccount = JSON.parse(
    readFileSync("./whatsapp-clone-c356a-firebase-adminsdk-fbsvc-bce532ba4c.json", "utf-8")
);

let bucketName: string = "";
if (process.env.FIREBASE_STORAGE_BUCKET) {
    bucketName = process.env.FIREBASE_STORAGE_BUCKET;
}

//intializing with account credentiall, and bucket name
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketName,
})

//bucket for images
export function getBucket() {
    return admin.storage().bucket();
}

//storage for messge
export function getFireStore() {
    return admin.firestore();
}
