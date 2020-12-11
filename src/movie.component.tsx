import React, {useEffect, useState } from 'react';
import { View, Text } from 'react-native'
import { MovieModel } from '../model/ListItems';


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
        .then((movieData: MovieModel) => setMovie(movieData));
    }, [])
    return <View> 
        <Text>{movie?.Name} </Text>
        </View>
  }


export function Screen2 ({navigation, route}){
    return (
        <View>
            {getMovie(route.params.itemId)}
        </View>
    )
}