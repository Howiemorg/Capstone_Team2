import React from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import vercel from "../api/vercel";

const CalendarScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date());

  const { userID } = useSelector((state) => state.user);

  const getTasks = async () => {
    const response = await vercel.get(
      `/get-events?user_id=${1}&event_date=${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`
    );

    setTasks(response.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <View>
      <Text>Calendar View</Text>
      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => {
          return (
            <View>
              {item.task_id ? (
                <View>
                  <Text>{item.name}</Text>
                  <Text>{item.estimate_completion_time}</Text>
                  <Text>{item.task_due_date}</Text>
                </View>
              ) : (
                <View>
                  <Text>{item.name}</Text>
                  <Text>{item.estimate_completion_time}</Text>
                  <Text>{item.task_due_date}</Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
  tasklist: { alignItems: "center", alignSelf: "center" },
});

export default CalendarScreen;
