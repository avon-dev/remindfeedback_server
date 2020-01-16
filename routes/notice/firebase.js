const admin = require("firebase-admin");
const moment = require('moment');
moment.tz.setDefault("Asia/Seoul");

const serviceAccount = require("../../config/remindfeedback-40186-firebase-adminsdk-k7u8s-a4cc12d6ba.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://remindfeedback-40186.firebaseio.com"
});

const db = admin.firestore();




function test(){
    let docRef = db.collection('notice').doc('alovelace');

    let setAda = docRef.set({
        first: 'Ada',
        last: 'Lovelace',
        born: 1815
    });
}

exports.db = db;

exports.insert = async(sender_uid, type, data, text, receiver_uid) => {
    try{
        let addDoc = db.collection(receiver_uid).add({
            sender_uid,
            type,
            data,
            text,
            confirm: false,
            createAt: admin.firestore.Timestamp.fromDate(new Date())
        })
        return addDoc;
    }catch(e){
        console.error(e);
        return e;
    }
}

exports.read = async(useruid) => {
    let readDoc = await db.collection(useruid);
    return await readDoc.orderBy('createAt', 'desc').get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
        return snapshot;
    })
    .catch(err => {
        console.log('Error getting document', err);
    });
}

exports.update = async(useruid, docID) => {
    let updateDoc = await db.collection(useruid).doc(docID);
    return await updateDoc.update({confirm: true})
}
