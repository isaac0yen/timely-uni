import { jwtDecode } from "jwt-decode";
import Session from "./Session";

const isLoggedIn = () => {
  const token = Session.getCookie("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      Session.removeCookie("token");
      return false;
    }
    return decodedToken;
  }
  return false;
};
export default isLoggedIn;