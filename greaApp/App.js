import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView, BackHandler, Platform, Linking, Alert, ImageBackground } from 'react-native';
import * as React from 'react';
import { useEffect, useRef, useCallback } from 'react';
import {WebView} from 'react-native-webview'
import Constants from 'expo-constants'

export default function App(props) {

  const webviewRef = useRef(null);
 
  const onAndroidBackPress = useCallback(() => {
    if (webviewRef.current) {
        webviewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  }, []);

  useEffect(() => {

      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
      };

  }, [onAndroidBackPress]);

  return (

    <ImageBackground
      source={require('./assets/backG.png')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>

        <WebView
          allowsBackForwardNavigationGestures={props.allowsBackForwardNavigationGestures ?? true}
          ref={webviewRef}
          style={{ flex: 1 }}


          source={{ uri: 'http://172.30.1.57:3000/' }}
          
          javaScriptEnabled={true}
          domStorageEnabled={true}
          originWhitelist={['*']}
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          startInLoadingState={true} />
        <StatusBar style="auto" />


      </SafeAreaView>
      </ImageBackground>

  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBareHeight,
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // 이미지 크기를 조정하여 컨테이너를 덮도록 설정
  },
});

