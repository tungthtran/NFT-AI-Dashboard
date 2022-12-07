import { FormControl, Grid, makeStyles, Select } from '@material-ui/core';
import React, { useEffect, useState, Suspense } from 'react';
import "../../css/Dashboard.css"
import CircularProgress from '@mui/material/CircularProgress';
import { Autocomplete } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { chunks } from '../../helper/utils'
import MenuItem from '@mui/material/MenuItem';
import { AuthContext } from "../../App";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const CollectionCard = React.lazy(() => import('./CollectionCard'));

const useStyles = makeStyles(() => ({
    ul: {
        "& .MuiPaginationItem-root": {
            color: "white",
            '&.Mui-selected': {
                background: 'grey',
            },
        },
    }
}));

const SentimentBoard = ({ dispatch, date }) => {

    const COLLECTION_PER_PAGE = 20;

    const classes = useStyles();

    const { state } = React.useContext(AuthContext);

    const [sentimentData, setSentimentData] = useState([])

    const [sortedData, setSortedData] = useState([])

    const [sortValue, setSortValue] = useState("Positive")

    const [orderValue, setOrderValue] = useState("Descending")

    const [me, setMe] = useState(true)

    const [page, setPage] = React.useState(1);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const getUniqueCollections = (collections) => {
        let collectionSet = new Set()
        let uniqueCol = []
        for (const collection of collections) {
            const name = collection.name ? collection.name : collection.collection_name
            if (name && !collectionSet.has(name)) {
                uniqueCol.push(collection)
                collectionSet.add(name)
            }
        }
        return uniqueCol
    }

    useEffect(() => {
        switch (date) {
            case "1h":
                setMe(true);
                if (state.sentimentBoard1h) setSentimentData(state.sentimentBoard1h)
                break;
            case "new-collections":
                setMe(true);
                if (state.sentimentBoardNewCollection) setSentimentData(state.sentimentBoardNewCollection)
                break;
            case "1day":
                setMe(true);
                if (state.sentimentBoard1d) setSentimentData(state.sentimentBoard1d)
                break;
            case "7days":
                setMe(true);
                if (state.sentimentBoard7d) setSentimentData(state.sentimentBoard7d)
                break;

            //all
            default:
                setMe(true);
                let allCollection = []
                if (state.sentimentBoardNewCollection && state.sentimentBoard1d && state.sentimentBoard7d && state.sentimentBoard1h) {
                    allCollection = allCollection.concat(state.sentimentBoardNewCollection).concat(state.sentimentBoard1d).concat(state.sentimentBoard7d).concat(state.sentimentBoard1h)
                    allCollection = getUniqueCollections(allCollection)
                }
                setSentimentData(allCollection)
                break;
        }

    }, [date, state.sentimentBoardNewCollection, state.sentimentBoard1h, state.sentimentBoard1d, state.sentimentBoard7d])


    useEffect(() => {

        setSortValue("Positive")
        setOrderValue("Descending")
        setSortedData(sentimentData.sort((a, b) => b.twitter_sent_avg_positive - a.twitter_sent_avg_positive));

        // eslint-disable-next-line
    }, [sentimentData])

    const handleHelper = (sortBy, order) => {
        switch (sortBy) {
            case "Positive":
                if (order === "Descending") setSortedData(sentimentData.sort((a, b) => b.twitter_sent_avg_positive - a.twitter_sent_avg_positive))
                else setSortedData(sentimentData.sort((a, b) => a.twitter_sent_avg_positive - b.twitter_sent_avg_positive))
                break;
            case "Neutral":
                if (order === "Descending") setSortedData(sentimentData.sort((a, b) => b.twitter_sent_avg_neutral - a.twitter_sent_avg_neutral))
                else setSortedData(sentimentData.sort((a, b) => a.twitter_sent_avg_neutral - b.twitter_sent_avg_neutral))
                break;
            case "Negative":
                if (order === "Descending") setSortedData(sentimentData.sort((a, b) => b.twitter_sent_avg_negative - a.twitter_sent_avg_negative))
                else setSortedData(sentimentData.sort((a, b) => a.twitter_sent_avg_negative - b.twitter_sent_avg_negative))
                break;
            case "Happy":
                if (order === "Descending") setSortedData(sentimentData.sort((a, b) => (b.twitter_emo_avg_joy + b.twitter_emo_avg_optimism) - (a.twitter_emo_avg_joy + a.twitter_emo_avg_optimism)))
                else setSortedData(sentimentData.sort((a, b) => (a.twitter_emo_avg_joy + a.twitter_emo_avg_optimism) - (b.twitter_emo_avg_joy + b.twitter_emo_avg_optimism)))
                break;
            case "Sad":
                if (order === "Descending") setSortedData(sentimentData.sort((a, b) => b.twitter_emo_avg_sadness - a.twitter_emo_avg_sadness))
                else setSortedData(sentimentData.sort((a, b) => a.twitter_emo_avg_sadness - b.twitter_emo_avg_sadness))
                break;
            case "Angry":
                if (order === "Descending") setSortedData(sentimentData.sort((a, b) => b.twitter_emo_avg_anger - a.twitter_emo_avg_anger))
                else setSortedData(sentimentData.sort((a, b) => a.twitter_emo_avg_anger - b.twitter_emo_avg_anger))
                break;
            default: //Positive
                if (order === "Descending") setSortedData(sentimentData.sort((a, b) => b.twitter_sent_avg_positive - a.twitter_sent_avg_positive))
                else setSortedData(sentimentData.sort((a, b) => a.twitter_sent_avg_positive - b.twitter_sent_avg_positive))
                break;
        }
        setPage(1)
    }

    const handleSortByChange = (event) => {
        setSortValue(event.target.value);
        handleHelper(event.target.value, orderValue)
    }

    const handleOrderChange = (event) => {
        setOrderValue(event.target.value);
        handleHelper(sortValue, event.target.value)
    }

    const rawHypeScore = (norm, twitterFollowers, twitterComments) => {
        const normScale = 0.2 * 1000 * 1;
        const twitterFollowerScale = 0.6;
        const twitterCommentScale = 0.2 * 1;
        const score = norm * normScale + twitterFollowers * twitterFollowerScale + twitterComments * twitterCommentScale;
        return score
    }

    const sigmoid = (k, x0, x) => {
        return 1 / (1 + Math.exp(-k * (x - x0)))
    }

    const normalizeScore = (score) => {
        return sigmoid(4, 0.5, score / 10000);
    }

    const renderUpcoming = (collections) => {

        let rows = collections.map((collection, idx) => {

            let neg = collection.twitter_sent_avg_negative * 100;
            let neu = collection.twitter_sent_avg_neutral * 100;
            let pos = collection.twitter_sent_avg_positive * 100;
            neg = neg.toFixed(0)
            neu = neu.toFixed(0)
            pos = pos.toFixed(0)

            let { twitter_emo_avg_anger, twitter_emo_avg_joy, twitter_emo_avg_optimism, twitter_emo_avg_sadness, price, supply, website } = collection

            let emotion_pos = ((twitter_emo_avg_joy + twitter_emo_avg_optimism) * 100).toFixed(0)
            twitter_emo_avg_anger = (twitter_emo_avg_anger * 100).toFixed(0)
            twitter_emo_avg_sadness = (twitter_emo_avg_sadness * 100).toFixed(0)

            let url = `https://magiceden.io/marketplace/${collection.symbol}`
            let twitter = collection.twitter
            let discord = collection.discord

            let twitterFollowers = collection.twitter_followers_count
            let twitterComments = collection.twitter_tweet_count
            let normSentiment = collection.twitter_sent_avg_norm

            let rawScore = rawHypeScore(normSentiment, twitterFollowers, twitterComments)
            let hypeScore = (normalizeScore(rawScore) * 100).toFixed(0)

            return (
                <Grid item xs={3} key={idx} style={{ marginBottom: "10vh" }} >
                    <Suspense fallback={<CircularProgress color="primary" />}>
                        <CollectionCard img={collection.image}
                            name={collection.name}
                            key={collection._id}
                            description={collection.description}
                            emotion_pos={emotion_pos}
                            emotion_anger={twitter_emo_avg_anger}
                            emotion_sadness={twitter_emo_avg_sadness}
                            pos={pos}
                            neg={neg}
                            neu={neu}
                            hype={hypeScore}
                            url={url}
                            price={price}
                            supply={supply}
                            website={website}
                            twitter={twitter}
                            discord={discord}
                            me={me}
                        />
                    </Suspense>
                </Grid>
            )
        });

        return rows;
    }

    const generateTitle = (date) => {
        if (date === "new-collections") {
            return "New Releases Popular 🔥"
        }
        else if (date === "1h") {
            return "1h Popular 🔥"
        }
        else if (date === "1h") {
            return "1h Popular 🔥"
        }
        else if (date === "1day") {
            return "24h Popular 🔥"
        }
        else if (date === "7days") {
            return "7 Days Popular 🔥"
        }
        else {
            return "Trending Collections"
        }
    }

    const searchBar = (<Autocomplete
        loading={sortedData.length === 0}
        id="searchBarCollection"
        options={sortedData}
        autoComplete
        autoHighlight
        style={{ backgroundColor: "#1c1f26", width: "40%", borderRadius: "2em" }}
        onChange={(event, newValue) => {
            if (!newValue) {
                setSortedData(sentimentData);
            }
            else {
                const selectCollection = sortedData.find((e) => e.name === newValue.name);
                setSortedData([selectCollection]);
            }
            setPage(1)
        }}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option._id}>
                <img
                    loading="lazy"
                    width="20"
                    src={option.image}
                    srcSet={`${option.image} 2x`}
                    alt=""
                />
                {option.name}
            </Box>
        )}
        renderInput={(params) => (
            <TextField
                sx={{ input: { color: 'white' } }}
                {...params}
                label="🔍 Search collection"
                autoComplete='off'
                InputLabelProps={{
                    style: { color: '#A8B3CF' },
                }}
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                    form: {
                        autocomplete: 'off',
                    },
                    border: 'none'
                }}
            />
        )}
    />)

    const sortBy = (
        <div style={{ display: "flex", alignItems: "center", color: '#A8B3CF' }}>
            Sort by:
            <div>
                <FormControl sx={{ m: 1, width: 200 }}>
                    <Select
                        style={{ marginLeft: "1vw", color: "white", borderWidth: 0, borderRadius: "2em", backgroundColor: "#1c1f26", width: "100%" }}
                        id="sortBy"
                        value={sortValue}
                        onChange={handleSortByChange}
                    >
                        <MenuItem key={1} value={"Positive"}>👍 Positive</MenuItem>
                        <MenuItem key={2} value={"Neutral"}>🤏 Neutral</MenuItem>
                        <MenuItem key={3} value={"Negative"}>👎 Negative</MenuItem>
                        <MenuItem key={4} value={"Happy"}>🤗 Happy</MenuItem>
                        <MenuItem key={5} value={"Sad"}>😢 Sad</MenuItem>
                        <MenuItem key={6} value={"Angry"}>🤬 Angry</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    )

    const order = (
        <div style={{ display: "flex", alignItems: "center", color: '#A8B3CF' }}>
            Order:
            <div>
                <FormControl sx={{ m: 1, width: 200 }}>
                    <Select
                        style={{ marginLeft: "1vw", color: "white", borderWidth: 0, borderRadius: "2em", backgroundColor: "#1c1f26", width: "100%" }}
                        id="order"
                        value={orderValue}
                        onChange={handleOrderChange}
                    >
                        <MenuItem key={0} value={"Descending"}>Descending</MenuItem>
                        <MenuItem key={1} value={"Ascending"}>Ascending</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    )

    const paginations = (
        <Stack spacing={2}>
            <Pagination classes={{ ul: classes.ul }} count={Math.ceil(sortedData.length / COLLECTION_PER_PAGE)} page={page} onChange={handleChangePage} />
        </Stack>
    )

    return (
        <div>

            <h1 className='dashboard_title'>{generateTitle(date)}</h1>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5vh" }}>
                {searchBar}
                {paginations}
                {sortBy}
                {order}
            </div>

            {sortedData && <Grid container alignItems="stretch" style={{ display: "flex" }}>
                {chunks(sortedData.slice((page - 1) * COLLECTION_PER_PAGE, page * COLLECTION_PER_PAGE), 4).map((collections, idx) => {
                    return <Grid
                        id={idx}
                        key={idx}
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        item
                        style={{ display: 'flex' }}
                    >
                        {renderUpcoming(collections)}
                    </Grid>

                })}
            </Grid>}

        </div>
    );
};

export default SentimentBoard;