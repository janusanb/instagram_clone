// user (state) variables
import {USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE} from "../constants"

const initialState = {
    currentUser: null,
    posts: []
}

export const user = (state = initialState, action) => {
    //gets data and sends to reducer which will update the state
    switch(action.type){
        case USER_STATE_CHANGE:
            return{
                ...state, // passes initial state
                currentUser: action.currentUser // passed from action
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        default:
            return state //need to have default in JS switches and this will send it back to initialState

    }

}