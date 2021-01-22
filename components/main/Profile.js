import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native' //Flatlist allows for someone to make a grid with 3 coloumns and infinite coloumns

import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Profile(props) { //removed export cause we do it at the bottom
    const [userPosts, setUserPosts] = useState([]) //This is called a hook
    const [user, setUser] = useState(null)
    const [following, setFollowing] = useState(false)


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

        if (props.following.indexOf(props.route.params.uid) > -1) { //this if will check the index of props.uid and that means this string is inside the array following
            setFollowing(true);
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following]) //By putting this in the array, we can ensure there is not an infinite lookup, which was a bug that I encountered.
    //But this feature in JS is to ensure this is the only time onEffect is called, uid change or following change in this case

    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({}) //Pasting an empty object is enough to have an empty document
    }

    const onUnFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete() //Pasting an empty object is enough to have an empty document
    }

    const onLogout = () => {
        firebase.auth().signOut();
    }

    if (user === null) {
        return <View /> //it might be loading so while it is loading show an empty view
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <Button
                                title="Following"
                                onPress={() => onUnFollow()}
                            />
                        ) :
                            (
                                <Button
                                    title="Follow"
                                    onPress={() => onFollow()}
                                />
                            )}
                        {/* The above is a conditional where the button will change depending on if the user is following or not. But it only appears if the user is not the currentUser. */}
                    </View>

                ) :
                    <Button
                        title="LogOut"
                        onPress={() => onLogout()}
                    />}
                {/* conditional render of the button, by using the the ? mark notation in this way we are using conditional statements */}
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
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile); //we are not calling any actions so null