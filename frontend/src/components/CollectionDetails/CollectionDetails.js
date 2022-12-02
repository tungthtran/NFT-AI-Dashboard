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
import DiscordVolumeChart from '../Graph/DiscordVolumeChart';
import Loading from '../Loading/Loading';
import Message from "../Dialog/Message";
import "../css/Chat.css";
import ChatHeader from '../Dialog/ChatHeader';
import TradingViewChartV2 from '../Graph/TradingViewChartV2';

const CollectionDetails = (props) => {

    const { state } = React.useContext(AuthContext);
    const [timeSeries, setTimeSeries] = React.useState(null);

    const [discordData, setDiscordData] = React.useState(null);

    const [emotionData, setEmotionData] = React.useState(null);

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
    const [isUpcoming, setIsUpcoming] = useState(false)

    const [announcements, setAnnouncements] = useState([])

    const [time, setTime] = useState("30min")
    // const [isNormalized, setIsNormalized] = React.useState(false);
    // const [addListedCount, setAddListedCount] = React.useState(false);

    const BorderLinearProgressRed = styled(LinearProgress)(({ theme }) => ({
        height: 9,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: 'rgb(37, 40, 77)',
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
            backgroundColor: 'rgb(37, 40, 77)',
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
            backgroundColor: 'rgb(37, 40, 77)',
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? 'rgb(250, 224, 145)' : 'yellow',
        },
    }));

    const getAnnouncements = async (name) => {
        const url = process.env.REACT_APP_BACKEND + "/get-announcements"
        const announcementsData = (await axios.post(url, { "collectionName": name })).data
        setAnnouncements(announcementsData)
    }

    const getTwitterTimeSeriesData = async (name) => {
        const url = process.env.REACT_APP_BACKEND + "/load-collection-time-series"
        const timeSeriesData = (await axios.post(url, { "name": name })).data
        setTimeSeries(timeSeriesData)
    }

    const getDiscordTimeSeriesData = async (name) => {
        const url = process.env.REACT_APP_BACKEND + "/load-discord-time-series"
        const timeSeriesData = (await axios.post(url, { "collectionName": name })).data
        setDiscordData(timeSeriesData)
    }

    const getEmotionTimeSeriesData = async (name) => {
        const url = process.env.REACT_APP_BACKEND + "/load-collection-emotion-time-series-web"
        const timeSeriesData = (await axios.post(url, { "query": name })).data
        setEmotionData(timeSeriesData)
    }

    useEffect(() => {
        if (name) {
            getTwitterTimeSeriesData(name);
            getDiscordTimeSeriesData(name);
            getEmotionTimeSeriesData(name);
        }

    }, [name])

    useEffect(() => {
        if (isUpcoming) {
            getAnnouncements(name);
        }

    }, [isUpcoming, name])

    useEffect(() => {
        if (state.sentimentBoardAllTrending && state.sentimentBoardUpcoming && state.requestUpcoming) {

            let collections = [].concat(state.sentimentBoardAllTrending).concat(state.sentimentBoardUpcoming).concat(state.requestUpcoming)

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


            setIsUpcoming(collection?.tag.includes("upcoming"))

        }
        // eslint-disable-next-line
    }, [name, state.sentimentBoardAllTrending, state.sentimentBoardUpcoming, state.requestUpcoming])

    // const normalize = () => {
    //     setIsNormalized(!isNormalized);
    // }

    // const toggleAddListedCount = () => {
    //     setAddListedCount(!addListedCount);
    // }

    const handleChangeTab = (event, newValue) => {
        setOpenedTab(newValue)
    }

    const handleChangeTime = (event, newValue) => {
        setTime(newValue);
    };

    // const description = "Changing the value of sentiment scores and floor prices under [0, 1] scale for better comparison";

    // const description2 = "Adding listed count data to the chart for comparison"

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
                        {!isUpcoming && <InfoCard
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
                                {!isUpcoming && <Tab value="me" label={<span style={{ color: 'white', fontSize: "20px" }}>ME Insights</span>} />}
                                <Tab value="twitter" label={<span style={{ color: 'white', fontSize: "20px" }}>Twitter Sentiment</span>} />
                                {isUpcoming && <Tab value="discord" label={<span style={{ color: 'white', fontSize: "20px" }}>Discord analytics</span>} />}
                            </Tabs>
                        </Box>

                        {openedTab === "overview" &&
                            <Grid container>
                                <Grid xs={8} item>
                                    <TradingViewChart name={name} time={timeSeries.dateTime} value={timeSeries.norm.map((x) => x * 100)} value2={timeSeries.floorPrice} value3={timeSeries.listedCount} addListedCount={true} title="Sentiment vs Floor Price vs Listed Count" isNormalized={true} isUpcoming={isUpcoming} />

                                    {/* <div style={{ display: "flex", alignItems: "center" }}>
                                <FormGroup>
                                    <Tooltip title={description} placement="bottom-start">
                                        <FormControlLabel control={<Checkbox defaultChecked={false} checked={isNormalized} onClick={normalize} color="primary" />} label="Normalized" />
                                    </Tooltip>
                                </FormGroup>

                                <FormGroup>
                                    <Tooltip title={description2} placement="bottom-start">
                                        <FormControlLabel control={<Checkbox defaultChecked={false} checked={addListedCount} onClick={toggleAddListedCount} color="primary" />} label="Add Listed Count" />
                                    </Tooltip>
                                </FormGroup>
                            </div> */}

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
                                    {/* <div style={{ fontSize: "1.5vw", fontFamily: "BumbleGum", marginBottom: "4vh", textAlign: "left" }}>Hype
                                <Tooltip title={"Estimation of how hype a project is"} placement="bottom">
                                    <HelpIcon style={{ color: 'grey', width: 20, height: 20, marginLeft: "1%" }} />
                                </Tooltip>
                            </div> */}
                                    {/* <div style={{ width: "20vw" }}>
                                <Grid>
                                    <Grid container alignItems="center">
                                        <Grid style={{ color: "white", textAlign: "left" }} xs item>
                                            🔥 Hype:
                                        </Grid>

                                        <Grid xs item>
                                            <BorderLinearProgressHype variant="determinate" value={hype} />
                                        </Grid>

                                        <Grid style={{ color: "rgb(282, 181, 127)", textAlign: "right" }} xs item>
                                            {hype}%
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div> */}


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

                                {emotionData && emotionData !== {} && <Grid xs={8} item style={{ marginTop: "6vh" }}>
                                    <TradingViewChartV2 name={name} title={"Sentiment breakdown"} value={emotionData.positiveDict} value2={emotionData.neutralDict} value3={emotionData.negativeDict} currentValue={round(emotionData.currentPositive)} currentValue2={round(emotionData.currentNeutral)} currentValue3={round(emotionData.currentNegative)} />

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <CircleIcon style={{ color: "rgb(132, 235, 176)", marginRight: "0.25vw" }} />
                                            <div>Positive</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <CircleIcon style={{ color: "rgb(250, 224, 145)", marginRight: "0.25vw" }} />
                                            <div>Neutral</div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <CircleIcon style={{ color: "rgb(240, 131, 131)", marginRight: "0.25vw" }} />
                                            <div>Negative</div>
                                        </div>
                                    </div>
                                </Grid>}
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
                                {!isUpcoming && <Grid xs={6} item>
                                    <TradingViewChart time={timeSeries.dateTime} value={timeSeries.floorPrice} title="Floor Price" />
                                    <TradingViewChart time={timeSeries.dateTime} value={timeSeries.volume24h} title="Volume (24 hours)" />
                                </Grid>}

                                {!isUpcoming && <Grid xs={6} item>
                                    <TradingViewChart time={timeSeries.dateTime} value={timeSeries.listedCount} title="Listed count" />
                                    <TradingViewChart time={timeSeries.dateTime} value={timeSeries.volumeAll} title="Volume (All time)" />
                                </Grid>}

                            </Grid>}

                        {/* discord analytics start here */}
                        {openedTab === 'discord' && <Grid container>
                            {discordData && discordData.length !== 0 && <Grid container>
                                <Grid container>
                                    <Grid style={{ marginBottom: "2vh", display: "flex", alignItems: "center" }} xs={12} item>
                                        Time:
                                        <Box sx={{ width: '100%', marginLeft: "1vw" }}>
                                            <Tabs
                                                value={time}
                                                onChange={handleChangeTime}
                                                textColor="secondary"
                                                indicatorColor="secondary"
                                                aria-label="Date Tab"
                                            >
                                                <Tab value="30min" label={<span style={{ color: 'white' }}>30min</span>} />
                                                <Tab value="1h" label={<span style={{ color: 'white' }}>1h</span>} />
                                                <Tab value="6h" label={<span style={{ color: 'white' }}>6h</span>} />
                                                <Tab value="1d" label={<span style={{ color: 'white' }}>1d</span>} />
                                            </Tabs>
                                        </Box>
                                    </Grid>

                                    {time === "30min" && <Grid xs={6} item>
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.volume["30m"])} title="Chat Volume" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.unique_users["30m"])} title="Unique Users Chat" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.msg_per_user["30m"].mean)} title="Average Messages Per User" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.len_msg["30m"].mean)} title="Average Messages Length" />
                                    </Grid>}

                                    {time === "1h" && <Grid xs={6} item>
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.volume["1h"])} title="Chat Volume" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.unique_users["1h"])} title="Unique Users Chat" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.msg_per_user["1h"].mean)} title="Average Messages Per User" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.len_msg["1h"].mean)} title="Average Messages Length" />
                                    </Grid>}

                                    {time === "6h" && <Grid xs={6} item>
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.volume["6h"])} title="Chat Volume" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.unique_users["6h"])} title="Unique Users Chat" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.msg_per_user["6h"].mean)} title="Average Messages Per User" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.len_msg["6h"].mean)} title="Average Messages Length" />
                                    </Grid>}

                                    {time === "1d" && <Grid xs={6} item>
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.volume["1d"])} title="Chat Volume" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.unique_users["1d"])} title="Unique Users Chat" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.msg_per_user["1d"].mean)} title="Average Messages Per User" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.len_msg["1d"].mean)} title="Average Messages Length" />
                                    </Grid>}

                                    <Grid xs={6} item>
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.member_count)} title="Total Members Count" />
                                        <DiscordVolumeChart time={discordData.map(data => data.createdAt).reverse()} value={discordData.map(data => data.active_member_count)} title={`Online Members Count (${round(discordData[0].active_member_count / discordData[0].member_count * 100)} %)`} />
                                        <div className="chat">
                                            <ChatHeader channelName={name} discord={discord} />
                                            <div className="chat__messages">
                                                {announcements.map((announcement) => (
                                                    <Message
                                                        timestamp={announcement.timestamp}
                                                        message={announcement.content}
                                                        author_avatar={`https://cdn.discordapp.com/avatars/${announcement.author_id}/${announcement.author_avatar}.webp?size=64`}
                                                        author_name={announcement.author_name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </Grid>

                                </Grid>

                            </Grid>}

                            {discordData && discordData.length === 0 && <div style={{ fontSize: "1.5vw" }}>Discord has not been analyzed!</div>}
                        </Grid>}

                    </Grid>}
                </Grid>
            </Grid>
        </div>
    )
};

export default CollectionDetails;
