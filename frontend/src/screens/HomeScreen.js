import React from "react";
import { Text, StyleSheet, View } from "react-native";
import Header from "../components/Header";
import TaskScreen from "./TaskScreen";

const HomeScreen = () => {
  const [selected, setSelected] = useState("Task List");
  return (
    <View>
      <Header selected={selected} setSelected={setSelected} />
      {selected === "Task List" && <TaskScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
});

export default HomeScreen;
