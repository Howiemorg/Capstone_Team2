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
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import vercel from "../api/vercel";
import PriorityDropdown from "./PriotityDropdown";
import axios from "axios";

const EditTaskModal = ({
    onEditTask,
    onHideModal,
    setTaskObject,
    taskObject,
}) => {
    const [taskName, setTaskName] = useState("");
    const [estimateCompletionTime, setEstimateCompletionTime] = useState("3");
    const [taskDueDate, setTaskDueDate] = useState(null);
    const [isDueDateShow, setIsDueDateShow] = useState(false);
    const [isStartDateShow, setIsStartDateShow] = useState(false);
    const [error, setError] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("Critical"); // Default selected value
    const [priorityShow, setPriorityShow] = useState(false);

    const { userID } = useSelector((state) => state.user);

    const turnPriorityFromNumberToWord = (priority) => {
        if (priority == 1) {
            return "Low";
        } else if (priority == 2) {
            return "High";
        } else if (priority == 3) {
            return "Medium";
        } else {
            return "Critical";
        }
    };
    useEffect(() => {
        setTaskName(taskObject.task_name);
        setEstimateCompletionTime(String(taskObject.estimate_completion_time));
        setTaskDueDate(new Date(taskObject.task_due_date));
        setSelectedPriority(
            turnPriorityFromNumberToWord(taskObject.priority_level)
        );
    }, []);

    useEffect(() => {
        // Define the timeout
        const timeoutId = setTimeout(() => {
            // Your timeout logic here
            setIsDueDateShow(false);
        }, 1500); // Wait for 1seconds before executing

        // Cleanup function to clear the timeout when the component
        // unmounts or selectedPriority changes again
        return () => clearTimeout(timeoutId);
    }, [taskDueDate]);

    const padWithZero = (number) => String(number).padStart(2, "0");

    const TaskSubmit = async () => {
        if (!taskDueDate || !taskName || !estimateCompletionTime) {
            setError("*All fields must be filled");
            return;
        }

        try {
            const taskStartDate = new Date();
            var priority_level = 0;
            if (selectedPriority == "Critical") {
                priority_level = 4;
            } else if (selectedPriority == "High") {
                priority_level = 3;
            } else if (selectedPriority == "Medium") {
                priority_level = 2;
            } else {
                priority_level = 1;
            }
            const taskId = taskObject.task_id;
            const params = `https://capstone-backend-charles-tran.vercel.app/update-task?task_id=${taskId}&task_name='${taskName}'&task_start_date='${taskStartDate.getFullYear()}-${padWithZero(
                taskStartDate.getMonth() + 1
            )}-${padWithZero(taskStartDate.getDate())} ${padWithZero(
                taskStartDate.getHours()
            )}:${padWithZero(
                taskStartDate.getMinutes()
            )}:00'&task_due_date='${taskDueDate.getFullYear()}-${padWithZero(
                taskDueDate.getMonth() + 1
            )}-${padWithZero(taskDueDate.getDate())} ${padWithZero(
                taskDueDate.getHours()
            )}:${padWithZero(
                taskDueDate.getMinutes()
            )}:00'&progress_percent=0&priority_level=${priority_level}&estimate_completion_time=${estimateCompletionTime}`;
            console.log(params);
            const response = await axios.put(params);
            console.log(response.data);
            if (!response.data.success) {
                setError(response.data.message);
                return;
            }

            onEditTask();
            onHideModal();
        } catch (err) {
            setError(err);
        }
    };

    const onChange = (event, date) => {
        setTaskDueDate(date);
    };
    const formatDate = (date) => {
        if (date === null) {
            return;
        }
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };
    const onPriorityClick = () => {
        setPriorityShow(!priorityShow);
        setIsDueDateShow(false);
        Keyboard.dismiss();
    };
    const hideClickers = () => {
        setIsDueDateShow(false);
        setPriorityShow(false);
    };
    return (
        <View style={styles.container}>
            <View style={{ marginLeft: "5%" }}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    style={{ paddingRight: "5%" }}
                >
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={taskName}
                        onPressIn={hideClickers}
                        onChangeText={(newValue) => setTaskName(newValue)}
                    />
                    <Text style={styles.label}>Estimate Time (Minutes)</Text>
                    <TextInput
                        inputMode='decimal'
                        style={styles.input}
                        value={estimateCompletionTime}
                        onPressIn={hideClickers}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        onChangeText={(newValue) =>
                            setEstimateCompletionTime(newValue)
                        }
                    />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Text style={styles.label}>Due date</Text>
                </TouchableWithoutFeedback>
                <View style={{ flexDirection: "row", paddingRight: "5%" }}>
                    <TouchableOpacity
                        style={styles.dateTimeButton}
                        onPress={() => {
                            setIsDueDateShow((prevShow) => !prevShow);
                            setIsStartDateShow(false);
                            Keyboard.dismiss();
                            setPriorityShow(false);
                        }}
                    >
                        <Text style={styles.pickerTextStyle}>
                            {formatDate(taskDueDate)}
                        </Text>
                    </TouchableOpacity>
                </View>
                {(isDueDateShow || isStartDateShow) && (
                    <DateTimePicker
                        value={taskDueDate} // Initial date from state
                        mode='date' // The enum of date, datetime and time
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        style={styles.datePicker}
                        is24Hour={true}
                        onChange={onChange}
                    />
                )}
                <View>
                    <Text style={styles.label}>Priority Level</Text>
                    <PriorityDropdown
                        selectedPriority={selectedPriority}
                        setSelectedPriority={setSelectedPriority}
                        show={priorityShow}
                        setShow={setPriorityShow}
                        onClick={onPriorityClick}
                    />
                </View>

                {error && <Text style={styles.error}>{error}</Text>}
            </View>
            <TouchableOpacity onPress={TaskSubmit} style={styles.button}>
                <Text style={{ color: "white", alignSelf: "center" }}>
                    Edit Task
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    pickerTextStyle: {
        color: "white",
        alignContent: "center",
        justifyContent: "center",
    },
    container: {
        height: "80%",
        width: "90%",
        alignSelf: "center",
        backgroundColor: "white",
        borderRadius: 32,
    },
    button: {
        width: "55%",
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
        backgroundColor: "black",
        marginTop: "2%",
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    input: {
        borderRadius: 12,
        borderWidth: 2,
        color: "white",
        height: 40,
        backgroundColor: "black",
        marginTop: "2%",
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingLeft: 10,
    },
    label: {
        fontSize: 12,
        marginTop: "10%",
    },
    datePicker: {
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 170,
    },
});

export default EditTaskModal;
