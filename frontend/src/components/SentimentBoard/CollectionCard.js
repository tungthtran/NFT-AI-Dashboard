import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, LinearProgress, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { linearProgressClasses } from '@mui/material/LinearProgress';
import "../../css/CollectionCard.css"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple, red, blue } from '@mui/material/colors';
import magicedenicon from '../../assets/magicedenicon.png';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FaTwitter, FaDiscord, } from "react-icons/fa";
import LanguageIcon from '@mui/icons-material/Language';
import { Grid } from '@material-ui/core';
import HelpIcon from '@mui/icons-material/Help';
import { useHistory } from "react-router-dom";

const theme = createTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: red[500],
        },
        blue: {
            main: blue[500],
        },
        discordColor: {
            main: "rgb(88, 101, 242)",
        },
        customWhite: {
            main: "rgb(255, 255, 255)"
        },
        speaker: {
            main: "#ffdf00"
        }
    },
});

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

const BorderLinearProgressHype = styled(LinearProgress)(({ theme }) => ({
    height: 9,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: 'rgb(37, 40, 77)',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? 'rgb(242, 181, 127)' : 'yellow',
    },
}));

export default function CollectionCard({ img, name, description, emotion_pos, emotion_anger, emotion_sadness, url,
    neg, neu, pos, hype, twitter, discord, me, price, supply, website, launch_date, tag, hunting, shock, dispatch, db_tag }) {
    const descriptionToolTip = <div>
        <Typography variant="body2" style={{ marginBottom: "1vh" }}>{description}</Typography>
        <div className="statChip">
            {price && <Chip label={price} style={{ color: "white", backgroundColor: "rgb(54, 57, 91)" }} />}
            {supply && <Chip label={supply + " supply "} style={{ color: "white", backgroundColor: "rgb(54, 57, 91)" }} />}
        </div></div>

    // const [openTimeseriesTwitter, setOpenTimeseriesTwitter] = React.useState(false);

    // const [openTimeseriesDiscord, setOpenTimeseriesDiscord] = React.useState(false);

    const [openHuntingVerification, setOpenHuntingVerification] = React.useState(false);

    // const [openAnnouncements, setOpenAnnouncements] = React.useState(false);

    const history = useHistory();

    // const toggleOpenTimeseriesTwitter = () => {
    //     // Send a custom event

    //     if (!openTimeseriesTwitter) {
    //         ReactGA.event({
    //             category: "sentimentboard",
    //             action: "view_sentiment",
    //             label: name, // optional
    //         });
    //         setOpenTimeseriesTwitter(!openTimeseriesTwitter);
    //     }
    //     if (!openTimeseriesTwitter) setOpenTimeseriesTwitter(!openTimeseriesTwitter);
    // }

    // const toggleOpenTimeseriesDiscord = () => {
    //     // Send a custom event

    //     if (!openTimeseriesDiscord) {
    //         ReactGA.event({
    //             category: "sentimentboard",
    //             action: "view_sentiment",
    //             label: name, // optional
    //         });
    //         setOpenTimeseriesDiscord(!openTimeseriesDiscord);
    //     }
    //     if (!openTimeseriesDiscord) setOpenTimeseriesDiscord(!openTimeseriesDiscord);
    // }

    const toggleOpenHuntingVerification = () => {
        if (!openHuntingVerification) setOpenHuntingVerification(!openHuntingVerification);
    }

    // const toggleOpenAnnoucements = (e) => {
    //     e.stopPropagation();
    //     if (!openAnnouncements) setOpenAnnouncements(!openAnnouncements);
    // }

    // const generateTwitterDiscordButton = () => {
    //     if(!hunting && db_tag && db_tag.includes('upcoming')) {
    //         return <Grid container spacing={1} style={{ color: "rgb(282, 181, 127)", marginBottom: "10%" }} alignItems="center">
    //             <Grid xs={6} item>
    //                 <div onClick={toggleOpenTimeseriesTwitter} className="button twitter">Twitter Sentiments</div>
    //             </Grid>

    //             <Grid xs={6} item>
    //                 <div onClick={toggleOpenTimeseriesDiscord} className="button discord">Discord Analytics</div>
    //             </Grid>
    //         </Grid>
    //     }
    //     if(!hunting && db_tag && !db_tag.includes('upcoming')) {
    //         return <Grid container spacing={1} style={{ color: "rgb(282, 181, 127)", marginBottom: "10%" }} alignItems="center">
    //             <Grid xs={12} item>
    //                 <div onClick={() => history.push(`/details/${name}`)} className="button twitter">Twitter Sentiments</div>
    //             </Grid>
    //         </Grid>
    //     }
    // }

    const directToDetailPage = (e) => {
        e.preventDefault();
        history.push(`/details/${name}`);
    }

    return (
        <ThemeProvider theme={theme}>
            <Card style={{ border: "none", borderRadius: '2em', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', backgroundColor: 'rgb(37, 40, 77)', marginRight: "1vh", position: "relative" }}>

                {launch_date && <Chip label={new Date(launch_date).toDateString()} style={{ position: "absolute", right: 10, top: 5, color: "white", backgroundColor: "rgb(54, 57, 91)", zIndex: 1 }} />}

                <CardActionArea>
                    <Tooltip title={descriptionToolTip} placement="bottom">
                        <CardMedia
                            onClick={hunting ? toggleOpenHuntingVerification : directToDetailPage}
                            component="img"
                            image={img}
                            alt={name}
                            style={{ height: "20vh" }}
                        />
                    </Tooltip>

                    {/* <TimeSeriesDialog
                        name={name}
                        emotion_pos={emotion_pos}
                        emotion_sadness={emotion_sadness}
                        emotion_anger={emotion_anger}
                        pos={pos}
                        neu={neu}
                        neg={neg}
                        img={img}
                        setOpenTimeseries={setOpenTimeseriesTwitter}
                        openTimeseries={openTimeseriesTwitter}
                        tag={tag}
                        shock={shock}
                    />

                    <DiscordDataDialog
                        name={name}
                        setOpenTimeseries={setOpenTimeseriesDiscord}
                        openTimeseries={openTimeseriesDiscord}
                    /> */}
                    

                    <CardContent onClick={hunting ? toggleOpenHuntingVerification : directToDetailPage}>
                        <Typography gutterBottom variant="h5" color="white" style={{ marginBottom: "3vh" }}>
                            {name}
                        </Typography>

                        {/* {generateTwitterDiscordButton()} */}

                        {/* {!hunting && tag !== 'upcoming' && console.log(tag) && <Grid container spacing={1} style={{ color: "rgb(282, 181, 127)", marginBottom: "10%" }} alignItems="center">
                            <Grid xs={12} item>
                                <div onClick={toggleOpenTimeseriesTwitter} className="button twitter">Twitter Sentiments</div>
                            </Grid>
                        </Grid>} */}


                        {tag === "upcoming" && <Grid container spacing={1} style={{ color: "rgb(282, 181, 127)" }} alignItems="center">
                            <Grid style={{ textAlign: "left" }} xs item>
                                🔥 Hype:
                            </Grid>

                            <Grid xs item>
                                <BorderLinearProgressHype variant="determinate" value={hype} />
                            </Grid>

                            <Grid style={{ textAlign: "right" }} xs item>
                                {hype}
                            </Grid>
                        </Grid>}


                        <Typography color="rgb(96, 98, 123)" style={{ textAlign: "left", marginTop: "5%", marginBottom: "5%" }}>
                            SENTIMENT ANALYSIS <Tooltip title={"Sentiment is how emotionally people think about a project in all aspects (art, utility, pump, future,etc.)"} placement="right">
                                <HelpIcon style={{ width: 20, height: 15, marginBottom: "0.5%" }} />
                            </Tooltip>
                        </Typography>

                        <Grid container spacing={1} alignItems="center">
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


                        <Grid container spacing={1} alignItems="center">
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

                        <Grid container spacing={1} alignItems="center">
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

                        <Typography color="rgb(96, 98, 123)" style={{ textAlign: "left", marginTop: "5%", marginBottom: "5%" }}>
                            MOOD <Tooltip title={"Mood is the feeling of people/holders about the project overall"} placement="bottom">
                                <HelpIcon style={{ width: 20, height: 15, marginBottom: "0.5%" }} />
                            </Tooltip>
                        </Typography>

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

                    </CardContent>
                </CardActionArea>
                <CardActions disableSpacing style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "5%" }}>
                    {url && me && <IconButton onClick={() => window.open(url, "_blank")} color="secondary">
                        <img alt="ME" src={magicedenicon} style={{ width: "2vw" }} />
                    </IconButton>}
                    {website && <IconButton onClick={() => window.open(website, "_blank")} color="customWhite">
                        <LanguageIcon style={{ width: "2vw" }} />
                    </IconButton>}
                    <IconButton onClick={() => window.open(twitter, "_blank")} color="blue">
                        <FaTwitter style={{ width: "2vw" }} />
                    </IconButton>
                    <IconButton onClick={() => window.open(discord, "_blank")} color="discordColor">
                        <FaDiscord style={{ width: "2vw" }} />
                    </IconButton>
                    {/* <Tooltip title='Recent announcements in discord'>
                        <IconButton onClick={toggleOpenAnnoucements} color="speaker">
                            <HiOutlineSpeakerphone style={{ width: "2vw" }} />
                        </IconButton>
                    </Tooltip> */}

                </CardActions>
            </Card>
        </ThemeProvider>
    );
}