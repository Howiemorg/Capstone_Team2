import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

const TaskScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [estimateCompletionTime, setEstimateCompletionTime] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskStartDate, setTaskStartDate] = useState("");
  const [error, setError] = useState("");

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
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Text style={styles.title}>Carpe DM</Text>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            value={taskName}
            onChangeText={(newValue) => setUsername(newValue)}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry={true}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            value={estimateCompletionTime}
            onChangeText={(newValue) => setPassword(newValue)}
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity onPress={TaskSubmit} style={styles.button}>
            <Text style={{ color: "white", alignSelf: "center" }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    alignSelf: "center",
    marginTop: "20%",
  },
  label: {
    fontSize: 12,
    marginTop: "10%",
    marginLeft: "17.5%",
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
    alignSelf: "center",
    color: "white",
    padding: 8,
  },
  input: {
    padding: 2.5,
    fontSize: 16,
    borderRadius: 12,
    borderWidth: 3,
    width: "65%",
    marginTop: "2%",
    alignSelf: "center",
  },
});

export default TaskScreen;
