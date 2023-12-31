import { browserHistory } from "src/redux/reducers/history";
import ActionTypes from "../../utils/actionTypes";
// import { store } from "src/index";
import adapter from "../adapter";

const REACT_APP_NODE_ENV = process.env.NODE_ENV;

const errorInterceptor = (store) => {
  adapter.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        return browserHistory.push("/500");
      } else if (error.response && error.response.status === 401) {
        const currPath = browserHistory.location.pathname;

        if (
          [
            "/session/forgot-password",
            "/session/reset-password",
            "/session/reset-password/invalid",
            "/login",
          ].includes(currPath)
        ) {
          return error.response;
        } else {
          //   //Unauthorized
          //   //redirect to Login
          // if (store) {
          store.dispatch({ type: ActionTypes.LOGOUT_SUCCESS });
          store.dispatch({
            type: ActionTypes.API_CALL_FAILURE,
            payload: {
              message: error.response.data.result.message,
            },
          });
          // }
          return browserHistory.push("/login");
        }
      } else if (error.response && error.response.status === 500) {
        //Unauthorized
        //redirect to 500 page
        return browserHistory.push("/500");
      } else {
        //dispatch your error in a more user friendly manner
        if (REACT_APP_NODE_ENV !== "production") {
          //easier debugging
          console.group("Error");
          console.log(error);
          console.groupEnd();
        }
        return error.response;
      }
    }
  );
};
export default errorInterceptor;
