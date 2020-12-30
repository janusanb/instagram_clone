// Action will fetch something from firestore and triggers a reducer
// make a call to fetch, save and post from user

import { USER_STATE_CHANGE } from '../constants/index'
import firebase from 'firebase'

export function fetchUser(){ // we must export it so our front end can trigger front-end database action
    return((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid) // get call to firestore and get a dispatch
            .get()
            .then((snapshot) => {
                if(snapshot.exists){ //when we see snapshot exists then we will get state and which is current user
                    dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()}) // updates currentUsers state
                }
                else {
                    console.log('does not exist') //this means user is not in the database
                }
            })
    })
}