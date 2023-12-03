import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

const Dropdown = ({
    label,
    selected,
    items,
    showPicker,
    setShowPicker,
    onPress,
    onChange,
}) => {
    useEffect(() => {
        // Define the timeout
        const timeoutId = setTimeout(() => {
            // Your timeout logic here
            setShowPicker(false);
        }, 1500); // Wait for 2 seconds before executing

        // Cleanup function to clear the timeout when the component
        // unmounts or selectedPriority changes again
        return () => clearTimeout(timeoutId);
    }, [selected]);
    const pickerItems = () => {
        if (items === undefined) {
            return;
        }
        return items.map((item) => {
            return <Picker.Item label={item} value={item} color='red' />;
        });
    };
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.pickerTextStyle}>{selected}</Text>
            </TouchableOpacity>
            {showPicker && (
                <Picker
                    selectedValue={selected}
                    onValueChange={(index, itemValue) =>
                        onChange(itemValue, index)
                    }
                    style={styles.picker}
                >
                    {pickerItems()}
                </Picker>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingRight: "5%",
    },
    label: {
        fontSize: 12,
        marginTop: "10%",
    },
    button: {
        borderRadius: 12,
        padding: 4,
        backgroundColor: "black",
        marginTop: "2%",
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    pickerTextStyle: {
        color: "white",
        fontSize: 14,
    },
    picker: {
        height: 120, // Set the height accordingly
        width: "100%", // Set the width accordingly, or use a fixed width
        marginBottom: 20,
    },
});

export default Dropdown;
