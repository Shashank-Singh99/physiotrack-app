import { useContext, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';

import WebView from "react-native-webview";
import { ImageContext } from '../../contexts/ImageContextProvider';

const debugging = `
     // Debug
     console = new Object();
     console.log = function(log) {
      window.ReactNativeWebView.postMessage(log);
     };
     console.debug = console.log;
     console.info = console.log;
     console.warn = console.log;
     console.error = console.log;
     `;

export default function TabTwoScreen() {
  const webViewRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const { imgSrc, setImgSrc } = useContext(ImageContext);
  
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string>(null);

  const handleMessage = (message: any) => {
    const webViewMessage = JSON.stringify(message?.nativeEvent?.data);

    if (webViewMessage.includes('terminate')) {
      const pdfDownloadUrl = webViewMessage.slice(webViewMessage.indexOf('-') + 1);
      console.log("The Guava url is : ", pdfDownloadUrl);
      setPdfDownloadUrl(pdfDownloadUrl);
      setImgSrc(null);
    }
  }

  if (!imgSrc && pdfDownloadUrl) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
       <WebView
          injectedJavaScript={debugging}
          source={{ uri: pdfDownloadUrl }}
          cacheEnabled={false}
        />
    </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
       <WebView
          injectedJavaScript={debugging}
          ref={webViewRef}
          source={{ uri: `https://physiotrack-28fa2.web.app/verify?imgUrl=${encodeURI(imgSrc)}&width=${width}&height=${height}` }}
          cacheEnabled={false}
          onMessage={handleMessage}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
