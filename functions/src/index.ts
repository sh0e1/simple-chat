import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const updateRoomDocument = functions.firestore.document('rooms/{roomId}/messages/{messageId}').onCreate((snapshot, context) => {
    return admin.firestore().collection('rooms').doc(context.params.roomId).get().then((doc) => {
        console.log(doc)
        const room = doc.data();
        console.log(room)
        room['updated_at'] = snapshot.get('created_at');
        return admin.firestore().collection('rooms').doc(doc.id).set(room).then(() => {
            console.log('succeeded update room');
        }).catch((error) => { console.log(error); });
    }).catch((error) => { console.log(error);  });
});
