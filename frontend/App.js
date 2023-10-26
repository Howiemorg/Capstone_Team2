import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import LoginScreen from "./src/screens/LoginScreen";
import TaskScreen from "./src/screens/TaskScreen"
import { createAppContainer } from "react-navigation";
import CustomProvider from "./src/store/provider";

const Stack = createStackNavigator(
  {
    Home: HomeScreen,
    SignUp: SignUpScreen,
    Login: LoginScreen,
    Task: TaskScreen,
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      title: "App",
    },
  }
);

const App = createAppContainer(Stack);

export default () => {
  return (
    <CustomProvider>
      <App />
    </CustomProvider>
  );
};
