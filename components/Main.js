import React, { Component } from 'react'
import { Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons' //should be able to use these freely without paying for them

import firebase from 'firebase'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux' //need to bind component to redux and to fetchUser
import { fetchUser, fetchUserPosts } from '../redux/actions/index'

import FeedScreen from './main/Feed'
import SearchScreen from './main/Search'
import ProfileScreen from './main/Profile'

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
    return (null)
}

export class Main extends Component {
    componentDidMount() {
        //call index.js, which uses dispatch to call reducer and update state from our action
        //ultimately updating state of currentuser form what we get in our action
        this.props.fetchUser();
        this.props.fetchUserPosts();
    }
    render() {
        return (
            /*it knows that Feed is the default page but it is niice to have the feed initialized*/
            <Tab.Navigator
                initialRouteName="Feed"
                labeled={false}
            >
                <Tab.Screen name="Feed" component={FeedScreen}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <MaterialCommunityIcons name='home-circle' color={color} size={26} />
                        ),
                    }}
                />
                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <MaterialCommunityIcons name='account-search' color={color} size={26} />
                        ),
                    }}
                />
                {/*when putting in the add button the camera UI will overtake the entire screen*/}
                {/*Need to call it MainAdd because the stack gets confused if it is done this way*/}
                <Tab.Screen name="AddContainer" component={EmptyScreen}
                    /*We are doing this as a trickery because a component must be passed along*/
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault(); //this overrides the original behaviour of having the bottom tab
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <MaterialCommunityIcons name='plus-circle' color={color} size={26} />
                        ),
                    }}
                />
                <Tab.Screen name="Profile" component={ProfileScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault(); //this overrides the original behaviour of having the bottom tab
                            navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
                        }
                    })}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <MaterialCommunityIcons name='account-circle' color={color} size={26} />
                        ),
                    }}
                />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts }, dispatch)//pass object that has function that we want to access

export default connect(mapStateToProps, mapDispatchToProps)(Main);
