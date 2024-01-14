import React, { useState, useEffect, useContext } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Text, View } from "../../components/Themed";
import * as ImagePicker from "expo-image-picker";
import { ref, storage } from "../../utils/firebaseConfig";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ImageContext } from "../../contexts/ImageContextProvider";
import ImageViewer from "../../components/ImageViewer";
import CustomImageCaptureButton from "../../components/CustomImageCaptureButton";

const PlaceholderImage = require('../../assets/images/pose-image.png');

export default function TabOneScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showImageUploadSpinner, setShowImageUploadSpinner] = useState(false);

  const [globalHeight, setGlobalHeight] = useState<number>(null);

  const { width, height } = useWindowDimensions();
  const { setImgSrc } = useContext(ImageContext);

  useEffect(() => {
    setGlobalHeight(height - 100);
  }, []);

  const pickImageFromCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: undefined,
      quality: 1,
    });
    // Explore the result
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: undefined,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const retakeImage = () => setImage(null);

  const uploadFile = async (blobFile, fileName): Promise<string> => {
    if (!blobFile) return;
    const sotrageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(sotrageRef, blobFile);
    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        setShowImageUploadSpinner(false);
        console.log(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Download url is : ", downloadUrl);
        setImgSrc(downloadUrl);
        setUploading(true);
        setShowImageUploadSpinner(false);
      }
    );
  };

  const uploadImage = async () => {
    setShowImageUploadSpinner(true);
    const blob: Blob | Uint8Array | ArrayBuffer = await new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      }
    );
    const filename = image.substring(image.lastIndexOf("/") + 1);
    await uploadFile(blob, filename);
  };

  return (
    <View style={styles.container}>
      {!image ? (

        <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ImageViewer placeholderImageSource={PlaceholderImage} />
        </View>
        <View style={styles.footerContainer}>
          <CustomImageCaptureButton theme="primary" label="Choose a photo" clickFn={pickImageFromGallery}/>
          <CustomImageCaptureButton theme="secondary" label="Capture from Camera" clickFn={pickImageFromCamera} />
        </View>
        </View>
      ) : (
        <View>
          <ImageBackground
            source={{ uri: image }}
            style={{ width, height: globalHeight }}
          >
            { showImageUploadSpinner && <ActivityIndicator size="large" style={styles.spinner} color="cyan" />}
            <TouchableOpacity style={styles.floatingButtonCameraRetake} onPress={retakeImage}>
              <MaterialCommunityIcons
                name="camera-retake"
                size={60}
                color="#2196f3"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingButtonConfirm} onPress={uploadImage}>
            <MaterialCommunityIcons name="check-circle" size={60} color="#d500f9" />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  floatingButtonCameraRetake: {
    width: 100,
    height: 100,
    borderRadius: 30,
    position: "absolute",
    bottom: 10,
    right: -10,
  },
  floatingButtonConfirm: {
    width: 100,
    height: 100,
    borderRadius: 30,
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  imageContainer: {
    flex:1, 
    paddingTop: 58
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  spinner: {
    flex: 1
  }
});
