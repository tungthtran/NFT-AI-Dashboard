import { Grid } from "@mui/material";
import { Card, CardBody, CardTitle } from "reactstrap";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { round } from "../../helper/utils";
 
const InfoCard = ({ floorPrice, volume24h, volumeAll, listCount, followers, shock }) => {
 
   const titles = ["Floor price", "Listed count", "Volume (24h)", "Volume (All time)", "Twitter followers"]
 
   const stats = {
       "Floor price" : `◎ ${floorPrice}`,
       "Listed count" : listCount,
       "Volume (24h)" : `◎ ${volume24h}`,
       "Volume (All time)" : `◎ ${volumeAll}`,
       "Twitter followers": followers
   }
 
   const shockPercentage = {
       "Floor price" : round(shock.shock1d.floorPrice),
       "Listed count" : round(shock.shock1d.listedCount),
       "Volume (24h)" : round(shock.shock1d.volume),
       "Volume (All time)" : round(shock.shock1d.volumeAll),
       "Twitter followers": round(shock.shock1d.followers_count)
   }
 
   const generateArrow = (number) => {
       if (number >= 0) {
           return <div style={{color: "rgb(132, 235, 176)"}}>
               <TrendingUpIcon/> {number} %
           </div>
       }
       else {
           return <div style={{color: "rgb(240, 131, 131)"}}>
               <TrendingDownIcon/> {number * -1} %
           </div>
       }
   }
 
   return (
       <Grid spacing={2} container style={{marginBottom: "10vh", marginTop: "5vh"}}>
           {titles.map(title => <Grid item xs={2} style={{marginLeft: "2vw"}}>
               <Card style={{ borderRadius: "2em", color: "white", backgroundColor: "#2B2B43", textAlign: "center" }}>
                   <CardBody>
                           <CardTitle
                               tag="h6"
                               className="text-uppercase text-muted mb-4"
                           >
                               {title}
                           </CardTitle>
                           <div className="h5 font-weight-bold mb-3">
                               {stats[title]}
                           </div>
                           <div className="h5 font-weight-bold">
                               {generateArrow(shockPercentage[title])}
                           </div>
                   </CardBody>
               </Card>
           </Grid>)}
       </Grid>
   );
};
 
export default InfoCard;
 

