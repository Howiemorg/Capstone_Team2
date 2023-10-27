import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Keyboard,
} from "react-native";
import {
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useState } from "react";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import vercel from "../api/vercel";

const AddTaskModal = ({ onAddTask, onHideModal }) => {
  const [taskName, setTaskName] = useState("");
  const [estimateCompletionTime, setEstimateCompletionTime] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(new Date());
  const [isDueDateShow, setIsDueDateShow] = useState(false);
  const [taskStartDate, setTaskStartDate] = useState(new Date());
  const [isStartDateShow, setIsStartDateShow] = useState(false);
  const [error, setError] = useState("");
  const [dateType, setDateType] = useState("due");

  const { userID } = useSelector((state) => state.user);

  const TaskSubmit = async () => {
    if (
      !taskDueDate ||
      !taskName ||
      !taskStartDate ||
      !estimateCompletionTime
    ) {
      setError("*All fields must be filled");
      return;
    }

    try {
      const response = await vercel.post(
        `/add-tasks?user_id=${1}&task_name='${taskName}'&task_start_date='${taskStartDate.getFullYear()}-${
          taskStartDate.getMonth() + 1
        }-${taskStartDate.getDate()} ${taskStartDate.getHours()}:${taskStartDate.getMinutes()}:${taskStartDate.getSeconds()}'&task_due_date='${taskDueDate.getFullYear()}-${
          taskDueDate.getMonth() + 1
        }-${taskDueDate.getDate()} ${taskDueDate.getHours()}:${taskDueDate.getMinutes()}:${taskDueDate.getSeconds()}'&progress_percent=0&priority_level=NULL&estimate_completion_time=30&completion_date='2023-12-12'`
      );

      if (!response.data.success) {
        setError(response.data.message);
        return;
      }

      onAddTask();
      onHideModal();
    } catch (err) {
      setError(err);
    }
  };

  const onChange = (event, date) => {
    if (dateType === "start") {
      setTaskStartDate(date);
      if (Platform.OS == "android") {
        setIsStartDateShow(false);
      }
    } else if (dateType === "due") {
      setTaskDueDate(date);
      if (Platform.OS == "android") {
        setIsDueDateShow(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginLeft: "5%" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            value={taskName}
            onChangeText={(newValue) => setTaskName(newValue)}
          />
          <Text style={styles.label}>Estimate Time</Text>
          <TextInput
            inputMode="decimal"
            style={styles.input}
            value={estimateCompletionTime}
            onSubmitEditing={() => Keyboard.dismiss()}
            onChangeText={(newValue) => setEstimateCompletionTime(newValue)}
          />
          <Text style={styles.label}>Start date</Text>
        </TouchableWithoutFeedback>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => {
              setIsStartDateShow((prevShow) => !prevShow);
              setDateType("start");
              setIsDueDateShow(false);
              Keyboard.dismiss();
            }}
          >
            <Text>
              {taskStartDate.toDateString()} {"    "}{" "}
              {taskStartDate.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Text style={styles.label}>Due date</Text>
        </TouchableWithoutFeedback>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => {
              setIsDueDateShow((prevShow) => !prevShow);
              setIsStartDateShow(false);
              setDateType("due");
              Keyboard.dismiss();
            }}
          >
            <Text>
              {taskDueDate.toDateString()} {"    "}{" "}
              {taskDueDate.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>
        {(isDueDateShow || isStartDateShow) && (
          <DateTimePicker
            value={isDueDateShow ? taskDueDate : taskStartDate} // Initial date from state
            mode="datetime" // The enum of date, datetime and time
            display={Platform.OS === "ios" ? "spinner" : "default"}
            style={styles.datePicker}
            minimumDate={new Date()}
            is24Hour={true}
            onChange={onChange}
          />
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <TouchableOpacity onPress={TaskSubmit} style={styles.button}>
        <Text style={{ color: "white", alignSelf: "center" }}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "80%",
    width: "90%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 32,
  },
  button: {
    width: "45%",
    borderRadius: 24,
    backgroundColor: "black",
    alignSelf: "center",
    padding: 8,
    position: "absolute",
    bottom: 32,
  },
  dateTimeButton: {
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    backgroundColor: "lightgrey",
    marginTop: "2%",
  },
  input: {
    padding: 2.5,
    fontSize: 16,
    borderRadius: 12,
    borderWidth: 3,
    width: "65%",
    marginTop: "2%",
  },
  label: {
    fontSize: 12,
    marginTop: "10%",
  },
  datePicker: {
    width: 300,
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default AddTaskModal;
