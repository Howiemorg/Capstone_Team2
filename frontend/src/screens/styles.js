import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        alignSelf: "center",
        marginTop: "20%",
    },
    label: {
        fontSize: 12,
        marginTop: "10%",
        marginLeft: "17.5%",
    },
    error: {
        fontSize: 12,
        color: "red",
        marginTop: "7.5%",
        alignSelf: "center",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: "10%",
        width: "55%",
        height: "5%",
        borderRadius: 20,
        backgroundColor: "black",
        color: "white",
    },
    input: {
        padding: 2.5,
        fontSize: 16,
        borderRadius: 12,
        borderWidth: 3,
        width: "65%",
        marginTop: "2%",
        alignSelf: "center",
    },
});

export default styles;
