import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable} from 'react-native';
import { Itemlist } from '../model/ListItems';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from './data/userContext';
import * as jellyfinApi from '@jellyfin/client-axios';
import { useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export function itemComponent(props: jellyfinApi.BaseItemDto, navigation) {
  const userContext = useContext(UserContext);
    const img = props.BackdropImageTags && props.BackdropImageTags.length != 0 ? props.BackdropImageTags[0] : props.ImageTags['Primary'];
    return (
      <Pressable key={props.Id}  onPress={() =>
        navigation.navigate('Test', { name: 'Test', itemId: props.Id, navigation: navigation })
      }>
        <View style={styles.movie}>
          <Image source={
            { uri: userContext.URL + '/Items/' + props.Id + '/Images/Primary?maxHeight=300&maxWidth=200&tag='+ img +'&quality=90' }
            }
            style={styles.image} />
          <Text style={styles.title}> {props.Name} </Text>
        </View>
        </Pressable>
    )
  }

export function getItems(props: jellyfinApi.BaseItemDto, navigation) {
    const userContext = useContext(UserContext);
    useFocusEffect(() => {
      React.useCallback(() => {
        userContext.setPageTitle(props?.Name)
      }, [])
    })
    const [data, setData] = useState<jellyfinApi.BaseItemDto[]>([]);
    const unmounted = useRef(false);
    const type= props?.CollectionType == 'movies' ? 'Movie' : 'Series' 
    useEffect(() => {
      fetch(userContext.URL + "/Users/"+userContext.user.Id+"/Items?SortBy=SortName%2CProductionYear&SortOrder=Ascending&IncludeItemTypes="+type+"&Recursive=true&Fields=PrimaryImageAspectRatio%2CMediaSourceCount%2CBasicSyncInfo&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&StartIndex=0&ParentId="+props.Id+"&Limit=100", {
        method: 'GET', headers: userContext.Headers })
      .then( response => {
        if (response.status == 200) {
          return response.json()
        } else {
          console.error("Bad response status: ", response.status);
          throw Error(response.statusText);
        }
      })
      .then((movieData: Itemlist<jellyfinApi.BaseItemDto>) => setData(movieData?.Items))
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
      {data.map((item: jellyfinApi.BaseItemDto) => itemComponent(item, navigation))}</View>
  }

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