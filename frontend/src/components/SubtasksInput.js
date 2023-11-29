import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Keyboard,
    TouchableWithoutFeedback,
    TextInput,
    times,
    setTimes,
} from "react-native";

const SubtasksInput = ({
    template,
    estimateCompletionTime,
    setEstimateCompletionTime,
    hideClickers,
    show,
    times,
    setTimes,
}) => {
    useEffect(() => {
        // Define the timeout
        const timeoutId = setTimeout(() => {
            // Your timeout logic here
            Keyboard.dismiss();
        }, 1500); // Wait for 2 seconds before executing
        return () => clearTimeout(timeoutId);
    }, [estimateCompletionTime]);
    useEffect(() => {
        const new_times = [];
        if (template != null) {
            template["steps"].map((item) => {
                new_times.push({
                    "task_name": item,
                    "estimate_completion_time": "",
                });
            });
            setTimes(new_times);
        }
    }, [template]);
    const onChange = (value, index) => {
        let new_times = [...times];
        new_times[index]["estimate_completion_time"] = value;
        setTimes(new_times);
    };

    const getSteps = () => {
        return template["steps"].map((item, index) => {
            return (
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.item}>{item}</Text>
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            inputMode='decimal'
                            style={styles.input}
                            onPressIn={hideClickers}
                            value={times[index]["estimate_completion_time"]}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            onChangeText={(value) => onChange(value, index)}
                        />
                    </View>
                </View>
            );
        });
    };
    if (show) {
        return null;
    } else if (template === null) {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ paddingRight: "5%" }}>
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
                </View>
            </TouchableWithoutFeedback>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text>Subtasks</Text>
                </View>
                <View style={styles.column}>
                    <Text>Estimate Time (minutes)</Text>
                </View>
            </View>
            <View>{getSteps()}</View>
        </View>
    );
};
const styles = StyleSheet.create({
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
    container: {
        marginRight: "5%",
        marginTop: 10,
    },
    row: {
        flexDirection: "row",
        margin: 10,
    },
    column: {
        flex: 1,
        justifyContent: "center", // centers in the flex direction and the default direction is column
        alignItems: "center", // centers horizontally
    },
    item: {
        fontSize: 14,
        textAlign: "center", // aligns text horizontally
        width: "100%",
    },
    button: {
        width: "55%",
        borderRadius: 24,
        backgroundColor: "black",
        alignSelf: "center",
        padding: 8,
        marginTop: 30,
    },
});

export default SubtasksInput;
