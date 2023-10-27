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
import DateSelection from "../components/DateSelection";
import { Swipeable } from "react-native-gesture-handler";

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
  }, [date]);

  return (
    <View style={styles.container}>
      <DateSelection date={date} onSetDate={setDate} />
      <FlatList
        data={tasks}
        keyExtractor={(task) => task.event_block_id}
        style={styles.tasklist}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.task_id) {
            return (
              <View style={[styles.block]}>
                <Text style={styles.title}>{item.event_name}</Text>
                <Text style={[styles.task_time]}>
                  {item.event_start_time} - {item.event_end_time}
                </Text>
              </View>
            );
          }
          return (
            <View style={[styles.block, styles.event]}>
              <Text style={[styles.title, {color: "white"}]}>{item.event_name}</Text>
              <Text style={styles.event_time}>
                {item.event_start_time} - {item.event_end_time}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  tasklist: { height: "65%", flexGrow: 0, marginTop: "5%", width: "67%" },
  block: {
    marginTop: "10%",
    padding: "7%",
    borderWidth: 3,
    borderRadius: 16,
    alignItems: "center",
  },
  task_time: {
    borderRadius: 12,
    borderWidth: 1,
    padding: "2%",
    marginTop: "5%",
  },
  title: {fontSize: 18},
  event: { backgroundColor: "black"},
  event_time: {marginTop: "5%", color: "white"}
});

export default CalendarScreen;
