import store from "./store";
import { Provider } from "react-redux";

const CustomProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default CustomProvider;