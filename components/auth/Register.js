import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'
import firebase from 'firebase'
// require('firebase/auth')


export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: ''
        }
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp(){
        const { email, password, name } = this.state; //varaibles placed in curly and they are in another variable you can write this.
        firebase.auth().createUserWithEmailAndPassword(email, password) //Note it is asynchronus
            .then((result) => {
                // The following is without redux
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid) // When user is signed in they can access their profile
                    .set({
                        name,
                        email
                    })
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            })

    }

    render() {
        return (
            <View>
                <TextInput
                    placeholder="name"
                    onChangeText={(name) => this.setState({ name })} //This is what changes the state of the name
                />
                <TextInput
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })} //This is what changes the state of the name
                />
                <TextInput
                    placeholder="password"
                    secureTextEntry = {true}
                    onChangeText={(password) => this.setState({ password })} //This is what changes the state of the name
                />
                <Button
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}

export default Register
