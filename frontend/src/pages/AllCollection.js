import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import tableIcons from "../components/MaterialTableIcons";
import { AuthContext } from "../App";
import "../css/Dashboard.css"
import { round } from '../helper/utils';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useHistory } from "react-router-dom";
import solanaImage from "../assets/solana.jpeg"
import HelpIcon from '@mui/icons-material/Help';
import { Tooltip } from '@mui/material';

const AllCollection = () => {

    const [data, setData] = useState([])

    const [time, setTime] = useState("1d");

    const { state } = React.useContext(AuthContext);

    const history = useHistory();

    useEffect(() => {

        let allCollection = []
        let uniqueCol = []
        if (state.sentimentBoardNewCollection && state.sentimentBoard1h && state.sentimentBoard1d && state.sentimentBoard7d) {
            allCollection = allCollection.concat(state.sentimentBoardNewCollection).concat(state.sentimentBoard1h).concat(state.sentimentBoard1d).concat(state.sentimentBoard7d)
            allCollection.map(collection => cleanShock(collection))
            uniqueCol = getUniqueCollections(allCollection)
        }
        setData(uniqueCol)
    }, [state.sentimentBoardNewCollection, state.sentimentBoard1h, state.sentimentBoard1d, state.sentimentBoard7d])

    const getUniqueCollections = (collections) => {
        let collectionSet = new Set()
        let uniqueCol = []
        for (const collection of collections) {
            const name = collection.name
            if (!collectionSet.has(name)) {
                uniqueCol.push(collection)
                collectionSet.add(name)
            }
        }
        return uniqueCol
    }

    const handleChangeTime = (event, newValue) => {
        setTime(newValue);
    };

    const cleanShock = (collection) => {
        const nullShock = {
            "volume": -1,
            "listedCount": -1,
            "floorPrice": -1,
            "volumeAll": -1,
            "followers_count": -1,
            "following_count": -1,
            "tweet_count": -1,
            "sentiment": -1
        }
        const newShock = {}
        for (const [shock, obj] of Object.entries(collection.shock)) {
            const periodShock = {}
            if (obj) {
                for (const [key, value] of Object.entries(obj)) {
                    periodShock[key] = value ? round(value) : -1
                }
                newShock[shock] = periodShock
            }
            else {
                newShock[shock] = nullShock
            }
        }
        collection['shock'] = newShock
        return collection
    }

    const generateColor = (number) => {
        if (number === 0) {
            return "white"
        }
        else if (number > 0) {
            //green
            return "rgb(132, 235, 176)"
        }
        else {
            //red
            return "rgb(240, 131, 131)"
        }
    }

    const generateFpShock = (rowData) => {
        switch (time) {
            case "1h":
                return rowData.shock.shock1hr ? rowData.shock.shock1hr.floorPrice : 0
            case "6h":
                return rowData.shock.shock6hr ? rowData.shock.shock6hr.floorPrice : 0
            case "7d":
                return rowData.shock.shock7d ? rowData.shock.shock7d.floorPrice : 0
            // 24h
            default:
                return rowData.shock.shock1d ? rowData.shock.shock1d.floorPrice : 0
        }
    }

    const generateListedCountShock = (rowData) => {
        switch (time) {
            case "1h":
                return rowData.shock.shock1hr ? rowData.shock.shock1hr.listedCount : 0
            case "6h":
                return rowData.shock.shock6hr ? rowData.shock.shock6hr.listedCount : 0
            case "7d":
                return rowData.shock.shock7d ? rowData.shock.shock7d.listedCount : 0
            // 24h
            default:
                return rowData.shock.shock1d ? rowData.shock.shock1d.listedCount : 0
        }
    }

    const generateVolumeShock = (rowData) => {
        switch (time) {
            case "1h":
                return rowData.shock.shock1hr ? rowData.shock.shock1hr.volume : 0
            case "6h":
                return rowData.shock.shock6hr ? rowData.shock.shock6hr.volume : 0
            case "7d":
                return rowData.shock.shock7d ? rowData.shock.shock7d.volume : 0
            // 24h
            default:
                return rowData.shock.shock1d ? rowData.shock.shock1d.volume : 0
        }
    }

    const columns = [
        {
            title: "Collection",
            field: "name",
            align: "left",
            render: (rowData) =>
                <div className="topCollection-name" onClick={() => history.push(`/details/${rowData.name}`)}>
                    <img src={rowData.image} alt="" style={{ width: '2.5vw', height: '2.5vw', borderRadius: "50%", marginRight: "1.5vw" }} />
                    <div>{rowData.name}</div>
                </div>,
        },
        {
            title: <div style={{ display: "flex", alignItems: "center" }}>Chain <Tooltip title={"Ethereum chain coming soon"} placement="bottom">
                <HelpIcon style={{ color: 'grey', width: 20, height: 20, marginLeft: "5%" }} />
            </Tooltip></div>,
            align: "right",
            width: "5%",
            render: (rowData) => <img src={solanaImage} alt="solana" style={{ width: '1vw', height: '1vw', borderRadius: "50%" }} />
        },
        {
            title: "Floor Price", field: "floorPrice",
            align: "right",
            render: (rowData) => { return <div>◎ {round(rowData.floorPrice)}</div> }
        },
        {
            title: `Floor Price % (${time})`,
            align: "right",
            customSort: (a, b) => parseFloat(generateFpShock(a)) - parseFloat(generateFpShock(b)),
            render: (rowData) => { return <div style={{ color: generateColor(generateFpShock(rowData)) }}>{generateFpShock(rowData)} %</div> }
        },
        {
            title: `Listed Count`, field: "listedCount",
            align: "right",
        },
        {
            title: `Listed Count % (${time})`,
            align: "right",
            customSort: (a, b) => parseFloat(generateListedCountShock(a)) - parseFloat(generateListedCountShock(b)),
            render: (rowData) => { return <div style={{ color: generateColor(generateListedCountShock(rowData)) }}>{generateListedCountShock(rowData)} %</div> }
        },
        {
            title: `Volume 24h`, field: "volume24h",
            align: "right",
            render: (rowData) => { return <div>◎ {round(rowData.volume24h)}</div> }
        },
        {
            title: `Volume % (${time})`,
            align: "right",
            customSort: (a, b) => parseFloat(generateVolumeShock(a)) - parseFloat(generateVolumeShock(b)),
            render: (rowData) => { return <div style={{ color: generateColor(generateVolumeShock(rowData)) }}>{round(generateVolumeShock(rowData))} %</div> }
        },
        { title: "Volume (All time)", field: "volumeAll", type: "numeric", defaultSort: "desc", render: (rowData) => { return <div>◎ {round(rowData.volumeAll)}</div> } }
    ];

    return (
        <div>
            <h1 className="dashboard_title">Home</h1>

            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <div style={{color: "#A8B3CF", marginRight: "1vw"}}>Time: </div>
                <Box sx={{ width: '100%' }}>
                    <Tabs
                        value={time}
                        onChange={handleChangeTime}
                        textColor="secondary"
                        indicatorColor="primary"
                        aria-label="Date Tab"
                    >
                        <Tab value="1h" label={<span style={{ color: 'white' }}>1h</span>} />
                        <Tab value="6h" label={<span style={{ color: 'white' }}>6h</span>} />
                        <Tab value="1d" label={<span style={{ color: 'white' }}>1d</span>} />
                        <Tab value="7d" label={<span style={{ color: 'white' }}>7d</span>} />
                    </Tabs>
                </Box>

            </div>

            
            <MaterialTable
                style={{ color: "white", backgroundColor: "#1c1f26", border: "none", borderRadius: "2em", marginBottom: "10vh" }}
                isLoading={data.length === 0}
                icons={tableIcons}
                columns={columns}
                data={data}
                options={{
                    sorting: true,
                    search: true,
                    paging: true,
                    pageSize: 20,
                    showTitle: false,
                    emptyRowsWhenPaging: false,
                    pageSizeOptions: [20, 50, 100],
                    headerStyle: { backgroundColor: "#1c1f26", fontFamily: "BumbleGum", fontSize: "1vw" },
                    searchFieldStyle: { color: "white", backgroundColor: "#1c1f26", border: "none", borderRadius: "2em", width: "100%" }
                }}
                localization={{
                    body: {
                        emptyDataSourceMessage: "Loading..."
                    },
                }}
            />
        </div>
    );
};

export default AllCollection;