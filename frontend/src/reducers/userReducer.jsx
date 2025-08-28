const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload.user;
    case "RESET_USER":
      return null;
    default:
      return state;
  }
};

export const setUserAction = (user) => {
  return {
    type: "SET_USER",
    payload: {
      user,
    },
  };
};

export const resetUserAction = () => {
  return {
    type: "RESET_USER",
  };
};

export default userReducer;
