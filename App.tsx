import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Button, Pressable} from 'react-native';
import { Itemlist, MovieModel } from './model/ListItems';
import { Screen2 } from './src/movie.component';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProvider } from './src/data/userContext';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import * as jellyfinApi from '@jellyfin/client-axios';
import { Configuration } from '@jellyfin/client-axios';
import { BaseAPI } from '@jellyfin/client-axios/dist/base';
import  {v4 as uuidv4} from 'uuid';


const Stack = createStackNavigator();

const deviceId = uuidv4();
const config: AxiosRequestConfig = {
  baseURL: 'https://streaming.arthurcargnelli.eu',
  headers: {'X-Emby-Authorization': 'MediaBrowser Client="Jellyfin App", Device="JellyfinApp", DeviceId="'+ deviceId +'", Version="10.6.4"',
  'Content-Type': 'application/json'}
};
const client: AxiosInstance = axios.create(config);


async function authent() {
  const config = new Configuration();
  var userApi = new jellyfinApi.UserApi(config, 'https://streaming.arthurcargnelli.eu', client);
  var result = await userApi.authenticateUserByName({
    authenticateUserByName: {Pw: "261113",
    Username: 'tuthur9'} as jellyfinApi.AuthenticateUserByName
  } as jellyfinApi.UserApiAuthenticateUserByNameRequest);
  console.log(result);
}

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
        <Text style={styles.title}> {props.Name} </Text>
      </View>
      </Pressable>
  )
}


export function getMovies(navigation) {
  const [data, setData] = useState<MovieModel[]>([]);
  const unmounted = useRef(false);
  useEffect(() => {
    fetch("https://streaming.arthurcargnelli.eu/Users/bbfb33db95d74eef8761c63b9dd929cb/Items?SortBy=SortName%2CProductionYear&SortOrder=Ascending&IncludeItemTypes=Movie&Recursive=true&Fields=PrimaryImageAspectRatio%2CMediaSourceCount%2CBasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&StartIndex=0&ParentId=db4c1708cbb5dd1676284a40f2950aba&Limit=100&api_key=da7183f9064948a0b735cf0d2db10d2c")
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
  return <View  style={styles.wrapperMovies}>
          <LinearGradient
        // Background Linear Gradient
        colors={['#000420', '#06256f', '#2b052b', '#06256f', '#000420']}
        style={styles.background}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        />
    {data.map((item: MovieModel) => movie(item, navigation))}</View>
}

function Screen1({ navigation }) {
  const Movies = getMovies(navigation)
  return (
      <View style={styles.container}>
        <LinearGradient
        // Background Linear Gradient
        colors={['#000420', '#06256f', '#2b052b', '#06256f', '#000420']}
        style={styles.background}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        />
        <Text style={styles.h1}>JellyFin App !</Text>
        <ScrollView>{Movies}</ScrollView>
      </View>
  );
}

function App(props) {
  authent();
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
              name= "Home"
              component={Screen1}
              options={{ title: 'Home',
              headerTransparent: true,
              headerTitleStyle: (styles.title)}}
            />
            <Stack.Screen
              name="Test"
              component={Screen2}
              options={{ title: 'Test',
              headerTransparent: true,
              headerTitleStyle: (styles.title)}}
            />
          </Stack.Navigator>  
    </NavigationContainer>
  );
}

const ContextContainer = () => (
  <UserProvider>
    <LinearGradient
        // Background Linear Gradient
        colors={['#000420', '#06256f', '#2b052b', '#06256f', '#000420']}
        style={styles.background}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        />
    <App />
  </UserProvider>
);

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  title: {
    color: '#ffffff'
  },
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

export default ContextContainer;