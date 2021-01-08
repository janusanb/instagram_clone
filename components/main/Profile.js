import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList } from 'react-native' //Flatlist allows for someone to make a grid with 3 coloumns and infinite coloumns

import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Profile(props) { //removed export cause we do it at the bottom
    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)


    useEffect(() => { //Allow one to choose if it is the current user or not. If it is then we will display their profile, but if not then the profile of the user they searched for
        const { currentUser, posts } = props;

        if (props.route.params.uid === firebase.auth().currentUser.uid) {  //we are accessing our own profile
            setUser(currentUser)
            setUserPosts(posts)

        } else { //if the user is NOT currentUser we need to fetch their posts and user information

            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                    }
                    else {
                        console.log('does not exist')
                    }
                })

            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", 'asc')
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {
                            id,
                            ...data
                        }
                    })
                    setUserPosts(posts)

                })

        }

    }, [props.route.params.uid]) //By putting this in the array, we can ensure there is not an infinite lookup, which was a bug that I encountered.

    if (user === null) {
        return <View /> //it might be loading so while it is loading show an empty view
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => {
                        return ( //Adding the return here made the items render: https://stackoverflow.com/questions/58640696/react-native-flatlist-not-showing-images
                            <View style={styles.containerImage}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: item.downloadURL }}
                                />
                            </ View>
                        ) //This could be because I used View or because this newer firebase react requires it

                    }}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    containerInfo: {
        margin: 20
    },

    containerGallery: {
        flex: 1
    },

    containerImage: {
        flex: 1 / 3

    },

    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts
})

export default connect(mapStateToProps, null)(Profile); //we are not calling any actions so null