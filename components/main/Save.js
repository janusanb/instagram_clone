import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import firebase from 'firebase'
// require("firebase/firestore")
// require("firebase/firebase-storage")
// require('firebase/auth')

export default function Save(props) {
    const auth = firebase.auth().currentUser.uid

    const [caption, setCaption] = useState("") //Default is empty cause that is viable answer

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childpath = `posts/${auth}/${Math.random().toString(36)}`;  //36-base string
        console.log(childpath)

        const response = await fetch(uri);
        const blob = await response.blob(); //creats blob of URI, which is passed to firestore and allows one to upload image

        const task = firebase
            .storage()
            .ref()
            .child(childpath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)

        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot)
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted); //when the state is changed we will console log everything

    }

    const savePostData = (downloadURL) => {
        //There were issues with the firestore but once it was made it easily added the user, 
        //I am worried that it will not make it for another user

        firebase.firestore()
            .collection("posts")
            .doc(auth)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.popToTop()
            }))

    }

    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: 'props.route.params.image' }} />
            {/* Have to be in quotes ^ */}
            <TextInput
                placeholder="Write a Caption..."
                onChangeText={(caption) => setCaption(caption)}
            />

            <Button title="Save" onPress={() => uploadImage()} />
        </View>
    )
}
