import React, { useEffect } from "react"
import './css/App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ConnectWrapper from './pages/ConnectWrapper';
import 'antd/dist/antd.css';
import Navbar from "./components/Navbar";
import { Box, makeStyles } from '@material-ui/core';
import YourCollection from "./pages/YourCollection";
import axios from "axios";
import SentimentBoard from "./components/SentimentBoard"
import HuntingTool from "./pages/HuntingTool";
import ReactGA from 'react-ga4';
import HuntingUnverified from "./components/Hunting/HuntingUnverified";
import AllCollection from "./pages/AllCollection";
import { getNFTs } from "./helper/wallet";
import HuntingToolOG from "./pages/HuntingToolOG";
import Multiviewers from "./components/Multiviewers/Multiviewers";
import CollectionDetails from "./components/Details/CollectionDetails";
import Header from "./components/Headers/Header"

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  publicKey: null,
  yourCollectibles: null,
  sentimentBoardUpcoming: null,
  sentimentBoardNewCollection: null,
  sentimentBoard1h: null,
  sentimentBoard1d: null,
  sentimentBoard7d: null,
  sentimentBoardAllTrending: null,
  personalWatchlist: null,
  activities: null,
  isAlpha: false,
  isOG: false,
  huntedCollections: false,
  huntedWatchlist: false,
  alphaKeyPhrase: null,
  watchlist: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated
      };
    case "SET_PUBLICKEY":
      return {
        ...state,
        publicKey: action.payload.publicKey
      }
    case "SET_YOUR_COLLECTIBLES":
      return {
        ...state,
        yourCollectibles: action.payload.yourCollectibles
      }
    case "SET_SENTIMENT_BOARD_UPCOMING":
      return {
        ...state,
        sentimentBoardUpcoming: action.payload.sentimentBoardUpcoming
      }
    case "SET_SENTIMENT_BOARD_NEW_COLLECTION":
      return {
        ...state,
        sentimentBoardNewCollection: action.payload.sentimentBoardNewCollection
      }
    case "SET_SENTIMENT_BOARD_1H":
      return {
        ...state,
        sentimentBoard1h: action.payload.sentimentBoard1h
      }
    case "SET_SENTIMENT_BOARD_1D":
      return {
        ...state,
        sentimentBoard1d: action.payload.sentimentBoard1d
      }
    case "SET_SENTIMENT_BOARD_7D":
      return {
        ...state,
        sentimentBoard7d: action.payload.sentimentBoard7d
      }
    case "SET_SENTIMENT_BOARD_ALL_TRENDING":
      return {
        ...state,
        sentimentBoardAllTrending: action.payload.sentimentBoardAllTrending
      }
    case "SET_REQUEST_UPCOMING":
      return {
        ...state,
        requestUpcoming: action.payload.requestUpcoming
      }
    case "SET_REQUEST_ME":
      return {
        ...state,
        requestME: action.payload.requestME
      }
    case "SET_ACTIVITIES":
      return {
        ...state,
        activities: action.payload.activities
      }
    case "SET_IS_ALPHA":
      return {
        ...state,
        isAlpha: action.payload.isAlpha,
        alphaKeyPhrase: action.payload.alphaKeyPhrase,
        watchlist: action.payload.watchlist
      }
    case "SET_IS_OG":
      return {
        ...state,
        isOG: action.payload.isOG
      }
    case "SET_HUNTED_COLLECTIONS":
      return {
        ...state,
        huntedCollections: action.payload.huntedCollections
      }
    case "SET_HUNTED_WATCHLIST":
      return {
        ...state,
        huntedWatchlist: action.payload.huntedWatchlist
      }
    case "SET_PERSONAL_WATCHLIST":
      return {
        ...state,
        personalWatchlist: action.payload.personalWatchlist
      }
    default:
      return state;
  }
};

const useStyles = makeStyles(theme => ({
  content: {
    width: '100%',
    padding: '35px 50px 0px',
  }
}));


ReactGA.initialize(process.env.REACT_APP_GA);
function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const classes = useStyles();

  const getUniqueCollections = (collections) => {
    let collectionSet = new Set()
    let uniqueCol = []
    for (const collection of collections) {
        const name = collection.name ? collection.name : collection.collection_name
        if (!collectionSet.has(name)) {
            uniqueCol.push(collection)
            collectionSet.add(name)
        }
    }
    return uniqueCol
}

  useEffect(() => {
    ReactGA.send("pageview");

    if (state.isAuthenticated) {

      const path = `${process.env.REACT_APP_BACKEND}/load-sentiment-by-tag`

      axios.post(path, { "tag": "me-upcoming" }).then(results => {
        let data = results.data
        data.forEach(item => item.image = item.image.replace('nftstorage', 'dweb'))
        dispatch({
          type: "SET_SENTIMENT_BOARD_UPCOMING",
          payload: { sentimentBoardUpcoming: data }
        })
      })

      axios.post(path, { "tag": "new-collections" }).then(results => {
        let data = results.data
        data.filter(collection => collection.symbol !== "chippies_nft").forEach(item => item.image = item.image.replace('nftstorage', 'dweb'))
        dispatch({
          type: "SET_SENTIMENT_BOARD_NEW_COLLECTION",
          payload: { sentimentBoardNewCollection: data }
        })
      })

      axios.post(path, { "tag": "popular-collections-1day" }).then(results => {
        let data = results.data
        data = data.filter(collection => collection.symbol !== "chippies_nft")
        data.forEach(item => item.image = item.image.replace('nftstorage', 'dweb'))
        dispatch({
          type: "SET_SENTIMENT_BOARD_1D",
          payload: { sentimentBoard1d: data }
        })
      })

      axios.post(path, { "tag": "popular-collections-7days" }).then(results => {
        let data = results.data
        data = data.filter(collection => collection.symbol !== "chippies_nft")
        data.forEach(item => item.image = item.image.replace('nftstorage', 'dweb'))
        dispatch({
          type: "SET_SENTIMENT_BOARD_7D",
          payload: { sentimentBoard7d: data }
        })
      })

      axios.post(path, { "tag": "popular-collections-1h" }).then(results => {
        let data = results.data
        data = data.filter(collection => collection.symbol !== "chippies_nft")
        data.forEach(item => item.image = item.image.replace('nftstorage', 'dweb'))
        dispatch({
          type: "SET_SENTIMENT_BOARD_1H",
          payload: { sentimentBoard1h: data }
        })
      })

      axios.post(path, { "tag": "request-me" }).then(results => {
        dispatch({
          type: "SET_REQUEST_ME",
          payload: { requestME: results.data.filter(collection => collection.symbol !== "chippies_nft") }
        })
      })

      axios.post(path, { "tag": "request-upcoming" }).then(results => {
        dispatch({
          type: "SET_REQUEST_UPCOMING",
          payload: { requestUpcoming: results.data }
        })
      })
    }

  }, [state.isAuthenticated])

  useEffect(() => {
    let allCollection = []
    if (state.sentimentBoardNewCollection && state.sentimentBoard1d && state.sentimentBoard7d && state.sentimentBoard1h && state.requestME) {
      allCollection = allCollection.concat(state.sentimentBoardNewCollection).concat(state.sentimentBoard1d).concat(state.sentimentBoard7d).concat(state.requestME).concat(state.sentimentBoard1h)
      allCollection = getUniqueCollections(allCollection)
      dispatch({
        type: "SET_SENTIMENT_BOARD_ALL_TRENDING",
        payload: { sentimentBoardAllTrending: allCollection }
      })
    }
    
  }, [state.sentimentBoardNewCollection, state.sentimentBoard1h, state.sentimentBoard1d, state.sentimentBoard7d, state.requestME])


  useEffect(() => {
    if (state.publicKey) {
      const path_watchlist = `${process.env.REACT_APP_BACKEND}/get-personal-watch-list-by-wallet`

      const publicKey = state.publicKey
      axios.post(`${process.env.REACT_APP_BACKEND}/get-me-activities-by-wallet`, {
        "walletAddress": publicKey
      }).then(res => {
        let activities = res.data.result[0] ? res.data.result[0].filter(activity => activity.txType === 'exchange') : [];
        dispatch({
          type: "SET_ACTIVITIES",
          payload: { activities: activities }
        })
      });

      axios.post(path_watchlist, { 'walletAddress': state.publicKey }).then(results => {
        dispatch({
          type: "SET_PERSONAL_WATCHLIST",
          payload: { personalWatchlist: results.data.watchlist ? results.data.watchlist : [] }
        })
      })

    }
  }, [state.publicKey])


  useEffect(() => {
    if (state.activities) {
      const publicKey = state.publicKey
      getNFTs(publicKey, state.activities).then(nfts => {
        dispatch({
          type: "SET_YOUR_COLLECTIBLES",
          payload: { yourCollectibles: nfts }
        })
      });
    }
    // eslint-disable-next-line
  }, [state.activities])

  useEffect(() => {

    if (state.publicKey && state.isOG) {
      axios.get(process.env.REACT_APP_BACKEND + "/get-all-collections").then(res => {
        dispatch({
          type: "SET_HUNTED_COLLECTIONS",
          payload: { huntedCollections: res.data.allCollections }
        })
      })
    }
    // eslint-disable-next-line
  }, [state.isOG])

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <div className="App">
        <Router> 
          <Box display="flex">
            <Navbar />
            <Box className={classes.content}>
              {state.isAuthenticated ? <Header /> : null}
              <Switch>
                <Route path="/new-collections">
                  {state.isAuthenticated ? <SentimentBoard dispatch={dispatch} date="new-collections" /> : <ConnectWrapper />}
                </Route>
                <Route path="/1h">
                  {state.isAuthenticated ? <SentimentBoard dispatch={dispatch} date="1h" /> : <ConnectWrapper />}
                </Route>
                <Route path="/1day">
                  {state.isAuthenticated ? <SentimentBoard dispatch={dispatch} date="1day" /> : <ConnectWrapper />}
                </Route>
                <Route path="/7days">
                  {state.isAuthenticated ? <SentimentBoard dispatch={dispatch} date="7days" /> : <ConnectWrapper />}
                </Route>
                <Route path="/upcoming">
                  {state.isAuthenticated ? <SentimentBoard dispatch={dispatch} date="upcoming" /> : <ConnectWrapper />}
                </Route>
                <Route path="/alltrending">
                  {state.isAuthenticated ? <SentimentBoard dispatch={dispatch} date="all" /> : <ConnectWrapper />}
                </Route>
                <Route path="/watchlist">
                  {state.isAuthenticated ? <SentimentBoard dispatch={dispatch} date="watchlist" /> : <ConnectWrapper />}
                </Route>    
                <Route path="/details/:collectionName" render={(props) => {return state.isAuthenticated ? <CollectionDetails {...props} key={window.location.pathname} /> : <ConnectWrapper/> }}>
                </Route>
                <Route path="/">
                  {state.isAuthenticated ? <AllCollection /> : <ConnectWrapper />}
                </Route>
              </Switch>
            </Box>
          </Box>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}


export default App;
