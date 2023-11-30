import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    KeyboardAvoidingView,
    Button,
    TouchableOpacity,
    Modal,
} from "react-native";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import vercel from "../api/vercel";
import DateSelection from "../components/DateSelection";
import { Swipeable } from "react-native-gesture-handler";
import EventModal from "../components/EventModal";
import UpdateEventModal from "../components/UpdateEventModal";
import AddTaskModal from "../components/AddTaskModal";
import EndUserSurvey from "../components/EndUserSurvey";
import axios from "axios";

const CalendarScreen = () => {
    const [eventBlocks, setEventBlocks] = useState([]);
    const [error, setError] = useState("");
    const [date, setDate] = useState(new Date());
    const [modalVisable, setModalVisable] = useState(false);
    const [editEventModalVisable, setEditEventModalVisable] = useState(false);
    const [eventID, setEventID] = useState(null);
    const [endSurveyShow, setEndSurveyShow] = useState(false);
    const [neededSurverys, setNeededSurverys] = useState([
        {
            event_name: "ibrahim",
            event_block_id: 1,
        },
        {
            event_name: "semary",
            event_block_id: 2,
        },
        {
            event_name: "borai",
            event_block_id: 3,
        },
    ]);

    const { userID } = useSelector((state) => state.user);

    const getEventBlocks = async () => {
        const response = await vercel.get(
            `/get-events?user_id=${userID}&event_date=${date.getFullYear()}-${
                date.getMonth() + 1
            }-${date.getDate()}`
        );
        console.log(response.data)

        setEventBlocks(response.data);
    };

    const deleteSetEvent = async (eventBlockRemove) => {
        try {
            const response = await vercel.delete(
                `/delete-set-event?event_block_id=${eventBlockRemove.event_block_id}`
            );

            if (response.data.success) {
                setEventBlocks((prevEventBlocks) =>
                    prevEventBlocks.filter(
                        (eventBlock) =>
                            eventBlock.event_block_id !=
                            eventBlockRemove.event_block_id
                    )
                );
            } else {
                setError(
                    "There was an error in the route for deleting a user defined event",
                    response.data.message
                );
            }
        } catch (error) {
            setError(
                "An error occurred while deleting the user defined event."
            );
        }
    };

    const cancelRecommendedEvent = async (eventBlockRemove) => {
        try {
            const response = await vercel.delete(
                `/cancel-recommended-event?user_id=${eventBlockRemove.user_id}&event_block_id=${eventBlockRemove.event_block_id}&task_id=${eventBlockRemove.task_id}&selected_date=${eventBlockRemove.event_date}`
            );

            if (response.data.success) {
                setEventBlocks((prevEventBlocks) =>
                    prevEventBlocks.filter(
                        (eventBlock) =>
                            eventBlock.event_block_id !=
                            eventBlockRemove.event_block_id
                    )
                );
            } else {
                setError(
                    "There was an error in the route for deleting a user defined event",
                    response.data.message
                );
            }
        } catch (error) {
            setError("An error occurred while deleting the user event.");
        }
    };

    const reschedule = async (task) => {
        try {
            const response = await vercel.put(
                `/reschedule-event?user_id=${task.user_id}&event_block_id=${task.event_block_id}&selected_date=${task.event_date}&task_id=${task.task_id}`
            );

            if (response.data.success) {
                getEventBlocks();
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError("An error occurred while rescheduling the user task");
        }
    };

    const getEndUserSurveys = async () => {
        const response = await axios.get(
            `https://howiemorgenthaler-capstone-team2.vercel.app/get-user-survey-events?user_id=${userID}`
        );
        setNeededSurverys(response.data)
        if(response.data.length > 0){
            setEndSurveyShow(true)
        }
    };

    useEffect(() => {
        getEndUserSurveys();
    }, []);

    useEffect(() => {
        getEventBlocks();
    }, [date]);

    const handleSwipe = (item, direction) => {
        if (direction === "right") {
            cancelRecommendedEvent(item);
        } else if (direction === "left") {
            reschedule(item);
        }
    };

    const renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });

        return (
            <TouchableOpacity style={styles.leftAction}>
                <View
                    style={[
                        styles.leftActionContent,
                        { transform: [{ translateY: 50 }] },
                    ]}
                >
                    <Icon name='trash-bin' size={30} color='red' />
                    <Text style={styles.actionText}>Delete</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderRightActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });

        return (
            <TouchableOpacity style={styles.rightAction}>
                <View
                    style={[
                        styles.leftActionContent,
                        { transform: [{ translateY: 50 }] },
                    ]}
                >
                    <Icon name='refresh' size={30} color='blue' />
                    <Text style={styles.actionText}>Regenerate</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const handlePress = () => {
        // Handle the button press
        setModalVisable(true);
    };

    const handleUserDefinedEventPress = (item) => {
        if (!item.task_id) {
            setEventID(item.event_block_id);
            setEditEventModalVisable(true);
        }
    };

    return (
        <View style={styles.container}>
            <Modal
                visible={modalVisable}
                animationIn='fadeIn'
                animationOut='fadeOut'
                style={{}}
                onBackdropPress={() => setModalVisable(false)}
            >
                <EventModal
                    onAddEvent={() => getEventBlocks()}
                    onHideModal={() => setModalVisable(false)}
                    userID={userID}
                />
            </Modal>

            <Modal
                visible={endSurveyShow}
                animationIn='fadeIn'
                animationOut='fadeOut'
                style={{}}
                onBackdropPress={() => setEndSurveyShow(false)}
            >
                <EndUserSurvey
                    closeModal={() => setEndSurveyShow(false)}
                    events={neededSurverys}
                    userID={userID}
                    getEventBlocks={getEventBlocks}
                />
            </Modal>

            <Modal
                visible={editEventModalVisable}
                animationIn='fadeIn'
                animationOut='fadeOut'
                style={{}}
                onBackdropPress={() => setEditEventModalVisable(false)}
            >
                <UpdateEventModal
                    onAddEvent={() => getEventBlocks()}
                    onHideModal={() => setEditEventModalVisable(false)}
                    userID={userID}
                    eventID={eventID}
                />
            </Modal>
            <DateSelection date={date} onSetDate={setDate} />
            <FlatList
                data={eventBlocks}
                keyExtractor={(task) => task.event_block_id}
                style={styles.tasklist}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    // User task events
                    if (item.task_id) {
                        return (
                            <Swipeable
                                leftThreshold={0.75}
                                rightThreshold={0.75}
                                onSwipeableOpen={(direction) =>
                                    handleSwipe(item, direction)
                                }
                                renderRightActions={renderLeftActions}
                                renderLeftActions={renderRightActions}
                            >
                                <TouchableOpacity
                                    onPress={handleUserDefinedEventPress.bind(
                                        null,
                                        item
                                    )}
                                >
                                    <View style={[styles.block]}>
                                        <Text style={styles.title}>
                                            {item.subtask_name
                                                ? `${item.event_name}: ${item.subtask_name}`
                                                : item.event_name}
                                        </Text>
                                        <Text style={[styles.task_time]}>
                                            {item.event_start_time} -{" "}
                                            {item.event_end_time}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Swipeable>
                        );
                    } else {
                        // Set events
                        return (
                            <Swipeable
                                leftThreshold={0.75}
                                onSwipeableOpen={() => deleteSetEvent(item)}
                                renderRightActions={renderLeftActions}
                            >
                                <TouchableOpacity
                                    onPress={handleUserDefinedEventPress.bind(
                                        null,
                                        item
                                    )}
                                >
                                    <View style={[styles.block, styles.event]}>
                                        <Text
                                            style={[
                                                styles.title,
                                                { color: "white" },
                                            ]}
                                        >
                                            {item.event_name}
                                        </Text>
                                        <Text style={styles.event_time}>
                                            {item.event_start_time} -{" "}
                                            {item.event_end_time}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Swipeable>
                        );
                    }
                }}
            />
            <View style={styles.buttoncontainer}>
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={styles.icon}>+</Text>
                </TouchableOpacity>
            </View>
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
    title: { fontSize: 18 },
    event: { backgroundColor: "black" },
    event_time: { marginTop: "5%", color: "white" },
    buttoncontainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    button: {
        marginBottom: 30,
        marginLeft: "60%",
        width: 70, // Increased diameter of the circle
        height: 70, // Increased diameter of the circle
        backgroundColor: "black", // Changed button color to black
        borderRadius: 40, // Half the diameter to make it a circle
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2, // Slightly thicker border for larger button size
        borderColor: "black", // Border color of the icon
    },
    icon: {
        color: "white",
        fontSize: 40, // Increased size of the icon
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 60, // Match the new height of the button to center vertically
    },
});

export default CalendarScreen;
