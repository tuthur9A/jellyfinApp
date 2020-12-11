import React, { useState } from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import { Itemlist, MovieModel } from './model/ListItems';


export function movie(props: MovieModel) {
  const url = 'https://streaming.arthurcargnelli.eu/Items/' + props.Id + '/Images/Primary?maxHeight=300&maxWidth=200&tag='+ props.BackdropImageTags[0] +'&quality=90';
  return (
    <View style={styles.movie} key={props.Id}>
      <Image source={
        { uri: url }
        }
        style={styles.image} />
      <Text> {props.Name} </Text>
      </View>
  )
}
export function getMovies() {
  const [data, setData] = useState<MovieModel[]>([]);
  fetch("https://streaming.arthurcargnelli.eu/Users/30af1f55f41a40e593194710131bf55d/Items?SortBy=SortName%2CProductionYear&SortOrder=Ascending&IncludeItemTypes=Movie&Recursive=true&Fields=PrimaryImageAspectRatio%2CMediaSourceCount%2CBasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&StartIndex=0&ParentId=f137a2dd21bbc1b99aa5c0f6bf02a805&Limit=100&api_key=618ab0c72e18452995c98aa270b8ac75")
  .then( response => {
    if (response.status == 200) {
      return response.json()
    } else {
      console.error("Bad response status: ", response.status);
    }
  })
  .then((movieData: Itemlist<MovieModel>) => setData(movieData.Items));
  return <View style={styles.wrapperMovies}>{data.map((item: MovieModel) => movie(item))}</View>
}

export default function App() {
  const Movies = getMovies()
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>JellyFin App !</Text>
      <View>{Movies}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    margin: '1%',
    justifyContent: 'flex-start',
  },
  wrapperMovies: {
    display: "flex",
    flexDirection: 'row',
    flexWrap: "wrap",
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  movie: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 200,
  },
});
