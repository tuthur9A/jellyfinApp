import { Video } from 'expo-av';
import React, {useEffect, useState } from 'react';
import { View, Text } from 'react-native'
import { MovieModel } from '../model/ListItems';
import { MediaSourceModel } from '../model/playback';


export function getMovie(id: string) {
    const [movie, setMovie] = useState<MovieModel>();
    const [playback, setPlayback] = useState<MediaSourceModel>();
    useEffect(() => {
        fetch('https://streaming.arthurcargnelli.eu/Users/30af1f55f41a40e593194710131bf55d/Items/' + id + '?api_key=618ab0c72e18452995c98aa270b8ac75')
        .then( response => {
            if (response.status == 200) {
                return response.json()
            } else {
                console.error("Bad response status: ", response.status);
            }
        })
        .then((movieData: MovieModel) => setMovie(movieData));
    }, [])
    useEffect(() => {
        fetch('https://streaming.arthurcargnelli.eu/Items/' + id + '/PlaybackInfo?UserId=30af1f55f41a40e593194710131bf55d&StartTimeTicks=0&IsPlayback=true&AutoOpenLiveStream=true&MediaSourceId=' + id + '&MaxStreamingBitrate=230136986&api_key=618ab0c72e18452995c98aa270b8ac75')
        .then( response => {
            if (response.status == 200) {
                return response.json()
            } else {
                console.error("Bad response status: ", response.status);
            }
        })
        .then((playback: MediaSourceModel) => setPlayback(playback));
    })
    return <View> 
        <Text>{movie?.Name} </Text>
        <Video
            ref="videoPlayer"
            source={{ uri: 'https://streaming.arthurcargnelli.eu/Items/' + id + '/Download?api_key=618ab0c72e18452995c98aa270b8ac75' }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            useNativeControls={true}
            style={{ width: 300, height: 300 }}
            />
        </View>
  }


export function Screen2 ({navigation, route}){
    return (
        <View>
            {getMovie(route.params.itemId)}
        </View>
    )
}