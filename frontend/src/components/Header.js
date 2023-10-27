import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

const Header = ({selected, setSelected}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setSelected("Calendar");
        }}
        style={[styles.calendar, selected == "Calendar" ? styles.selected : styles.not_selected]}
      >
        <Text style={selected == "Calendar" ? {color: "white"} : {color: "black"}}>Calendar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSelected("Task List");
        }}
        style={selected == "Task List" ? styles.selected : styles.not_selected}
      >
        <Text style={selected == "Task List" ? {color: "white"} : {color: "black"}}>Task List</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSelected("Tree");
        }}
        style={[styles.tree, selected == "Tree" ? styles.selected : styles.not_selected]}
      >
        <Text style={selected == "Tree" ? {color: "white"} : {color: "black"}}>Tree</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  selected: {
    fontSize: 12,
    backgroundColor: "black",
    flex: 1,
    alignItems:"center",
    justifyContent:"center"
  },
  calendar:{borderBottomLeftRadius:8, borderTopLeftRadius: 8},
  tree:{borderBottomRightRadius:8, borderTopRightRadius: 8},
  not_selected: {
    fontSize: 12,
    backgroundColor: "white",
    color: "white",
    flex: 1,
    alignItems: "center",
    justifyContent:"center"
  },
  container: {
    borderRadius: 12,
    borderWidth: 3,
    width: "65%",
    height: "25%",
    marginTop: "8%",
    alignSelf: "center",
    flexDirection: "row",
  },
});

export default Header;
