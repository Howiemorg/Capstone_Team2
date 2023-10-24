import { userActions } from "./user-slice";
import user from "../../api/user";
import axios from "axios";

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      dispatch(userActions.userRequest());
      console.log("here")
      const response = await axios.get(`http://10.229.175.240:3000/login-info?user_email=${username}&user_password=${password}`);
      console.log(response)
      if (response.status !== 200 && response.statusText !== 'OK') {
        if (response.status === 401)
          dispatch(userActions.userFail("Incorrect Username/Password!"));
        else {
          dispatch(userActions.userFail("Failed to Login!"));
        }
        return;
      }

      dispatch(userActions.userSuccess(response.data));
    } catch (err) {
      dispatch(
        userActions.userFail(
          err.response && err.response.data.detail
            ? err.response.data.detail
            : err.message
        )
      );
    }
  };
};

export const signup = (body) => {
  return async (dispatch) => {
    if (body.password.trim().length < 8) {
      dispatch(userActions.userFail("Password must be 8 characters"));
      return;
    }

    try {
      dispatch(userActions.userRequest());

      const response = await user.post("/signup", body);

      if (response.statusText !== 'OK' && response.status !== 200) {
        dispatch(userActions.userFail("Failed to Register!"));
        return;
      }

      dispatch(userActions.userSuccess(response.data));
    } catch (err) {
      dispatch(userActions.userFail(err));
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch(userActions.userLogout());
  };
};