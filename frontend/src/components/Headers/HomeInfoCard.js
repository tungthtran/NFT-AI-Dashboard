import { Grid } from "@mui/material";
import { Card, CardBody, CardTitle } from "reactstrap";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import React, { useState, useEffect } from 'react';
import { AuthContext } from "../../App";
import { round } from "../../helper/utils";

const HomeInfoCard = () => {

    const titles = ["🔥 Trending", "Biggest Volume Shockers", "New Collections"]
    const { state } = React.useContext(AuthContext);

    const [trendingList, setTrendingList] = useState([])
    const [newCollection, setNewCollection] = useState([])
    const [volume1h, setVolume1h] = useState([])

    const stats = {
        "🔥 Trending": trendingList,
        "Biggest Volume Shockers": volume1h,
        "New Collections": newCollection
    }

    const generateArrow = (number) => {
        if (number >= 0) {
            return <div style={{ color: "rgb(132, 235, 176)" }}>
                <TrendingUpIcon /> {round(number)} %
            </div>
        }
        else {
            return <div style={{ color: "rgb(240, 131, 131)" }}>
                <TrendingDownIcon /> {round(number * -1)} %
            </div>
        }
    }

    useEffect(() => {
        const array = state.sentimentBoard1d?.sort((a, b) => b.shock?.shock1hr?.floorPrice - a.shock?.shock1hr?.floorPrice).filter(i => i.shock?.shock1hr?.floorPrice !== -1).slice(0, 3).map(c => { return { name: c.name, floorPrice: c.floorPrice, change: c.shock?.shock1hr?.floorPrice, symbol: c.symbol } })
        setTrendingList(array);

        const array2 = state.sentimentBoardNewCollection?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).filter(i => i.floorPrice !== -1).slice(0, 3).map(c => { return { name: c.name, floorPrice: c.floorPrice, symbol: c.symbol } })
        setNewCollection(array2);

        const array3 = state.sentimentBoardAllTrending?.sort((a, b) => b.shock?.shock1hr?.volume - a.shock?.shock1hr?.volume).slice(0, 3).map(c => { return { name: c.name, change: c.shock?.shock1hr?.volume, symbol: c.symbol } })
        setVolume1h(array3)

    }, [state.sentimentBoard1d, state.sentimentBoardNewCollection, state.sentimentBoardAllTrending])

    const generateContent = (title) => {
        if (title === "Biggest Volume Shockers") {
            return stats[title]?.map(c => <div onClick={() => window.open(`https://magiceden.io/marketplace/${c.symbol}`, "_blank")} style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", cursor: "pointer"}}>{c.name} <div>{generateArrow(c.change)}</div></div>)
        }
        else if (title === "🔥 Trending") {
            return stats[title]?.map(c => <div onClick={() => window.open(`https://magiceden.io/marketplace/${c.symbol}`, "_blank")} style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", cursor: "pointer"}}><div>{c.name}</div> <div>{"◎ " + round(c.floorPrice)}</div> <div>{generateArrow(c.change)}</div></div>)
        }
        else {
            return stats[title]?.map(c => <div onClick={() => window.open(`https://magiceden.io/marketplace/${c.symbol}`, "_blank")} style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", cursor: "pointer"}}><div>{c.name}</div> <div>{"◎ " + round(c.floorPrice)}</div></div>)
        }
    }

    return (
        <Grid spacing={2} container direction="row"
            alignItems="center"
            justifyContent="space-evenly"
            style={{ marginBottom: "8vh", marginTop: "5vh" }}
        >
            {titles.map(title => <Grid item xs={3.5} >
                <Card style={{ borderRadius: "2em", color: "white", backgroundColor: "#2B2B43", textAlign: "center" }}>
                    <CardBody>
                        <CardTitle
                            tag="h6"
                            className="text-uppercase text-muted mb-4"
                        >
                            {title}
                        </CardTitle>
                        <div className="h5 font-weight-bold mb-3">
                            {/* {stats[title]} */}
                        </div>
                        {generateContent(title)}
                    </CardBody>
                </Card>
            </Grid>)}
        </Grid>
    );
};

export default HomeInfoCard;
