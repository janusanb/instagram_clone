import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import React, { Component } from 'react'

import firebase from 'firebase/app'
require('firebase/auth')

const firebaseConfig = {
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY, //Use enviromental variables to hide APIKey
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
};

import { Provider } from 'react-redux' //is a tag that engulfs compoenents and everything in app
import { createStore, applyMiddleware } from 'redux' //boilerplate and needs to be added to all redux-based projects
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk' // allows use of dispatch funciton, simplifying the process

const store = createStore(rootReducer, applyMiddleware(thunk))

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'

import LandingScreen from "./components/auth/Landing"
import RegisterScreen from "./components/auth/Register"
import LoginScreen from "./components/auth/Login"
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'

const Stack = createStackNavigator();

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }

    componentDidMount() { //in specific mount moments
        // When componenent actually mounts
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.setState({
                    loggedIn: false,
                    loaded: true,
                })
            } else {
                this.setState({
                    loggedIn: true,
                    loaded: true,
                })
            }
        })

    }
    render() {
        const { loggedIn, loaded } = this.state;
        if (!loaded) {
            return ( <
                View style = {
                    { flex: 1, justifyContent: 'center' }
                } >
                <
                Text > Loading < /Text> < /
                View >
            )
        }
        if (!loggedIn) {
            return ( <
                NavigationContainer >
                <
                Stack.Navigator initialRouteName = "Landing" >
                <
                Stack.Screen name = "Landing"
                component = { LandingScreen } > < /Stack.Screen> <
                Stack.Screen name = "Register"
                component = { RegisterScreen }
                /> <
                Stack.Screen name = "Login"
                component = { LoginScreen }
                /> < /
                Stack.Navigator > <
                /NavigationContainer>
            );
        }

        return (
            // this is the only way of accessing redux
            // main screen in a stack is done so when taking a picture in instagram sends user to differnt screen
            <
            Provider store = { store } >
            <
            NavigationContainer >
            <
            Stack.Navigator initialRouteName = "Landing" >
            <
            Stack.Screen name = "Main"
            component = { MainScreen }
            /> <
            Stack.Screen name = "Add"
            component = { AddScreen }
            navigation = { this.props.navigation }
            /> <
            Stack.Screen name = "Save"
            component = { SaveScreen }
            navigation = { this.props.navigation }
            /> < /
            Stack.Navigator > <
            /NavigationContainer> < /
            Provider >

        )
    }
}

export default App