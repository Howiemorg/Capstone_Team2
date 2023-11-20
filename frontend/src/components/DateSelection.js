import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

const DateSelection = ({ date, onSetDate }) => {
  // const numDaysInMonth = new Date(temp.y, temp.m + 1, 0).getDate()
  const today = new Date();
  const sunday = new Date(today.setDate(today.getDate() - today.getDay()));
  if(sunday.getDate() > today.getDate()){
    sunday.setMonth(today.getMonth() - 1);
  }
  const monday = new Date();
  monday.setMonth(sunday.getMonth());
  monday.setDate(sunday.getDate() + 1);
  if(monday.getDate() < sunday.getDate()){
    monday.setMonth(sunday.getMonth() + 1);
  }
  const tuesday = new Date();
  tuesday.setMonth(sunday.getMonth());
  tuesday.setDate(sunday.getDate() + 2);
  if(tuesday.getDate() < sunday.getDate()){
    tuesday.setMonth(sunday.getMonth() + 1);
  }
  const wednesday = new Date();
  wednesday.setMonth(sunday.getMonth());
  wednesday.setDate(sunday.getDate() + 3);
  if(wednesday.getDate() < sunday.getDate()){
    wednesday.setMonth(sunday.getMonth() + 1);
  }
  const thursday = new Date();
  thursday.setMonth(sunday.getMonth());
  thursday.setDate(sunday.getDate() + 4);
  if(thursday.getDate() < sunday.getDate()){
    thursday.setMonth(sunday.getMonth() + 1);
  }
  const friday = new Date();
  friday.setMonth(sunday.getMonth())
  friday.setDate(sunday.getDate() + 5);
  if(friday.getDate() < sunday.getDate()){
    friday.setMonth(sunday.getMonth() + 1);
  }
  const saturday = new Date();
  saturday.setMonth(sunday.getMonth());
  saturday.setDate(sunday.getDate() + 6);
  if(saturday.getDate() < sunday.getDate()){
    saturday.setMonth(sunday.getMonth() + 1);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          onSetDate(sunday);
        }}
        style={[
          date.toDateString() == sunday.toDateString()
            ? styles.selected
            : styles.not_selected,
        ]}
      >
        <Text
          style={[
            { marginRight: 2 },
            date.toDateString() == sunday.toDateString()
              ? { color: "white" }
              : { color: "black" },
          ]}
        >
          SU
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onSetDate(monday);
        }}
        style={[
          { marginHorizontal: 2 },
          date.toDateString() == monday.toDateString()
            ? styles.selected
            : styles.not_selected,
        ]}
      >
        <Text
          style={
            date.toDateString() == monday.toDateString()
              ? { color: "white" }
              : { color: "black" }
          }
        >
          M
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onSetDate(tuesday);
        }}
        style={[
          { marginHorizontal: 2 },
          date.toDateString() == tuesday.toDateString()
            ? styles.selected
            : styles.not_selected,
        ]}
      >
        <Text
          style={
            date.toDateString() == tuesday.toDateString()
              ? { color: "white" }
              : { color: "black" }
          }
        >
          TU
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onSetDate(wednesday);
        }}
        style={[
          { marginHorizontal: 2 },
          date.toDateString() == wednesday.toDateString()
            ? styles.selected
            : styles.not_selected,
        ]}
      >
        <Text
          style={
            date.toDateString() == wednesday.toDateString()
              ? { color: "white" }
              : { color: "black" }
          }
        >
          W
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onSetDate(thursday);
        }}
        style={[
          { marginHorizontal: 2 },
          date.toDateString() == thursday.toDateString()
            ? styles.selected
            : styles.not_selected,
        ]}
      >
        <Text
          style={
            date.toDateString() == thursday.toDateString()
              ? { color: "white" }
              : { color: "black" }
          }
        >
          TH
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onSetDate(friday);
        }}
        style={[
          { marginHorizontal: 2 },
          date.toDateString() == friday.toDateString()
            ? styles.selected
            : styles.not_selected,
        ]}
      >
        <Text
          style={
            date.toDateString() == friday.toDateString()
              ? { color: "white" }
              : { color: "black" }
          }
        >
          F
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onSetDate(saturday);
        }}
        style={[
          { marginLeft: 2 },
          date.toDateString() == saturday.toDateString()
            ? styles.selected
            : styles.not_selected,
        ]}
      >
        <Text
          style={
            date.toDateString() == saturday.toDateString()
              ? { color: "white" }
              : { color: "black" }
          }
        >
          SA
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  selected: {
    fontSize: 12,
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  not_selected: {
    fontSize: 12,
    backgroundColor: "white",
    borderRadius: 50,
    color: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    borderRadius: 20,
    borderWidth: 3,
    width: "65%",
    height: "5%",
    marginTop: "8%",
    alignSelf: "center",
    flexDirection: "row",
  },
});

export default DateSelection;
