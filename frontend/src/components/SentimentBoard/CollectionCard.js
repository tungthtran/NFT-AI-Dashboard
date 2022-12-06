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

const BorderLinearProgressHype = styled(LinearProgress)(({ theme }) => ({
    height: 9,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: '#1c1f26',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? 'rgb(242, 181, 127)' : 'yellow',
    },
}));

export default function CollectionCard({ img, name, description, emotion_pos, emotion_anger, emotion_sadness, url,
    neg, neu, pos, hype, twitter, discord, me, price, supply, website }) {
    const descriptionToolTip = <div>
        <Typography variant="body2" style={{ marginBottom: "1vh" }}>{description}</Typography>
        <div className="statChip">
            {price && <Chip label={price} style={{ color: "white", backgroundColor: "rgb(54, 57, 91)" }} />}
            {supply && <Chip label={supply + " supply "} style={{ color: "white", backgroundColor: "rgb(54, 57, 91)" }} />}
        </div></div>

    const history = useHistory();

    const directToDetailPage = (e) => {
        e.preventDefault();
        history.push(`/details/${name}`);
    }

    return (
        <ThemeProvider theme={theme}>
            <Card style={{ border: "none", borderRadius: '2em', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', backgroundColor: '#1c1f26', marginRight: "1vh", position: "relative" }}>

                <CardActionArea>
                    <Tooltip title={descriptionToolTip} placement="bottom">
                        <CardMedia
                            onClick={directToDetailPage}
                            component="img"
                            image={img}
                            alt={name}
                            style={{ height: "20vh" }}
                        />
                    </Tooltip>

                    <CardContent onClick={directToDetailPage}>
                        <Typography gutterBottom variant="h5" color="white" style={{ marginBottom: "3vh" }}>
                            {name}
                        </Typography>


                        {<Grid container spacing={1} style={{ color: "rgb(282, 181, 127)" }} alignItems="center">
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


                        <Typography color="#A8B3CF" style={{ textAlign: "left", marginTop: "5%", marginBottom: "5%" }}>
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

                        <Typography color="#A8B3CF" style={{ textAlign: "left", marginTop: "5%", marginBottom: "5%" }}>
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
                </CardActions>
            </Card>
        </ThemeProvider>
    );
}