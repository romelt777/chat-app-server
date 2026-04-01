import admin from "firebase-admin"; //server side firebase library
import { readFileSync } from "fs"; //for reading local firebase credentials
import "dotenv/config";


//reading credential
const serviceAccount = JSON.parse(
    readFileSync("./serviceAccountKey.json", "utf-8")
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

export function getBucket() {
    return admin.storage().bucket();
}