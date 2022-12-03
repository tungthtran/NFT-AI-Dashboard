import React, { useContext, useState } from 'react';
import "../css/Header.css";
import { Link } from 'react-router-dom';
// import { Box, List, ListItem, ListItemIcon, makeStyles, Collapse, Typography } from '@material-ui/core';
import { Box, List, ListItem, ListItemIcon, makeStyles } from '@material-ui/core';
// import ExpandLess from '@material-ui/icons/ExpandLess'
// import ExpandMore from '@material-ui/icons/ExpandMore'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CollectionsIcon from '@mui/icons-material/Collections';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeIcon from '@mui/icons-material/Home';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GridViewIcon from '@mui/icons-material/GridView';
import logo from "../assets/ChippiesLOGO.jpg";
import { AuthContext } from '../../App';

const useStyles = makeStyles(theme => ({
  root: {
    width: '14vw',
    minWidth: '14vw',
    borderRight: '1px solid rgba(145, 158, 171, 0.24)',
    height: '100vh',
    top: 0,
    position: 'sticky',
    backgroundColor: 'rgb(23, 26, 50)',
  },
  activity: {
    paddingLeft: '2vw',
    height: '5vh',
    color: 'rgb(96, 98, 123)'
  },
  contactUs: {
    paddingTop: '6vh',
    paddingLeft: '2vw',
    paddingBottom: '1vh',
    height: '5vh',
    color: 'rgb(96, 98, 123)'
  },
  navItem: {
    paddingLeft: '2vw',
    marginBottom: '1vh',
    height: '5vh',
    color: 'rgb(96, 98, 123)',
    "&:hover": {
      color: "white"
    }
  },
  navItemActive: {
    paddingLeft: '2vw',
    marginBottom: '1vh',
    height: '5vh',
    backgroundColor: 'rgba(0, 171, 85, 0.08)',
    color: 'white',
    fontWeight: 'bold',
    '&::before': {
      width: '0.1vw',
      position: 'absolute',
      content: '""',
      top: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'white',
    },
    "&:hover": {
      color: "rgb(96, 98, 123)"
    }
  },
  navItemIcon: {
    minWidth: '2.5vw',
    color: "white"
  },
  butArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    color: 'rgb(96, 98, 123)'
  },
  logoutButArea: {
    "&.MuiButton-root": {
      background: "linear-gradient(180deg, #604ae5 0%, #813eee 100%)",
      color: "white"
    },
  }
}));

function Navbar() {
  const { state } = useContext(AuthContext)
  const classes = useStyles();

  const generateActiveTab = (pathname) => {
    if (pathname === "/upcoming") return "Upcoming Launches"
    else if (pathname === "/new-collections") return "New Releases"
    else if (pathname === "/alltrending") return "Trending"
    else if (pathname === "/1h") return "1h"
    else if (pathname === "/1day") return "24h"
    else if (pathname === "/7days") return "7 Days"
    else if (pathname === "/watchlist") return "Watchlist"
    else return "All Collections"
  }

  const [activeTab, setActiveTab] = useState(() => generateActiveTab(window.location.pathname))
  // const [openTrending, setOpenTrending] = useState(false)

  // const handleOpenTrending = () => {
  //   setOpenTrending(!openTrending)
  // }

  const navList = [
    {
      label: 'Home',
      path: '/all',
      icon: (<HomeIcon />),
    },
    {
      label: 'Trending',
      path: '/alltrending',
      icon: (<TrendingUpIcon />)
    },
    {
      label: 'Upcoming Launches',
      path: '/upcoming',
      icon: (<RocketLaunchIcon />)
    },
    {
      label: 'Watchlist',
      path: '/watchlist',
      icon: (<FavoriteIcon />),
    },
    {
      label: 'My Collection',
      path: '/mycollection',
      icon: (<CollectionsIcon />),
    },
    {
      label: 'Hunting Tool',
      path: '/huntingtool',
      icon: (<ImageSearchIcon />),
    },
    {
      label: 'Multiview',
      path: '/multiview',
      icon: (<GridViewIcon />),
    },
  ];

  // const trendingList = [
  //   {
  //     label: 'All Trending',
  //     path: '/alltrending',
  //     icon: (<Typography />)
  //   },
  //   {
  //     label: 'New Releases',
  //     path: '/new-collections',
  //     icon: (<Typography />)
  //   },
  //   {
  //     label: '1h 🔥',
  //     path: '/1h',
  //     icon: (<Typography />)
  //   },
  //   {
  //     label: '24h',
  //     path: '/1day',
  //     icon: (<Typography />)
  //   },
  //   {
  //     label: '7 Days',
  //     path: '/7days',
  //     icon: (<Typography />)
  //   },
  // ]

  return (
    <>
    {<Box className={classes.root}>

      <img className="header__logo"
        src={logo} alt="icon">
      </img>

      <List>
        {state.isAuthenticated && <ListItem className={classes.activity}>
          ACTIVITIES
        </ListItem>}
        {state.isAuthenticated && navList.map(nav => {
          // if (nav['label'] === "Trending") {
          //   return (
          //     <div>
          //       <ListItem
          //         key={nav['label']}
          //         className={activeTab === nav['label'] ? classes.navItemActive : classes.navItem}
          //         button 
          //         onClick={() => {
          //           handleOpenTrending()
          //         }}>
          //         <ListItemIcon className={classes.navItemIcon}>
          //           {nav['icon']}
          //         </ListItemIcon>
          //         {nav['label']}
          //         {openTrending ? <ExpandLess /> : <ExpandMore />}
          //       </ListItem>
          //       <Collapse in={openTrending} timeout="auto">
          //         <List component="div" disablePadding>
          //           {trendingList.map(nav2 => (
          //             <ListItem
          //               key={nav2['label']}
          //               className={activeTab === nav2['label'] ? classes.navItemActive : classes.navItem}
          //               button component={Link}
          //               to={nav2['path']}
          //               onClick={() => {
          //                 setActiveTab(nav2['label'])
          //               }
          //               }>
          //               <ListItemIcon className={classes.navItemIcon}>
          //                 {nav2['icon']}
          //               </ListItemIcon>
          //               {nav2['label']}
          //             </ListItem>
          //           ))}
          //         </List>
          //       </Collapse>
          //     </div>)
          // }

          return <ListItem
            key={nav['label']}
            className={activeTab === nav['label'] ? classes.navItemActive : classes.navItem}
            button component={Link}
            to={nav['path']}
            onClick={() => setActiveTab(nav['label'])}
          >
            <ListItemIcon className={classes.navItemIcon}>
              {nav['icon']}
            </ListItemIcon>
            {nav['label']}
          </ListItem>

        })}
        <ListItem className={classes.contactUs}>
          CONTACT US
        </ListItem>
      </List>

      <Box className={classes.butArea}>
        <div>© 2022: Senior Project</div>
      </Box>

    </Box>}
    </>
  );
}

export default Navbar;