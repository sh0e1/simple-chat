import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const updateRoomDocument = functions.firestore.document('room/{roomId}/message').onCreate(function (snapshot, context) {
    return admin.firestore().collection('room').doc(context.params.roomId).get().then(function (doc) {
        if (doc.exists) {
            const newMessage = snapshot.data();
            const room = doc.data();
            room['updated_at'] = newMessage['created_at'];
            admin.firestore().collection('room').doc(doc.id).set(room).then(function() {
                console.log('update room document succeeded')
            }).catch(function (error) {
                console.error(error);
            })
        }
    }).catch(function (error) {
        console.error(error);
    })
});
