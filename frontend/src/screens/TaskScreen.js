import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import vercel from "../api/vercel";
import AddTaskModal from "../components/AddTaskModal";

const TaskScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [addTask, setAddTask] = useState(false);

  const { userID } = useSelector((state) => state.user);

  const getTasks = async () => {
    const response = await vercel.get(`/get-uncompleted-tasks?user_id=${userID}`);

    if (response.data.success) {
      setTasks(response.data.tasks);
    } else {
      setError(response.data.message);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
      <View>
        <TouchableOpacity
          onPress={() => setAddTask(true)}
          style={styles.button}
        >
          <Text style={{ alignSelf: "center" }}>Add a Task</Text>
        </TouchableOpacity>
        <Modal isVisible={addTask} animationIn="fadeIn" animationOut="fadeOut" style={{}} onBackdropPress={() => setAddTask(false)}>
          <AddTaskModal
            onHideModal={() => setAddTask(false)}
            onAddTask={(newTask) =>
              setTasks((prevTasks) => [...prevTasks, newTask])
            }
          />
        </Modal>
        <FlatList
          data={tasks}
          keyExtractor={(task) => task.id}
          renderItem={({ item }) => {
            return (
              <View>
                <Text>{item.name}</Text>
                <Text>{item.estimate_completion_time}</Text>
                <Text>{item.task_due_date}</Text>
              </View>
            );
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    alignSelf: "center",
    marginTop: "20%",
  },
  error: {
    fontSize: 12,
    color: "red",
    marginTop: "3%",
    marginBottom: "5%",
    alignSelf: "center",
  },
  button: {
    width: "45%",
    borderRadius: 24,
    backgroundColor: "white",
    marginTop: "10%",
    alignSelf: "center",
    padding: 8,
  },
});

export default TaskScreen;
