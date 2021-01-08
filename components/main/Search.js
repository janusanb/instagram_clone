import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native' //Text to search and list to show results, TouchableOpacity allows for someone to hit a "Text input"

import firebase from 'firebase'
require('firebase/firestore')

export default function Search(props) { //pass props to use navigation
    const [users, setUsers] = useState([]) //Note it is an array  

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search) //Name is equal to has more characters than the search string, this should be replaced with a ML technique
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    // map iterates through all docs and able to build array with the posts
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        id,
                        ...data
                    }
                });
                setUsers(users);

            })
    }
    return (
        <View>
            <TextInput
                placeholder="Type Here..."
                onChangeText={(search) => fetchUsers(search)} />
            {/* //when user alters the text fetchUser will be called */}
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => (props.navigation.navigate("Profile", { uid: item.id }))}>
                        {/* //Profile needs to know which uid to pass along correct information */}
                        <Text>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />

        </View>
    )
}
