import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { round } from '../../helper/utils';
import "../../css/Chart.css"


// similar to TradingViewChart but with data already handled by backend
function TradingViewChartV2({ value, value2, value3, currentValue, currentValue2, currentValue3, title, name }) {

    const [ref] = useState(useRef());

    const [anchorChart, setAnchorChart] = useState(null);
    const [areaSeries, setAreaSeries] = useState(null);
    const [lineSeries, setLineSeries] = useState(null);
    const [lineSeries2, setLineSeries2] = useState(null);

    const [data, setData] = useState([]);

    const [data2, setData2] = useState([]);

    const [data3, setData3] = useState([]);

    const OFFSET = 14400000;

    function timeToTz(d) {
        return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
    }

    useEffect(() => {
        let toolTip = document.createElement('div')
        toolTip.className = 'chart-legend'
        ref.current.appendChild(toolTip)

        const darkTheme = {
            chart: {
                layout: {
                    backgroundColor: '#2B2B43',
                    lineColor: '#2B2B43',
                    textColor: '#D9D9D9',
                },
                watermark: {
                    color: 'rgba(0, 0, 0, 0)',
                },
                crosshair: {
                    color: '#758696',
                },
                grid: {
                    vertLines: {
                        color: '#2B2B43',
                    },
                    horzLines: {
                        color: '#363C4E',
                    },
                },
            },
            series: {
                topColor: 'rgba(32, 226, 47, 0.56)',
                bottomColor: 'rgba(32, 226, 47, 0.04)',
                lineColor: 'rgba(32, 226, 47, 1)',
            },
        };

        const themesData = {
            Dark: darkTheme,
        };

        function syncToTheme(theme, op1, op2) {
            op1.applyOptions(themesData[theme].chart);
            op2.applyOptions(themesData[theme].series);
        }

        if (!ref.current || anchorChart) return;

        const newChart = createChart(ref.current, {
            width: window.innerWidth / 1.35,
            height: window.innerHeight / 2,
            timeScale: {
                timeVisible: true,
            },
        })
        const newAreaSeries = newChart.addLineSeries({
            color: "rgb(132, 235, 176)"
        });

        const newLineSeries = value2 ? newChart.addLineSeries({
            color: "rgb(250, 224, 145)"
        }) : null;

        const newLineSeries2 = value3 ? newChart.addLineSeries({
            color: "rgb(240, 131, 131)",
        }) : null;

        syncToTheme('Dark', newChart, newAreaSeries);

        value2 && value3 && newChart.subscribeCrosshairMove(function (param) {

            let current = param.seriesPrices.get(newAreaSeries) ? round(param.seriesPrices.get(newAreaSeries)) : currentValue;
            let current2 = param.seriesPrices.get(newLineSeries) ? round(param.seriesPrices.get(newLineSeries)) : currentValue2;
            let current3 = param.seriesPrices.get(newLineSeries2) ? round(param.seriesPrices.get(newLineSeries2)) : currentValue3;

            toolTip.innerHTML =
                `<div>` +
                name +
                '</div>' +
                `<div>` +
                `Positive: ` + current +
                '</div>' +
                '<div>' +
                `Neutral: ` + current2 +
                '</div>' +
                '<div>' +
                `Negative: ` + current3 +
                '</div>'
        })

        newChart.timeScale().fitContent();
        setAnchorChart(newChart);
        setAreaSeries(newAreaSeries);
        setLineSeries(newLineSeries);
        setLineSeries2(newLineSeries2)

    }, [ref, anchorChart, name, title, value, value2, value3, currentValue, currentValue2, currentValue3]);


    useEffect(() => {
        const newValue = value.map(e => {
            return {
                time: timeToTz((new Date((new Date(e.time)).getTime() + OFFSET))),
                value: e.value
            }
        })

        setData(newValue)

        if (value2) {
            const newValue2 = value2.map(e => {
                return {
                    time: timeToTz((new Date((new Date(e.time)).getTime() + OFFSET))),
                    value: e.value
                }
            })

            // let zip2 = time.map((d, i) => {
            //     return [timeToTz((new Date((new Date(d)).getTime() + OFFSET))), value2[i]];
            // });

            // zip2 = zip2.filter((element) => !(element[1] === null || element[1] === -1))

            // const dataDict2 = zip2.map((element) => {
            //     return {
            //         time: element[0],
            //         value: isNormalized === true ? (element[1] - min2) / delta2 : element[1]
            //     }
            // })

            setData2(newValue2)
        }

        if (value3) {

            const newValue3 = value3.map(e => {
                return {
                    time: timeToTz((new Date((new Date(e.time)).getTime() + OFFSET))),
                    value: e.value
                }
            })
            // let zip3 = time.map((d, i) => {
            //     return [timeToTz((new Date((new Date(d)).getTime() + OFFSET))), value3[i]];
            // });

            // zip3 = zip3.filter((element) => !(element[1] === null || element[1] === -1))

            // const dataDict3 = zip3.map((element) => {
            //     return {
            //         time: element[0],
            //         value: isNormalized === true ? (element[1] - min3) / delta3 : element[1]
            //     }
            // })

            setData3(newValue3)


        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {

        if (data.length > 0) {
            areaSeries.setData(data);
            if (lineSeries) {
                lineSeries.setData(data2);
            }
            if (lineSeries2) {
                lineSeries2.setData(data3);
            }
        }
        // eslint-disable-next-line
    }, [data, data2, data3]);

    const generateTitle = () => {
        return title
    }

    return (
        <div style={{ marginBottom: "4vh" }}>
            <div style={{ fontSize: "1.5vw", fontFamily: "BumbleGum", marginBottom: "4vh", float: "left" }}>{generateTitle()}</div>
            <div ref={ref} style={{ position: "relative" }} />
        </div>
    );
}

export default TradingViewChartV2;

