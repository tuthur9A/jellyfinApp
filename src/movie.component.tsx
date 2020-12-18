import { Video } from 'expo-av';
import React, {useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native'
import { MovieModel } from '../model/ListItems';
import { PlaybackModel } from '../model/playback';
import { stringify } from 'qs';

function ticksToMs(ticks: number | null | undefined): number {
    if (!ticks) {
        ticks = 0;
    }
    return ticks / 10000;
}

export function video(movie: MovieModel) {
    const [params, setParams] = useState<string>()
    const [playback, setPlayBack] = useState<PlaybackModel>()
    useEffect(() => {
        if (movie) {
            fetch('https://streaming.arthurcargnelli.eu/Items/' + movie.Id + '/PlaybackInfo?UserId=30af1f55f41a40e593194710131bf55d&StartTimeTicks=0&IsPlayback=true&AutoOpenLiveStream=true&MediaSourceId=' + movie.Id + '&MaxStreamingBitrate=230136986&api_key=618ab0c72e18452995c98aa270b8ac75')
                .then( response => {
                    if (response.status == 200) {
                        return response.json()
                    } else {
                        console.error("Bad response status: ", response.status);
                    }
                })
                .then((playback: PlaybackModel) => {
                    if (playback.MediaSources[0].SupportsDirectStream) {
                        const directOptions: Record<
                        string,
                        string | boolean | undefined | null
                        > = {
                        Static: true,
                        mediaSourceId: playback.MediaSources[0].Id,
                        deviceId: "KHJGIHEGUIYTUIOYT678787",
                        api_key: "618ab0c72e18452995c98aa270b8ac75"
                        };
                
                        if (playback.MediaSources[0].ETag) {
                        directOptions.Tag = playback.MediaSources[0].ETag;
                        }    
                        const params = stringify(directOptions);
                        setParams(params)
                        setPlayBack(playback)
                    }
                });
            }
        });
        return <View>
                {movie ? <Text></Text> : <Text>Loading ...</Text>}
                { movie && playback ? <Video
                source= {{uri: `https://streaming.arthurcargnelli.eu/Videos/${playback?.MediaSources[0].Id}/stream.${playback.MediaSources[0]?.Container.split(',')[0]}?${params}`}}
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
                /> : <Text></Text>}
                </View>
    

}

export function getMovie(id: string) {
    const [movie, setMovie] = useState<MovieModel>();
    useEffect(() => {
        fetch('https://streaming.arthurcargnelli.eu/Users/30af1f55f41a40e593194710131bf55d/Items/' + id + '?api_key=618ab0c72e18452995c98aa270b8ac75')
        .then( response => {
            if (response.status == 200) {
                return response.json()
            } else {
                console.error("Bad response status: ", response.status);
            }
        })
        .then((movieData: MovieModel) => {
            setMovie(movieData)
        });
    })
    return <View> 
        <Text>{movie?.Name} </Text>
        {video(movie)}
        </View>
  }


export function Screen2 ({route}){
    return (
        <View>
            {getMovie(route.params.itemId)}
        </View>
    )
}