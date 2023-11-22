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
import EditTaskModal from "../components/EditTaskModal";
import axios from "axios";

const TaskScreen = ({ setSelected }) => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const [addTask, setAddTask] = useState(false);
    const [generateTasks, setGeneratetasks] = useState([]);
    const [editTask, setEditTask] = useState(false);

    const { userID } = useSelector((state) => state.user);

    const [editTaskObject, setEditTaskObject] = useState({});

    const formatTime = (date) => {
        if (date == undefined) {
            return "null";
        }

        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const getTasks = async () => {
        const response = await vercel.get(`/get-due-tasks?user_id=${userID}`);

        if (response.data) {
            setTasks(response.data);
        } else {
            setError("No data");
        }

        setGeneratetasks(
            response.data.reduce((accumalator, currentVal) => {
                const date = new Date(
                    currentVal.task_due_date.substring(0, 10)
                );
                if (dueThisWeek(date)) {
                    accumalator.push(currentVal.task_id);
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
            setGeneratetasks((prevTasks) =>
                prevTasks.filter((item) => item != task)
            );
        } else {
            setGeneratetasks((prevTasks) => [...prevTasks, task]);
        }
    };

    const generateSchedule = async () => {
        const today = new Date();
        const response = await vercel.post(
            `/get-recommendations?user_id=1&selected_date=${today
                .toISOString()
                .substring(0, 10)}&selected_tasks=(${generateTasks})`
        );

        console.log(response);
        if (response.data.success) {
            setSelected("Calendar");
        } else {
            setError(response.data.message);
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    const editTaskModal = (item) => {
        setEditTask(true);
        setEditTaskObject(item);
    };
    const deleteTask = async (taskId) => {
        try {
            const response = await axios.delete(
                `http://capstone-backend-charles-tran.vercel.app/delete-task?task_id=${taskId}`
            );
            console.log(response.data)
            if (response.data.success) {
                getTasks();
            } else {
                setError(response.data.message);
                return;
            }
        } catch (err) {
            setError(err);
        }
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setAddTask(true)}
                style={styles.button}
            >
                <Text style={{ alignSelf: "center", color: "white" }}>
                    Add a Task
                </Text>
            </TouchableOpacity>
            <Modal
                isVisible={editTask}
                animationIn='fadeIn'
                animationOut='fadeOut'
                style={{}}
                onBackdropPress={() => setEditTask(false)}
            >
                <EditTaskModal
                    onHideModal={() => setEditTask(false)}
                    onEditTask={() => getTasks()}
                    setTaskObject={setEditTaskObject}
                    taskObject={editTaskObject}
                />
            </Modal>
            <Modal
                isVisible={addTask}
                animationIn='fadeIn'
                animationOut='fadeOut'
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
                        return (
                            <TouchableOpacity
                                onPress={() => editTaskModal(item)}
                            >
                                <View
                                    style={[
                                        styles.row, // Use a row style
                                        item.priority_level === 1
                                            ? { backgroundColor: "skyblue" }
                                            : item.priority_level === 2
                                            ? { backgroundColor: "lightgreen" }
                                            : item.priority_level === 3
                                            ? { backgroundColor: "orange" }
                                            : item.priority_level === 4
                                            ? { backgroundColor: "red" }
                                            : null,
                                    ]}
                                >
                                    <View style={styles.column}>
                                        <Text style={styles.taskName}>
                                            {item.task_name}
                                        </Text>
                                        <Text>
                                            {item.estimate_completion_time / 60}{" "}
                                            hours
                                        </Text>
                                        <Text>Due: {formatTime(date)}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => deleteTask(item.task_id)}
                                        style={styles.closeButton}
                                    >
                                        <Text style={styles.closeButtonText}>
                                            X
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                    return (
                        <TouchableOpacity onPress={() => editTaskModal(item)}>
                            <View
                                style={[
                                    styles.row,
                                    item.priority_level === 1
                                        ? { backgroundColor: "skyblue" }
                                        : item.priority_level === 2
                                        ? { backgroundColor: "lightgreen" }
                                        : item.priority_level === 3
                                        ? { backgroundColor: "orange" }
                                        : item.priority_level === 4 && {
                                              backgroundColor: "red",
                                          },
                                ]}
                            >
                                <CheckBox
                                    value={isChecked(item.task_id)}
                                    onValueChange={() => {
                                        toggleChecked(item.task_id);
                                    }}
                                    style={{ alignSelf: "center" }}
                                />
                                <View style={styles.column}>
                                    <Text style={styles.taskName}>
                                        {item.task_name}
                                    </Text>
                                    <Text>
                                        {item.estimate_completion_time / 60}{" "}
                                        hours
                                    </Text>
                                    <Text>Due: {formatTime(date)}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => deleteTask(item.task_id)}
                                    style={styles.closeButton}
                                >
                                    <Text style={styles.closeButtonText}>
                                        X
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
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
        display: "flex",
        flexDirection: "column",
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
        margin: 20,
        alignSelf: "center",
        padding: 8,
    },
    tasklist: {
        width: "70%",
        height: "63%",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center", // Vertically center items within the row
        padding: 5,
        borderWidth: 1,
        marginBottom: 10, // Add margin between rows
    },
    column: {
        flex: 1, // Each column takes up equal space within a row
        paddingHorizontal: 5, // Add padding for spacing within columns
    },
    taskName: {
        fontSize: 16,
        fontWeight: "500",
    },
    closeButton: {
        width: 40,
        height: 40,
        backgroundColor: "black",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonText: {
        color: "white",
        fontSize: 18,
    },
});

export default TaskScreen;
