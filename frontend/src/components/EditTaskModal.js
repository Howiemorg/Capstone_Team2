import React from "react";
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
    Keyboard,
    ActivityIndicator
} from "react-native";
import {
    TextInput,
    TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import PriorityDropdown from "./PriotityDropdown";
import axios from "axios";
import Dropdown from "./Dropdown";
import SubtasksInput from "./SubtasksInput";

const EditTaskModal = ({
    onEditTask,
    onHideModal,
    setTaskObject,
    taskObject,
}) => {
    const [taskName, setTaskName] = useState("");
    const [estimateCompletionTime, setEstimateCompletionTime] = useState("");
    const [taskDueDate, setTaskDueDate] = useState(null);
    const [isDueDateShow, setIsDueDateShow] = useState(false);
    const [isStartDateShow, setIsStartDateShow] = useState(false);
    const [error, setError] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("Critical"); // Default selected value
    const [priorityShow, setPriorityShow] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateLabel, setSelectedTemplateLabel] =
        useState("No Template");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templateShow, setTemplateShow] = useState(false);
    const [templateNames, setTemplateNames] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
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
    const fetchTemplates = async () => {
        try {
            const response = await axios.get(
                "https://capstone-team2.vercel.app/get-templates"
            );
            setTemplates(response.data); // Set the data to the templates state
            const templatenames = ["No Template"];
            response.data.map((item) => {
                templatenames.push(item["template_name"]);
                if (item["template_name"] === taskObject.template_name) {
                    setSelectedTemplate(item);
                }
            });
            setTemplateNames(templatenames);
        } catch (error) {
            console.error("There was an error!", error);
        }
    };

    useEffect(() => {
        fetchTemplates();
        setTaskName(taskObject.task_name);
        setEstimateCompletionTime(String(taskObject.estimate_completion_time));
        setTaskDueDate(new Date(taskObject.task_due_date));
        setSelectedPriority(
            turnPriorityFromNumberToWord(taskObject.priority_level)
        );
        setSelectedTemplateLabel(taskObject.template_name);
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
        if (!taskDueDate || !taskName) {
            setError("*All fields must be filled");
            return;
        }

        try {
            const taskStartDate = new Date();
            // taskStartDate.setMilliseconds(taskStartDate.getMilliseconds() - 6 * 60 * 60 * 1000);

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
            const params = `https://capstone-backend-charles-tran.vercel.app/update-task?task_id=${taskId}&task_name='${taskName}'&task_start_date=${taskStartDate.getFullYear()}-${padWithZero(
                taskStartDate.getMonth() + 1
            )}-${padWithZero(
                taskStartDate.getDate()
            )} 00:00:00&task_due_date=${taskDueDate.getFullYear()}-${padWithZero(
                taskDueDate.getMonth() + 1
            )}-${padWithZero(
                taskDueDate.getDate()
            )} 23:59:59&progress_percent=0&estimate_completion_time=${estimateCompletionTime}&priority_level=${priority_level}&template_name='${selectedTemplateLabel}'&user_id=${userID}`;
            try {
                const response = await axios.put(params, {
                    subtasks: subtasks,
                });
                console.log("edit tasks:",response.data)
            } catch (e) {
                setError(e.data.message);
            }
            onHideModal();
            onEditTask();
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
    const onTemplateClick = () => {
        setPriorityShow(false);
        setIsDueDateShow(false);
        setTemplateShow(!templateShow);
        Keyboard.dismiss();
    };
    const onTemplateChange = (index, label) => {
        setSelectedTemplateLabel(label);
        const curr_template = index === 0 ? null : templates[index - 1];
        setSelectedTemplate(curr_template);
    };
    if (templateNames.length === 0) {
        return <ActivityIndicator size='large' color='white' />;
    }
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
                </TouchableWithoutFeedback>

                <Dropdown
                    label='Template'
                    selected={selectedTemplateLabel}
                    items={templateNames}
                    onPress={onTemplateClick}
                    showPicker={templateShow}
                    setShowPicker={setTemplateShow}
                    onChange={onTemplateChange}
                />
                <SubtasksInput
                    template={selectedTemplate}
                    estimateCompletionTime={estimateCompletionTime}
                    setEstimateCompletionTime={setEstimateCompletionTime}
                    hideClickers={hideClickers}
                    show={templateShow}
                    times={subtasks}
                    setTimes={setSubtasks}
                />
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
        margin: 30,
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
