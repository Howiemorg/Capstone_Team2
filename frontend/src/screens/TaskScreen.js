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
// import CheckBox from "@react-native-community/checkbox";
import CheckBox from "expo-checkbox";

const TaskScreen = ({ setSelected }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [addTask, setAddTask] = useState(false);
  const [generateTasks, setGeneratetasks] = useState([]);

  const { userID } = useSelector((state) => state.user);

  const getTasks = async () => {
    const response = await vercel.get(`/get-uncompleted-tasks?user_id=${1}`);

    if (response.data) {
      setTasks(response.data);
    } else {
      setError("No data");
    }

    setGeneratetasks(
      response.data.reduce((accumalator, currentVal) => {
        const date = new Date(currentVal.task_due_date.substring(0, 10));
        if (dueThisWeek(date)) {
          accumalator.push(currentVal);
        }
        return accumalator;
      }, [])
    );
  };

  const dueThisWeek = (date) => {
    const today = new Date();
    const end_of_saturday = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );
    end_of_saturday.setHours(23);
    end_of_saturday.setMinutes(59);
    end_of_saturday.setSeconds(59);
    return date <= end_of_saturday;
  };

  const isChecked = (task) => {
    return generateTasks.includes(task);
  };

  const toggleChecked = (task) => {
    if (isChecked(task)) {
      setGeneratetasks((prevTasks) => prevTasks.filter((item) => item != task));
    } else {
      setGeneratetasks((prevTasks) => [...prevTasks, task]);
    }
  };

  const generateSchedule = async () => {
    // const response = await vercel.post(`/generate-schedule?user_id=${userID}&tasks=${generateTasks}`)

    // if (response.data.success) {
    setSelected("Calendar");
    // } else {
    //   setError(response.data.message);
    // }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setAddTask(true)} style={styles.button}>
        <Text style={{ alignSelf: "center", color: "white" }}>Add a Task</Text>
      </TouchableOpacity>
      <Modal
        isVisible={addTask}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{}}
        onBackdropPress={() => setAddTask(false)}
      >
        <AddTaskModal
          onHideModal={() => setAddTask(false)}
          onAddTask={() => getTasks()}
        />
      </Modal>
      <FlatList
        style={styles.tasklist}
        data={tasks}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        keyExtractor={(task) => task.task_id}
        renderItem={({ item }) => {
          const date = new Date(item.task_due_date.substring(0, 10));
          date.setDate(date.getDate() + 1);
          date.setHours(item.task_due_date.substring(11, 13));
          date.setMinutes(item.task_due_date.substring(14, 16));
          date.setSeconds(item.task_due_date.substring(17, 19));

          if (dueThisWeek(date)) {
            console.log(item.task_name)
            console.log(item.priority_level)
            return (
              <View
                style={[
                  styles.task,
                  item.priority_level === 1
                    ? { backgroundColor: "lightgreen" }
                    : item.priority_level === 2
                    ? { backgroundColor: "skyblue" }
                    : item.priority_level === 3
                    ? { backgroundColor: "orange" }
                    : item.priority_level === 4 && { backgroundColor: "red" },
                ]}
              >
                <Text style={styles.taskName}>{item.task_name}</Text>
                <Text>{item.estimate_completion_time} hours</Text>
                <Text>
                  Due: {date.toDateString()} {date.toLocaleTimeString()}
                </Text>
              </View>
            );
          }
          return (
            <View
              style={[
                styles.task,
                {
                  flex: 2,
                  flexDirection: "row",
                  backgroundColor: "lightgreen",
                },
                item.priority_level === 1
                  ? { backgroundColor: "lightgreen" }
                  : item.priority_level === 2
                  ? { backgroundColor: "aqua" }
                  : item.priority_level === 3
                  ? { backgroundColor: "orange" }
                  : { backgroundColor: "red" },
              ]}
            >
              <CheckBox
                value={isChecked(item)}
                onValueChange={() => {
                  toggleChecked(item);
                }}
                style={{ alignSelf: "center" }}
              />
              <View>
                <Text style={styles.taskName}>{item.task_name}</Text>
                <Text>{item.estimate_completion_time} hours</Text>
                <Text>
                  Due: {date.toDateString()} {date.toLocaleTimeString()}
                </Text>
              </View>
            </View>
          );
        }}
      />
      <TouchableOpacity
        onPress={() => {
          generateSchedule();
        }}
        style={styles.button}
      >
        <Text style={{ color: "white", alignSelf: "center" }}>
          Generate Schedule
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    alignSelf: "center",
    marginTop: "20%",
  },
  container: {
    alignItems: "center",
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
    backgroundColor: "black",
    marginTop: "10%",
    alignSelf: "center",
    padding: 8,
  },
  tasklist: { height: "65%", flexGrow: 0, marginTop: "5%" },
  task: { marginTop: 2, padding: 3, borderWidth: 1 },
  taskName: { fontSize: 16, fontWeight: "500" },
});

export default TaskScreen;
