// users.js is the "general" reducer (important for the timeline and getting others posts)
import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from "../constants"

const initialState = {
    users: [], //list containing all of the users
    usersLoaded: 0, //counter of users loaded at the moment

}

export const users = (state = initialState, action) => {
    //gets data and sends to reducer which will update the state
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user] //the elipsis is to say, "save what is already in there"
            }

        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                usersLoaded: state.usersLoaded + 1, //we are incrementing by 1 after we get the post to make sure everything is correct
                users: state.users.map(user => user.uid === action.uid ? //if a user is found with said conditional then we update
                    { ...user, posts: action.posts } : //if a user is found then we attach the post array to the user object that matches the conditional
                    user) // if user is NOT found, then it will ensure the user stays the same without any changes
            }
        default:
            return state

    }

}