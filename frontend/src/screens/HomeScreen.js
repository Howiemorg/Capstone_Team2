import React from "react";
import { Text, StyleSheet, View } from "react-native";
import Header from "../components/Header";
import TaskScreen from "./TaskScreen";
import { useState } from "react";
import CalendarScreen from "./CalendarScreen";
// import UserProfileScreen from "./UserProfileScreen";

const HomeScreen = () => {
  const [selected, setSelected] = useState("Calendar");
  return (
    <View style={{flex: 1}}>
      <Header selected={selected} setSelected={setSelected} />
      {selected === "Calendar" && <CalendarScreen />}
      {selected === "Task List" && <TaskScreen setSelected={setSelected}/>}
      {/*{selected === "Profile" && <UserProfileScreen />}  */}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
});

export default HomeScreen;
