import { userActions } from "./user-slice";
import vercel from "../../api/vercel";
import axios from "axios";

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      dispatch(userActions.userRequest());
      const response = await vercel.get(
        `/login-validation?user_email=${username}&user_password=${password}`
      );
      if (!response.data.success) {
        dispatch(userActions.userFail(response.data.message));
        return;
      }

      dispatch(userActions.userSuccess(response.data.userID));
    } catch (err) {
      dispatch(userActions.userFail(err));
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

      const response = await user.post(
        `/register-user?user_first_name=${body.firstname}&user_last_name=${body.lastname}&user_email=${body.username}&user_password=${body.password}`
      );

      if (response.statusText !== "OK" && response.status !== 200) {
        dispatch(userActions.userFail("Failed to Register!"));
        return;
      }

      dispatch(userActions.userSuccess(response.data.userID));
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
