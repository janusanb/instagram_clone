// Action will fetch something from firestore and triggers a reducer
// make a call to fetch, save and post from user

import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from '../constants/index'
import firebase from 'firebase'

export function fetchUser() { // we must export it so our front end can trigger front-end database action
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid) // get call to firestore and get a dispatch
            .get()
            .then((snapshot) => {
                if (snapshot.exists) { //when we see snapshot exists then we will get state and which is current user
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() }) // updates currentUsers state
                }
                else {
                    console.log('does not exist') //this means user is not in the database
                }
            })
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts") // fetches everything inside
            .orderBy("creation", 'asc') // order the posts from oldest to recent date
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    // map iterates through all docs and able to build array with the posts
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        id,
                        ...data
                    }
                })
                dispatch({ type: USER_POSTS_STATE_CHANGE, posts }) // when updating the variable with the same name JS cleans it up and returns the correct elements, etc.
            })
    })
}

export function fetchUserFollowing() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => { //onSnapshot is a listener and any time the database changes this function will be triggered and get the most updated list.
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following })
                for (let i = 0; i < following.length; i++) {
                    // dispath is used to call a function in redux
                    dispatch(fetchUsersData(following[i])); //we are dispatching to get the users following array and then dispath fetchUserData to get those users information
                    //running this function for every user
                }
            })
    })
}

export function fetchUsersData(uid) {
    return ((dispatch, getState) => { //getState gives you the state of the redux Store at the moment, where we can get the users following
        const found = getState().usersState.users.some(el => el.uid === uid); //this function tries to see if the "element = el" that was passed along exists within the general "users" array, returning true or false
        if (!found) {
            firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        let user = snapshot.data();
                        user.uid = snapshot.id; //this way we get the full object and the uid is connected the user
                        
                        dispatch({ type: USERS_DATA_STATE_CHANGE, user });
                        dispatch(fetchUsersFollowingPosts(uid));

                    }
                    else {
                        console.log('does not exist')
                    }
                })
        }

    })
}

export function fetchUsersFollowingPosts(uid) {
    // due to the asynchronos nature we lose the uid after the following query, 
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", 'asc')
            .get()
            .then((snapshot) => {
                const uid = snapshot.query.EP.path.segments[1]; //to save the UID, one must look at the logs itself, and looking at the snapshot finds the following path to get the UID
                //console.log({ snapshot, uid })
                const user = getState().usersState.users.find(el => el.uid === uid); //find gives the user id that is inside instead of true or false, that some gives you

                let posts = snapshot.docs.map(doc => {
                    // map iterates through all docs and able to build array with the posts
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        id,
                        ...data,
                        user //we are able to access the post data within our list so we can chronologically order it as well as display the users name

                    }
                })
                console.log(posts)
                dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid }) // when updating the variable with the same name JS cleans it up and returns the correct elements, etc.
                console.log(getState())
            })
    })
}