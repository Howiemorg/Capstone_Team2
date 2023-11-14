import React, { useState, useEffect } from "react";
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Keyboard,
} from "react-native";
import EventDateInput from "./EventDateInput";
import TimePickerInput from "./TimePickerInput";
import axios from "axios";

const UpdateEventModal = ({ onAddEvent, onHideModal, userID, eventID }) => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState(new Date());
    const [eventStartTime, setEventStartTime] = useState(new Date());
    const [eventEndTime, setEventEndTime] = useState(new Date());

    const [dateShow, setDateShow] = useState(false);
    const [startTimeShow, setStartTimeShow] = useState(false);
    const [endTimeShow, setEndTimeShow] = useState(false);

    const [eventDetails, setEventDetails] = useState(null);

    useEffect(() => {
        // Fetch event details based on eventID
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(
                    `https://capstone-backend-charles-tran.vercel.app/get-single-event?event_block_id=${eventID}`
                );
                if (response.data.length) {
                    setEventDetails(response.data[0]);
                    setEventName(response.data[0].event_name);

                    const event_date = new Date(response.data[0].event_date);
                    event_date.setFullYear(response.data[0].event_date.substring(0,4));
                    event_date.setMonth(parseInt(response.data[0].event_date.substring(5,7))-1);
                    event_date.setDate(response.data[0].event_date.substring(8,10));

                    setEventDate(event_date);

                    const start_time = new Date(event_date);
                    start_time.setHours(response.data[0].event_start_time.substring(0,2));
                    start_time.setMinutes(response.data[0].event_start_time.substring(3,5));

                    setEventStartTime(start_time);
                    
                    const end_time = new Date(event_date);
                    end_time.setHours(response.data[0].event_end_time.substring(0,2));
                    end_time.setMinutes(response.data[0].event_end_time.substring(3,5));

                    setEventEndTime(end_time);
                } else {
                    console.error("Error in fetching event details: ", response.data.message);
                }
            } catch (error) {
                console.error("Network Error in fetching event details:", error.message);
            }
        };

        // Fetch event details when the modal opens
        if (eventID) {
            fetchEventDetails();
        }
    }, [eventID]);

    // useEffect(() => {
    //     // Populate input fields with existing event data
    //     if (eventDetails) {
    //       setEventName(eventDetails.event_name || "");
    //       setEventDate(new Date(eventDetails.event_date) || new Date());
    //       setEventStartTime(new Date(eventDetails.start_time) || new Date());
    //       setEventEndTime(new Date(eventDetails.end_time) || new Date());
    //     }
    //   }, [eventDetails]);


    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${formattedHours}:${formattedMinutes}`;
    };

    const formatDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    const dateClick = () => {
        Keyboard.dismiss();
        setDateShow(!dateShow);
        setStartTimeShow(false);
        setEndTimeShow(false);
    };

    const startTimeClick = () => {
        Keyboard.dismiss();
        setDateShow(false);
        setStartTimeShow(!startTimeShow);
        setEndTimeShow(false);
    };
    const endTimeClick = () => {
        Keyboard.dismiss();
        setDateShow(false);
        setStartTimeShow(false);
        setEndTimeShow(!endTimeShow);
    };
    const keyboardPress = () => {
        setDateShow(false);
        setStartTimeShow(false);
        setEndTimeShow(false);
    };

    const updateEvent = async () => {
        const date = formatDate(eventDate);
        const startTime = formatTime(eventStartTime);
        const endTime = formatTime(eventEndTime);
        console.log("eventID: ", eventID)
        console.log("eventName: ", eventName)
        console.log("start: ", startTime)
        console.log("end: ", endTime)
        console.log("date: ", date)
      
        try {
          const response = await axios.put(
            // Define your API endpoint to update the event by eventID
            `https://capstone-backend-charles-tran.vercel.app/update-set-event?event_block_id=${eventID}&event_name='${eventName}'&event_start_time='${startTime}'&event_end_time='${endTime}'&event_date='${date}'`
            
          );
      
          if (response.data.success) {
            onAddEvent();
            onHideModal();
          } else {
            // Handle errors or show a message
            console.log(response)
            console.error("Error in updating event details: ", response.data);
          }
        } catch (error) {
          // Handle network errors or show an error message
          console.error("Network Error in updating the event:", error.message);
        }
      };
      
    const closeModal = () => {
        onHideModal();
    };
    return (
        <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                    accessible={false}
                >
                    <View style={styles.modalView}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setEventName}
                                value={eventName}
                                onPressIn={keyboardPress}
                                placeholder="Enter event name"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Date</Text>
                            <EventDateInput
                                setDate={setEventDate}
                                onClick={dateClick}
                                show={dateShow}
                                setShow = {setDateShow}
                                date = {eventDate}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Start Time</Text>
                            <TimePickerInput
                                setEventTime={setEventStartTime}
                                eventTime = {eventStartTime}
                                onClick={startTimeClick}
                                show={startTimeShow}
                                setShow= {setStartTimeShow}
                                value={eventStartTime}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>End Time</Text>
                            <TimePickerInput
                                setEventTime={setEventEndTime}
                                eventTime = {eventEndTime}
                                onClick={endTimeClick}
                                show={endTimeShow}
                                setShow={setEndTimeShow}
                            />
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={updateEvent}>
                            <Text style={styles.textStyle}>Update Event</Text>
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
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: "black",
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
    input: {
        height: 40,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "white",
        backgroundColor: "black",
    },
});
export default UpdateEventModal;
