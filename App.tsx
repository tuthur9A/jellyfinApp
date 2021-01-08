import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Button, Pressable} from 'react-native';
import { Itemlist, MovieModel } from './model/ListItems';
import { Screen2 } from './src/movie.component';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export function movie(props: MovieModel, navigation) {
  const url = 'https://streaming.arthurcargnelli.eu/Items/' + props.Id + '/Images/Primary?maxHeight=300&maxWidth=200&tag='+ props.BackdropImageTags[0] +'&quality=90';
  return (
    <Pressable key={props.Id}  onPress={() =>
      navigation.navigate('Test', { name: 'Test', itemId: props.Id })
    }>
      <View style={styles.movie}>
        <Image source={
          { uri: url }
          }
          style={styles.image} />
        <Text> {props.Name} </Text>
      </View>
      </Pressable>
  )
}


export function getMovies(navigation) {
  const [data, setData] = useState<MovieModel[]>([]);
  const unmounted = useRef(false);
  useEffect(() => {
    fetch("https://streaming.arthurcargnelli.eu/Playback/BitrateTest?Size=500000&api_key=69e93a0fddb043a0b14e3218d0cc622d")
    fetch("https://streaming.arthurcargnelli.eu/Playback/BitrateTest?Size=1000000&api_key=69e93a0fddb043a0b14e3218d0cc622d")
    fetch("https://streaming.arthurcargnelli.eu/Playback/BitrateTest?Size=3000000&api_key=69e93a0fddb043a0b14e3218d0cc622d")
    fetch("https://streaming.arthurcargnelli.eu/Users/bbfb33db95d74eef8761c63b9dd929cb/Items?SortBy=SortName%2CProductionYear&SortOrder=Ascending&IncludeItemTypes=Movie&Recursive=true&Fields=PrimaryImageAspectRatio%2CMediaSourceCount%2CBasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&StartIndex=0&ParentId=db4c1708cbb5dd1676284a40f2950aba&Limit=100&api_key=69e93a0fddb043a0b14e3218d0cc622d")
    .then( response => {
      if (response.status == 200) {
        return response.json()
      } else {
        console.error("Bad response status: ", response.status);
      }
    })
    .then((movieData: Itemlist<MovieModel>) => setData(movieData.Items));
    return () => { unmounted.current = true };
  }, [])
  return <View  style={styles.wrapperMovies}>{data.map((item: MovieModel) => movie(item, navigation))}</View>
}

function Screen1({ navigation }) {
  const Movies = getMovies(navigation)
  return (
      <View style={styles.container}>
        <Text style={styles.h1}>JellyFin App !</Text>
        <ScrollView>{Movies}</ScrollView>
      </View>
  );
}

export default function App(props) {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Screen1}
              options={{ title: 'Home' }}
            />
            <Stack.Screen
              name="Test"
              component={Screen2}
              options={{ title: 'Test' }}
            />
          </Stack.Navigator>  
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    background: 'linear-gradient(90deg,#000420 0,#06256f 18%,#2b052b 38%,#2b052b 68%,#06256f 81%,#000420)'
 },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    margin: '1%',
    justifyContent: 'flex-start',
    background: 'linear-gradient(90deg,#000420 0,#06256f 18%,#2b052b 38%,#2b052b 68%,#06256f 81%,#000420)'
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
