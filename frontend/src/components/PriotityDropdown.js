import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

const PriorityDropdown = ({
    selectedPriority,
    setSelectedPriority,
    show,
    setShow,
    onClick,
}) => {
    useEffect(() => {
        // Define the timeout
        const timeoutId = setTimeout(() => {
            // Your timeout logic here
            setShow(false);
        }, 1500); // Wait for 2 seconds before executing

        // Cleanup function to clear the timeout when the component
        // unmounts or selectedPriority changes again
        return () => clearTimeout(timeoutId);
    }, [selectedPriority]);
    const getColorForPriority = (priority) => {
        switch (priority) {
            case "Critical":
                return "red";
            case "High":
                return "orange";
            case "Medium":
                return "#DAA520"; // Darker yellow color
            case "Low":
                return "green";
            default:
                return "black";
        }
    };
    return (
        <View style={styles.container2}>
            <TouchableOpacity
                style={{
                    paddingVertical: 15,
                    borderWidth: 1,
                    borderColor: "white",
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    backgroundColor: getColorForPriority(selectedPriority),
                }}
                onPress={onClick}
            >
                <Text style={styles.priorityText}>{selectedPriority}</Text>
            </TouchableOpacity>
            {show && (
                <Picker
                    selectedValue={selectedPriority}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedPriority(itemValue)
                    }
                    style={styles.picker}
                >
                    <Picker.Item
                        label='Critical'
                        value='Critical'
                        color='red'
                    />
                    <Picker.Item label='High' value='High' color='orange' />
                    <Picker.Item
                        label='Medium'
                        value='Medium'
                        color='#DAA520'
                    />
                    <Picker.Item label='Low' value='Low' color='green' />
                </Picker>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container2: {
        // Container styles
        paddingRight: "5%",
        marginTop: 10,
        // You might want to set a specific width or leave it to take the full width
    },
    picker: {
        // Picker styles
        height: 50, // Set the height accordingly
        width: "100%", // Set the width accordingly, or use a fixed width
    },
    priorityText: {
        // Style the date text
        color: "white",
        fontSize: 16,
    },
});

export default PriorityDropdown;
