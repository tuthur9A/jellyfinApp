import { Video } from 'expo-av';
import React, {useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native'
import { MovieModel } from '../model/ListItems';
import { PlaybackModel } from '../model/playback';
import { stringify } from 'qs';

function ticksToMs(ticks: number | null | undefined): number {
    if (!ticks) {
        ticks = 0;
    }
    return ticks / 10000;
}

export function video(movie: MovieModel, playback: PlaybackModel, params: string) {
    console.log(params)
    let containers = playback.MediaSources[0]?.Container.split(',');
        return <Video
                source= {{uri: `https://streaming.arthurcargnelli.eu/Videos/${playback?.MediaSources[0].Id}/stream.${containers[0] === 'mov' ? containers[1] : containers[0]}?${params}`}}
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

export function getMovie(id: string) {
    const [movie, setMovie] = useState<MovieModel>();
    const [params, setParams] = useState<string>()
    const [playback, setPlayBack] = useState<PlaybackModel>()
    useEffect(() => {
        // /f06b18c6-85d3-c205-2b7a-71f9186c3f91/master.m3u8?VideoCodec=h264&AudioCodec=mp3,aac&AudioStreamIndex=1&VideoBitrate=229944986&AudioBitrate=192000&PlaySessionId=311e3a8b5abc44c6a9a1dc636eef5a5d&api_key=5dbc4c73e5084d0d940cd7a43d5eb4d3&SubtitleMethod=Encode&TranscodingMaxAudioChannels=2&RequireAvc=false&Tag=ba3b242ca9a51a483a8fabf742357fa4&SegmentContainer=ts&MinSegments=1&BreakOnNonKeyFrames=True&h264-profile=high,main,baseline,constrainedbaseline,high10&h264-level=51&h264-deinterlace=true&TranscodeReasons=VideoCodecNotSupported
        fetch('https://streaming.arthurcargnelli.eu/Users/d701f60ea1f848329833cf9dbd96b321/Items/' + id + '?api_key=da7183f9064948a0b735cf0d2db10d2c')
        .then( response => {
            if (response.status == 200) {
                return response.json()
            } else {
                console.error("Bad response status: ", response.status);
            }
        })
        .then((movieData: MovieModel) => {
            setMovie(movieData)
            fetch('https://streaming.arthurcargnelli.eu/Items/' + movieData.Id + '/PlaybackInfo?UserId=d701f60ea1f848329833cf9dbd96b321&StartTimeTicks=0&IsPlayback=true&AutoOpenLiveStream=true&MediaSourceId=' + movieData.Id + '&MaxStreamingBitrate=3&api_key=da7183f9064948a0b735cf0d2db10d2c')
                .then( response => {
                    if (response.status == 200) {
                        return response.json()
                    } else {
                        console.error("Bad response status: ", response.status);
                    }
                })
                .then((playback: PlaybackModel) => {
                    console.log(playback)
                    if (playback.MediaSources[0].SupportsDirectStream) {
                        const directOptions: Record<
                        string,
                        string | boolean | undefined | null
                        > = {
                        Static: false,
                        mediaSourceId: playback.MediaSources[0].Id,
                        deviceId: "APPREACTNATIVETEST",
                        api_key: "da7183f9064948a0b735cf0d2db10d2c"
                        };
                
                        if (playback.MediaSources[0].ETag) {
                        directOptions.Tag = playback.MediaSources[0].ETag;
                        } 
                        const params = stringify(directOptions);
                        setParams(params)
                        setPlayBack(playback)
                    }  else if (
                        playback.MediaSources[0].SupportsTranscoding &&
                        playback.MediaSources[0].TranscodingUrl
                      ) {
                        const source = playback.MediaSources[0].TranscodingUrl;
                      }
                });
        });
    }, [])
    return <View> 
        <Text style={styles.h1} >{movie?.Name} </Text>
        {movie && playback && params ? video(movie, playback, params) : <Text> Loading ...</Text> }
        </View>
  }


export function Screen2 ({route}){
    return (
        <View>
            {getMovie(route.params.itemId)}
        </View>
    )
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