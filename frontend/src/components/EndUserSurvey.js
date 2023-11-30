import React, { useState } from "react";
import axios from "axios";
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";

const EndUserSurvey = ({ closeModal, events, userID, getEventBlocks }) => {
    const [index, setIndex] = useState(0);
    const getTitle = () => {
        console.log(events[index]["event_name"]);
        return events[index]["event_name"];
    };
    const formatDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };
    const onClick = async (val) => {
        const curr = events[index];
        const event_block_id = curr["event_block_id"];
        const task_id = curr["task_id"];
        const event_start_time = curr["event_start_time"];
        const event_end_time = curr["event_end_time"];
        const selected_date = formatDate(new Date());
        const url = `event-survey-results?user_id=${userID}&event_block_id=${event_block_id}&task_id=${task_id}&productivity_score=${val}&event_start_time=${event_start_time}&event_end_time=${event_end_time}&selected_date=${selected_date}`;
        let subtasks = [];
        let subtask_name = curr["subtask_name"];
        console.log(events[index]);

        if (subtask_name != null) {
            if (subtask_name.includes("/")) {
                subtask_name = subtask_name.split("/");
            } else {
                subtask_name = [subtask_name];
            }
            if (subtask_name.length > 0) {
                subtask_name.map((subtask) => {
                    subtasks.push({
                        task_name: subtask,
                    });
                });
            }
        }
        const response = await axios.put(url, { subtasks });
        if (index === events.length - 1) {
            getEventBlocks()
            closeModal();
        }
        console.log(response.data)
        console.log(subtasks);

        setIndex(index + 1);
    };

    return (
        <TouchableWithoutFeedback>
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.title}>{getTitle()}</Text>
                        <Text style={styles.title2}>
                            How productive was your session?
                        </Text>
                        <View style={styles.rowContainer}>
                            <TouchableOpacity
                                style={styles.circleButton}
                                onPress={() => onClick(1)}
                            >
                                <Text style={styles.buttonText}>1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.circleButton}
                                onPress={() => onClick(2)}
                            >
                                <Text style={styles.buttonText}>2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.circleButton}
                                onPress={() => onClick(2)}
                            >
                                <Text style={styles.buttonText}>3</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.column1}>Not Productive</Text>
                            <Text style={styles.column2}>Productive</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => onClick(0)}
                        >
                            <Text style={styles.buttonText2}>
                                Did not Complete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        backgroundColor: "white",
        borderColor: "white",
        borderWidth: 4,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    inputContainer: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: "black",
        width: 250,
    },
    label: {
        fontSize: 16,
        color: "white",
        paddingBottom: 5,
    },
    title: {
        fontSize: 22,
        color: "black",
        paddingBottom: 5,
        fontWeight: "bold",
        marginBottom: 40,
    },
    title2: {
        fontSize: 16,
        color: "black",
        paddingBottom: 5,
        fontWeight: "bold",
        marginBottom: 30,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    circleButton: {
        width: 50,
        height: 50,
        borderRadius: 25, // To make it a circle
        backgroundColor: "black", // Background color for the circle
        alignItems: "center",
        justifyContent: "center",
        margin: 20, // Add some space between buttons
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        alignSelf: "center",
    },
    column1: {
        height: 50,
        borderRadius: 25, // To make it a circle
        alignItems: "center",
        justifyContent: "center",
        marginRight: "40%", // Add some space between buttons
        fontWeight: "bold",
    },
    column2: {
        height: 50,
        borderRadius: 25, // To make it a circle
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
    },
    button: {
        width: 200,
        borderRadius: 24,
        backgroundColor: "black",
        alignSelf: "center",
        justifyContent: "center",
        padding: 8,
        margin: 30,
    },
    buttonText2: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
        alignSelf: "center",
        padding: 5,
    },
});

export default EndUserSurvey;
