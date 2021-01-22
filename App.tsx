import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable} from 'react-native';
import { Itemlist } from './model/ListItems';
import { Screen2 } from './src/movie.component';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext, UserProvider } from './src/data/userContext';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import * as jellyfinApi from '@jellyfin/client-axios';
import  * as uuid from 'react-native-uuid';
import { useContext } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Input, Button } from '@ui-kitten/components';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants'
import { Platform } from 'react-native';
import { getItems } from './src/ItemList.component';
import { Screen3 } from './src/SeasonEpisode.component';
import AsyncStorage from '@react-native-async-storage/async-storage';
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes

const Stack = createStackNavigator();

const deviceId = uuid.v4();
const config: AxiosRequestConfig = {
  baseURL: 'https://streaming.arthurcargnelli.eu',
  headers: {'X-Emby-Authorization': 'MediaBrowser Client="Jellyfin App", Device="JellyfinApp", DeviceId="'+ deviceId +'", Version="10.6.4"',
  'Content-Type': 'application/json'}
};
const client: AxiosInstance = axios.create(config);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { data: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function logout(userContext, navigation) {
  userContext.setUser(null);
  userContext.setApiKey(null);
  userContext.setHeaders(null);
  const keys = ['@access_token', '@headers', '@user'];
  try {
    await AsyncStorage.multiRemove(keys);
    navigation.navigate('Home', { name: 'Home', navigation: navigation })
  } catch(e) {
    // remove error
  }
  console.log('Disconnected');
}

function authent(username: string, password: string, url: string, userContext) {
    fetch(url+'/Users/AuthenticateByName', {
      method: 'POST', headers: config.headers, body: JSON.stringify({Pw: password, Username: username})
    })
    .then(response => response.json())
    .then(result => {
        if (result) {
          AsyncStorage.setItem('@access_token', result.AccessToken);
          config.headers['X-Emby-Authorization'] = config.headers['X-Emby-Authorization'] + ',Token="'+ result.AccessToken +'"';
          AsyncStorage.setItem('@headers', JSON.stringify(config.headers));
          AsyncStorage.setItem('@user', JSON.stringify(result.user));
          userContext.setUser(result.User);
          userContext.setApiKey(result.AccessToken);
          userContext.setHeaders(config.headers);
        }
      })
      .catch(error => {
        console.error(error);
      })
}


export function category(props: jellyfinApi.BaseItemDto, navigation) {
  const url = 'https://streaming.arthurcargnelli.eu/Items/' + props.Id + '/Images/Primary?maxHeight=300&maxWidth=200&tag='+ props.BackdropImageTags[0] +'&quality=90';
  return (
    <Pressable key={props.Id}  onPress={() =>
      navigation.navigate('List', { name: 'List', props: props, navigation: navigation })
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

export function getCategories(navigation) {
  const userContext = useContext(UserContext);
  const [data, setData] = useState<jellyfinApi.BaseItemDto[]>([]);
  const unmounted = useRef(false);
  useEffect(() => {
    fetch("https://streaming.arthurcargnelli.eu/Users/"+userContext.user.Id+"/Views",{
      method: 'GET', headers: userContext.Headers })
    .then( response => {
      if (response.status == 200) {
        return response.json()
      } else {
        console.error("Bad response status: ", response.status);
        throw Error(response.statusText);
      }
    })
    .then((movieData: Itemlist<jellyfinApi.BaseItemDto>) => {
      setData(movieData?.Items)
    })
    .catch(() => {
      console.error("Error during movies fetch.")
    });
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
    {data.map((item: jellyfinApi.BaseItemDto) => category(item, navigation))}</View>
}

function categories({ navigation }) {
  const userContext = useContext(UserContext);
  useEffect(() => {
    userContext.setPageTitle('Home')
  }, [])
  const Movies = getCategories(navigation)
  return (
      <View style={styles.container}>
        <LinearGradient
        // Background Linear Gradient
        colors={['#000420', '#06256f', '#2b052b', '#06256f', '#000420']}
        style={styles.background}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        />
        <ScrollView style={styles.listMovies}>{Movies}</ScrollView>
      </View>
  );
}

function Screen1({ route }) {
  const userContext = useContext(UserContext);
  useEffect(() => {
    userContext.setPageTitle('Home')
  }, [])
  const Movies = getItems(route.params.props, route.params.navigation)
  return (
      <View style={styles.container}>
        <LinearGradient
        // Background Linear Gradient
        colors={['#000420', '#06256f', '#2b052b', '#06256f', '#000420']}
        style={styles.background}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        />
        <ScrollView style={styles.listMovies}>{Movies}</ScrollView>
      </View>
  );
}

function App(props, {navigation}) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setURL] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    registerForPushNotificationsAsync()
    .then(token => {
        setExpoPushToken(token)
      });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  const userContext = useContext(UserContext);
  
  if ( userContext.apiKey && userContext.apiKey != null && Object.keys(userContext.apiKey).length !== 0 &&
  userContext.apiKey.constructor !== Object && userContext.user && userContext.user != null && Object.keys(userContext.apiKey).length !== 0) {
    return (
      <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen
                name= "Home"
                component={categories}
                options={{ title: userContext.PageTitle,
                headerTransparent: true,
                headerRight: () => (
                  <Button
                    onPress={() => {
                      logout(userContext, navigation);
                    }}
                  >
                    Déconnexion
                 </Button>
                ),
                headerTitleStyle: (styles.title)}}
              />
              <Stack.Screen
                name= "List"
                component={Screen1}
                options={{ title: userContext.PageTitle,
                headerTransparent: true,
                headerRight: () => (
                  <Button
                    onPress={() => {
                      logout(userContext, navigation);
                      
                    }}
                  >
                    Déconnexion
                 </Button>
                ),
                headerTitleStyle: (styles.title)}}
              />
              <Stack.Screen
                name="Test"
                component={Screen2}
                options={{ title: userContext.PageTitle,
                headerTransparent: true,
                headerRight: () => (
                  <Button
                    onPress={() => {
                      logout(userContext, navigation);
                      
                    }}
                  >
                    Déconnexion
                 </Button>
                ),
                headerTitleStyle: (styles.title)}}
              />
              <Stack.Screen
                name="Season"
                component={Screen3}
                options={{ title: userContext.PageTitle,
                headerTransparent: true,
                headerRight: () => (
                  <Button
                    onPress={() => {
                      logout(userContext, navigation);
                      
                    }}
                  >
                    Déconnexion
                 </Button>
                ),
                headerTitleStyle: (styles.title)}}
              />
            </Stack.Navigator>  
      </NavigationContainer>
    )
  } else {
    return (
      <View style={styles.container}>
          <Text  style={{ textAlign: "center" }}>
            Authentication
          </Text>
          <Text>Server URL</Text>
          <Input
            value={url}
            onChangeText={(text) => setURL(text)}
            placeholder="https://monsite.monsite/"
          />
          <Text>UserName</Text>
          <Input
            value={userName}
            onChangeText={(text) => setUsername(text)}
            placeholder="USERNAME"
          />
          <Text>Password</Text>
          <Input
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="password"
            secureTextEntry
          />
          <Button
            style={{ flex: 0, marginLeft: 8 }}
            onPress={() =>
             authent(
                    userName,
                    password,
                    url,
                    userContext
                  )
            }
          >
             Connexion
          </Button>
          <Button
            onPress={async () => {
              await sendPushNotification(expoPushToken);
            }}
            >
            Press to Send Notification
         </Button>
      </View>
    )
  };
}

const ContextContainer = () => (
  <UserProvider>
    <ApplicationProvider {...eva} theme={eva.light}>
      <LinearGradient
          // Background Linear Gradient
          colors={['#000420', '#06256f', '#2b052b', '#06256f', '#000420']}
          style={styles.background}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          />
      <App />
    </ApplicationProvider>
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
    color: '#ffffff',
    maxWidth: 150,
  },
  listMovies: {
    margin: '5%',
    marginTop: '15%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    margin: '3%',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 200,
  },
});

export default ContextContainer;