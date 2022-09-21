import React from 'react';
import { ImageBackground,View,Button } from 'react-native';

function WelcomeScreen(props) {
    return (
        <ImageBackground 
        style={{flex:1,
        justifyContent:"flex-end",}}
        source={require("../assets/Wallpaper.jpg")}>
        <View style={
            {
                backgroundColor:"red",
            
                width:"100%",
                height:70,
                
   
            }
        }/>
        <View 
        
        style={
            {
                backgroundColor:"green",
            
                width:"100%",
                height:70,
                
   
            }
        }/><Button title="Click me"/>
        </ImageBackground>
        

        
    );
}

export default WelcomeScreen;