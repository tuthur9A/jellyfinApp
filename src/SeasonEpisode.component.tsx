import { Video } from 'expo-av';
import React, {useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import { PlaybackModel } from '../model/playback';
import { UserContext } from './data/userContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as jellyfinApi from '@jellyfin/client-axios';

function ticksToMs(ticks: number | null | undefined): number {
    if (!ticks) {
        ticks = 0;
    }
    return ticks / 10000;
}

export function video(movie: jellyfinApi.BaseItemDto, playback: PlaybackModel, params: string) {
    const userContext = useContext(UserContext);
    let containers = playback.MediaSources[0]?.Container.split(',');
        return <Video
                source= {{uri: `${userContext.URL}/Videos/${playback?.MediaSources[0].Id}/stream.${containers[0] === 'mov' ? containers[1] : containers[0]}?${params}`}}
                positionMillis={Math.round(ticksToMs(movie?.UserData.PlaybackPositionTicks))}
                rate={1.0}
                isMuted={false}
                isLooping={false}
                volume={1.0}
                shouldPlay= {true}
                resizeMode="contain"
                useNativeControls={true}
                key={movie?.Id}
                style={{ width: 300, height: 300 }}
                /> 
    

}
function EpisodeComponent(item: jellyfinApi.BaseItemDto, navigation) {
    const userContext = useContext(UserContext);
    const img = item?.ParentBackdropImageTags && item?.ParentBackdropImageTags.length != 0? item?.ParentBackdropImageTags[0] : item?.ImageTags['Primary']
    return (
        <View style={styles.informationMovie} key={item?.Id}> 
            <Image source={{ uri: userContext.URL + '/Items/' + item?.Id + '/Images/Primary?maxHeight=300&maxWidth=200&tag='+ img +'&quality=90' }} style={styles.image} />
            <View style={styles.informationMovieText}>
                <Text style={styles.h2}>{item?.IndexNumber}.{item?.Name}</Text>
                <Text style={styles.h3}>{item?.Overview}</Text>
            </View>
        </View>
    )
}

function getSeasonEpisode(item: jellyfinApi.BaseItemDto, navigation) {
    const userContext = useContext(UserContext);
    const [episode, setEpisode] = useState<jellyfinApi.BaseItemDtoQueryResult>();
    useEffect(() => {
      fetch(userContext.URL + '/Shows/'+item?.SeriesId+'/Episodes?seasonId=' + item?.Id + '&UserId=' + userContext.user.Id + '&Fields=ItemCounts%2CPrimaryImageAspectRatio%2CBasicSyncInfo%2CCanDelete%2CMediaSourceCount%2COverview' , {
        method: 'GET', headers: userContext.Headers })
      .then( response => {
          if (response.status == 200) {
              return response.json()
          } else {
              console.error("Bad response status: ", response.status);
          }
      })
      .then((episode: jellyfinApi.BaseItemDtoQueryResult) => {
        setEpisode(episode);
      })
    }, []);
    return (
        <ScrollView>
            <View  style={styles.wrapperMovies}>
                {episode?.Items.map((item: jellyfinApi.BaseItemDto) => EpisodeComponent(item, navigation))}
            </View>
        </ScrollView>
    )
  }

export function Screen3 ({route}){
    return (
        <View style={styles.container}>
          <LinearGradient
            // Background Linear Gradient
            colors={['#000420', '#06256f', '#2b052b', '#06256f', '#000420']}
            style={styles.background}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            />
            {getSeasonEpisode(route.params.item, route.params.navigation)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '100%',
    },
    wrapperMovies: {
      display: "flex",
      flexDirection: 'row',
      flexWrap: "wrap",
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginTop: '5%'
    },
    movie: {
      display: "flex",
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '3%',
    },
    seasons: {
      margin: '3%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    season: {
      display: "flex",
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '3%',
    },
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    h2: {
      fontSize: 15,
      color: '#ffffff',
    },
    h3: {
      fontSize: 13,
      color: '#ffffff',
    },
    informationMovie: {
      marginTop: '15%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '90%'
    },
    informationMovieText: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '68%'
    },
    image: {
      width: 135,
      height: 200,
      margin: '3%'
    },
  });