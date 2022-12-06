import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Tooltip } from '@material-ui/core';
import axios from "axios";
import TradingViewChart from "../Graph/TradingViewChart";
import { LinearProgress, linearProgressClasses } from '@mui/material';
import { round } from '../../helper/utils';
import InfoCard from '../Headers/InfoCard';
import { AuthContext } from "../../App";
import HelpIcon from '@mui/icons-material/Help';
import { FaTwitter, FaDiscord, } from "react-icons/fa";
import LanguageIcon from '@mui/icons-material/Language';
import magicedenicon from '../../assets/magicedenicon.png';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle';
import Loading from '../Loading/Loading';
import "../../css/Chat.css";

const CollectionDetails = (props) => {

    const { state } = React.useContext(AuthContext);
    const [timeSeries, setTimeSeries] = React.useState(null);

    const [name] = useState(props.match.params.collectionName)

    const [emotion_pos, setEmotion_pos] = useState(null)
    const [emotion_sadness, setEmotion_sadness] = useState(null)
    const [emotion_anger, setEmotion_anger] = useState(null)
    const [pos, setPos] = useState(null)
    const [neu, setNeu] = useState(null)
    const [neg, setNeg] = useState(null)
    const [img, setImg] = useState(null)
    const [collectionDescription, setCollectionDescription] = useState(null)
    const [shock, setShock] = useState(null)
    const [me, setMe] = useState(null)
    const [website, setWebsite] = useState(null)
    const [twitter, setTwitter] = useState(null)
    const [discord, setDiscord] = useState(null)
    const [openedTab, setOpenedTab] = useState("overview")

    const BorderLinearProgressRed = styled(LinearProgress)(({ theme }) => ({
        height: 9,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: '#1c1f26',
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? 'rgb(240, 131, 131)' : 'yellow',
        },
    }));

    const BorderLinearProgressGreen = styled(LinearProgress)(({ theme }) => ({
        height: 9,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: '#1c1f26',
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? 'rgb(132, 235, 176)' : 'yellow',
        },
    }));

    const BorderLinearProgressYellow = styled(LinearProgress)(({ theme }) => ({
        height: 9,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: '#1c1f26',
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? 'rgb(250, 224, 145)' : 'yellow',
        },
    }));

    const getTwitterTimeSeriesData = async (name) => {
        const url = process.env.REACT_APP_BACKEND + "/load-collection-time-series"
        const timeSeriesData = (await axios.post(url, { "name": name })).data
        setTimeSeries(timeSeriesData)
    }

    useEffect(() => {
        if (name) {
            getTwitterTimeSeriesData(name);
        }

    }, [name])

    useEffect(() => {
        if (state.sentimentBoardAllTrending) {

            let collections = [].concat(state.sentimentBoardAllTrending)

            let collection = collections.find(c => c.name === name);

            let negData = (collection?.twitter_sent_avg_negative * 100).toFixed(0);
            let neuData = (collection?.twitter_sent_avg_neutral * 100).toFixed(0);
            let posData = (collection?.twitter_sent_avg_positive * 100).toFixed(0);

            setNeg(negData)
            setNeu(neuData)
            setPos(posData)

            setCollectionDescription(collection?.description)

            let twitter_emo_avg_anger = collection?.twitter_emo_avg_anger
            let twitter_emo_avg_joy = collection?.twitter_emo_avg_joy
            let twitter_emo_avg_optimism = collection?.twitter_emo_avg_optimism
            let twitter_emo_avg_sadness = collection?.twitter_emo_avg_sadness

            let emotion_posData = ((twitter_emo_avg_joy + twitter_emo_avg_optimism) * 100).toFixed(0)
            twitter_emo_avg_anger = (twitter_emo_avg_anger * 100).toFixed(0)
            twitter_emo_avg_sadness = (twitter_emo_avg_sadness * 100).toFixed(0)

            setEmotion_pos(emotion_posData)
            setEmotion_sadness(twitter_emo_avg_sadness)
            setEmotion_anger(twitter_emo_avg_anger)

            setImg(collection?.image)
            setShock(collection?.shock)

            setMe(`https://magiceden.io/marketplace/${collection?.symbol}`)
            setTwitter(collection?.twitter)
            setDiscord(collection?.discord)
            setWebsite(collection?.website)
        }
        // eslint-disable-next-line
    }, [name, state.sentimentBoardAllTrending])

    const handleChangeTab = (event, newValue) => {
        setOpenedTab(newValue)
    }

    const latestValue = (array) => {
        return array[array.length - 1]
    }

    return (
        <div style={{ color: "white" }}>

            <Grid container>
                <Grid xs={12} item>

                    <img style={{ width: "10vw", height: "auto", borderRadius: "2em", marginBottom: "2vh" }} src={img} alt="" />

                    <div style={{ fontSize: "35px", marginBottom: "1vh" }}>{name}</div>

                    <div style={{ fontSize: "25px", color: "grey", marginBottom: "1vh" }}>{collectionDescription}</div>

                    <div style={{ marginBottom: "2vh" }}>
                        {me && <IconButton onClick={() => window.open(me, "_blank")} color="secondary">
                            <img alt="ME" src={magicedenicon} style={{ width: "50px" }} />
                        </IconButton>}
                        {website && <IconButton onClick={() => window.open(website, "_blank")} style={{ color: "white" }}>
                            <LanguageIcon style={{ width: "50px" }} />
                        </IconButton>}
                        {twitter && <IconButton onClick={() => window.open(twitter, "_blank")} style={{ color: "#1DA1F2" }}>
                            <FaTwitter style={{ width: "50px" }} />
                        </IconButton>}
                        {discord && <IconButton onClick={() => window.open(discord, "_blank")} style={{ color: "#5865F2" }}>
                            <FaDiscord style={{ width: "50px" }} />
                        </IconButton>}
                    </div>

                    {timeSeries === null && <Loading />}
                    {timeSeries !== undefined && timeSeries !== null && shock !== null && Object.keys(timeSeries).length !== 0 && <Grid style={{ marginLeft: "2vw", marginBottom: "5vh" }} container>
                        {<InfoCard
                            floorPrice={round(latestValue(timeSeries.floorPrice))}
                            volume24h={round(latestValue(timeSeries.volume24h))}
                            volumeAll={round(latestValue(timeSeries.volumeAll))}
                            listCount={latestValue(timeSeries.listedCount)}
                            followers={latestValue(timeSeries.follower)}
                            shock={shock}
                        />}

                        <Box sx={{ width: '100%', marginBottom: "5vh" }}>
                            <Tabs
                                value={openedTab}
                                onChange={handleChangeTab}
                                textColor="primary"
                                indicatorColor="primary"
                                aria-label="Opened Tab"
                            >
                                <Tab value="overview" label={<span style={{ color: 'white', fontSize: "20px" }}>Overview</span>} />
                                <Tab value="me" label={<span style={{ color: 'white', fontSize: "20px" }}>ME Insights</span>} />
                                <Tab value="twitter" label={<span style={{ color: 'white', fontSize: "20px" }}>Twitter Sentiment</span>} />
                            </Tabs>
                        </Box>

                        {openedTab === "overview" &&
                            <Grid container>
                                <Grid xs={8} item>
                                    <TradingViewChart name={name} time={timeSeries.dateTime} value={timeSeries.norm.map((x) => x * 100)} value2={timeSeries.floorPrice} value3={timeSeries.listedCount} addListedCount={true} title="Sentiment vs Floor Price vs Listed Count" isNormalized={true} />

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <CircleIcon style={{ color: "rgba(32, 226, 47, 1)", marginRight: "0.25vw" }} />
                                            <div>Sentiment</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <CircleIcon style={{ color: "rgba(33, 150, 243, 1)", marginRight: "0.25vw" }} />
                                            <div>Floor price</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <CircleIcon style={{ color: "#9932cc", marginRight: "0.25vw" }} />
                                            <div>Listed Count</div>
                                        </div>
                                    </div>

                                </Grid>

                                <Grid xs={4} item>
                                    <div style={{ fontSize: "1.5vw", fontFamily: "BumbleGum", marginBottom: "4vh", marginTop: "4vh", textAlign: "left" }}>Sentiment analysis
                                        <Tooltip title={"Sentiment is how emotionally people think about a project in all aspects (art, utility, pump, future,etc.)"} placement="bottom">
                                            <HelpIcon style={{ color: 'grey', width: 20, height: 20, marginLeft: "1%" }} />
                                        </Tooltip>
                                    </div>
                                    <div style={{ width: "20vw" }}>
                                        <Grid>
                                            <Grid container alignItems="center">
                                                <Grid style={{ color: "white", textAlign: "left" }} xs item>
                                                    Positive:
                                                </Grid>

                                                <Grid xs item>
                                                    <BorderLinearProgressGreen variant="determinate" value={pos} />
                                                </Grid>

                                                <Grid style={{ color: "rgb(132, 235, 176)", textAlign: "right" }} xs item>
                                                    {pos}%
                                                </Grid>
                                            </Grid>

                                            <Grid container alignItems="center">
                                                <Grid style={{ color: "white", textAlign: "left" }} xs item>
                                                    Neutral:
                                                </Grid>

                                                <Grid xs item>
                                                    <BorderLinearProgressYellow variant="determinate" value={neu} />
                                                </Grid>

                                                <Grid style={{ color: "rgb(250, 224, 145)", textAlign: "right" }} xs item>
                                                    {neu}%
                                                </Grid>
                                            </Grid>

                                            <Grid container alignItems="center">
                                                <Grid style={{ color: "white", textAlign: "left" }} xs item>
                                                    Negative:
                                                </Grid>

                                                <Grid xs item>
                                                    <BorderLinearProgressRed variant="determinate" value={neg} />
                                                </Grid>

                                                <Grid style={{ color: "rgb(240, 131, 131)", textAlign: "right" }} xs item>
                                                    {neg}%
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </div>

                                    <div style={{ fontSize: "1.5vw", fontFamily: "BumbleGum", marginBottom: "4vh", marginTop: "4vh", textAlign: "left" }}>
                                        Mood
                                        <Tooltip title={"Mood is the feeling of people/holders about the project overall"} placement="bottom">
                                            <HelpIcon style={{ color: 'grey', width: 20, height: 20, marginLeft: "1%" }} />
                                        </Tooltip>
                                    </div>

                                    <div style={{ width: "20vw" }}>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid style={{ color: "white", textAlign: "left" }} xs item>
                                                🤗 Happy:
                                            </Grid>

                                            <Grid xs item>
                                                <BorderLinearProgressGreen variant="determinate" value={emotion_pos} />
                                            </Grid>

                                            <Grid style={{ color: "rgb(132, 235, 176)", textAlign: "right" }} xs item>
                                                {emotion_pos}%
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={1} alignItems="center">
                                            <Grid style={{ color: "white", textAlign: "left" }} xs item>
                                                😢 Sad:
                                            </Grid>

                                            <Grid xs item>
                                                <BorderLinearProgressYellow variant="determinate" value={emotion_sadness} />
                                            </Grid>

                                            <Grid style={{ color: "rgb(250, 224, 145)", textAlign: "right" }} xs item>
                                                {emotion_sadness}%
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={1} alignItems="center">
                                            <Grid style={{ color: "white", textAlign: "left" }} xs item>
                                                🤬 Angry:
                                            </Grid>

                                            <Grid xs item>
                                                <BorderLinearProgressRed variant="determinate" value={emotion_anger} />
                                            </Grid>

                                            <Grid style={{ color: "rgb(240, 131, 131)", textAlign: "right" }} xs item>
                                                {emotion_anger}%
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>}

                        {openedTab === "twitter" && timeSeries !== undefined && timeSeries !== null &&
                            <Grid container>
                                <Grid xs={6} item>
                                    <TradingViewChart time={timeSeries.dateTime} value={timeSeries.norm.map((x) => x * 100)} title="Sentiment score" />
                                </Grid>

                                <Grid xs={6} item>
                                    <TradingViewChart time={timeSeries.dateTime} value={timeSeries.hype.map((x) => x * 100)} title="Hype score" />
                                </Grid>
                            </Grid>}

                        {openedTab === "me" && timeSeries !== undefined && timeSeries !== null &&
                            <Grid container>
                                <Grid xs={6} item>
                                    <TradingViewChart time={timeSeries.dateTime} value={timeSeries.floorPrice} title="Floor Price" />
                                    <TradingViewChart time={timeSeries.dateTime} value={timeSeries.volume24h} title="Volume (24 hours)" />
                                </Grid>

                                <Grid xs={6} item>
                                    <TradingViewChart time={timeSeries.dateTime} value={timeSeries.listedCount} title="Listed count" />
                                    <TradingViewChart time={timeSeries.dateTime} value={timeSeries.volumeAll} title="Volume (All time)" />
                                </Grid>

                            </Grid>}

                    </Grid>}
                </Grid>
            </Grid>
        </div>
    )
};

export default CollectionDetails;
