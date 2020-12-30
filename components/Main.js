import React, { Component } from 'react'
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { connect } from 'react-redux'
import { bindActionCreators } from 'redux' //need to bind component to redux and to fetchUser
import {fetchUser} from '../redux/actions/index'

const Tab = createBottomTabNavigator();

export class Main extends Component {
    componentDidMount(){
        //call index.js, which uses dispatch to call reducer and update state from our action
        //ultimately updating state of currentuser form what we get in our action
        this.props.fetchUser();
    }
    render() {
        return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)//pass object that has function that we want to access

export default connect(mapStateToProps, mapDispatchToProps)(Main);
