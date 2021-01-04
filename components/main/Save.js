import React, { useState } from 'react'
import { TextInput, View, Image, Button } from 'react-native';

import firebase from 'firebase'
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props) {
    const [caption, setCaption] = useState("") //Default is empty cause that is viable answer

    const uploadImage = async () => {
        const uri = porps.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`

        const response = await fetch(uri);
        const blob = await response.blob(); //creats blob of URI, which is passed to firestore and allows one to upload image

        const task = firebase
            .storage()
            .ref()
            .child(childPath) //36-base string
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transfered: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted); //when the state is changed we will console log everything

    }
    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: porps.route.params.image }} />
            <TextInput
                placeholder="Write a Caption..."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title="Save" onPress={() => uploadImage()} />
        </View>
    )
}
