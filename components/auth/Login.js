import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'

import firebase from 'firebase'


export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp(){
        const { email, password } = this.state; //varaibles placed in curly and they are in another variable you can write this.
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
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
                    title="Sign In"
                />
            </View>
        )
    }
}

export default Login
