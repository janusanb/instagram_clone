// user (state) variables

const initialState = {
    currentUser: null //
}

export const user = (state = initialState, action) => {
    //gets data and sends to reducer which will update the state
    return{
        ...state, // passes initial state
        currentUser: action.currentUser // passed from action
    }
}