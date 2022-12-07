import React from "react";
import { Chart } from "react-google-charts";

function PieChart({ isSentiment, positive, neutral, negative }) {

    const sentimentData = [
        ["Sentimental Analysis", "Percentage"],
        ["Positive", positive],
        ["Negative", negative],
        ["Neutral", neutral],
    ];

    const moodData = [
        ["Mood", "Percentage"],
        ["Happy", positive],
        ["Anger", negative],
        ["Sad", neutral],
    ];

    const options = {
        title: isSentiment ? "Sentimental Analysis" : "Mood",
        is3D: true,
        backgroundColor: "#0e1217",
        titleTextStyle: { color: '#A8B3CF' },
        legendTextStyle: { color: '#A8B3CF' },
        colors: ['rgb(132, 235, 176)', 'rgb(240, 131, 131)', 'rgb(250, 224, 145)']
    };

    return (
        <Chart
            chartType="PieChart"
            data={isSentiment ? sentimentData : moodData}
            options={options}
            width={"100%"}
            height={"400px"}
        />
    );
}

export default PieChart;
