import React from "react";
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
import AddTaskModal from "../components/AddTaskModal";

const CalendarScreen = () => {
    const [eventBlocks, setEventBlocks] = useState([]);
    const [error, setError] = useState("");
    const [date, setDate] = useState(new Date());
    const [modalVisable, setModalVisable] = useState(false);

    const { userID } = useSelector((state) => state.user);

    const getEventBlocks = async () => {
        const response = await vercel.get(
            `/get-events?user_id=${userID}&event_date=${date.getFullYear()}-${
                date.getMonth() + 1
            }-${date.getDate()}`
        );

        setEventBlocks(response.data);
    };

    const cancelEvent = async (eventBlockRemove) => {
        // const response = await vercel.post(`/cancel-event?user_id=${userID}&event_id=${eventBlock.event_block_id}`)
        // if (response.data.success) {
        setEventBlocks((prevEventBlocks) =>
            prevEventBlocks.filter(
                (eventBlock) =>
                    eventBlock.event_block_id != eventBlockRemove.event_block_id
            )
        );
        // } else {
        //   setError(response.data.message);
        // }
    };

    const reschedule = async (task) => {
        // const response = await vercel.post(`/reschedule?user_id=${userID}&task_id=${task.task_id}`)

        // if (response.data.success) {
        getEventBlocks();
        // } else {
        //   setError(response.data.message);
        // }
    };

    useEffect(() => {
        getEventBlocks();
    }, [date]);

    const renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });
        return (
            <TouchableOpacity style={styles.leftAction} onPress={this.close}>
                <Text> </Text>
            </TouchableOpacity>
        );
    };

    const handlePress = () => {
        // Handle the button press
        setModalVisable(true);
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
                    userID = {userID}
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
                    return (
                        <Swipeable
                            onSwipeableOpen={
                                item.task_id
                                    ? reschedule.bind(null, item)
                                    : cancelEvent.bind(null, item)
                            }
                            renderRightActions={renderLeftActions}
                        >
                            {item.task_id ? (
                                <View style={[styles.block]}>
                                    <Text style={styles.title}>
                                        {item.event_name}
                                    </Text>
                                    <Text style={[styles.task_time]}>
                                        {item.event_start_time} -{" "}
                                        {item.event_end_time}
                                    </Text>
                                </View>
                            ) : (
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
                            )}
                        </Swipeable>
                    );
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
