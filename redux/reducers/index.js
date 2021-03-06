// reducers store the state of application and desired pure functions

// Multiple files for reducers means it needs to be combined in index.js
import { combineReducers } from 'redux'
import { user } from './user'
import { users } from './users'

const Reducers = combineReducers({
    userState: user,
    usersState: users

})

export default Reducers // so store can access these variables 