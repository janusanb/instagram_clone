import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';

export default function Add(navigation) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasPermission, setHasPermission] = useState(null); //this is like this.state and in this case null, does same thing as state
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    /*The following is a function component, but now you can use states in function and include lifecycle components*/
    useEffect(() => {
        (async () => {
            // Permissions to check if we have gallery and camera permissions
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');

            const { galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    // aync because we will have a await so it can take a picture and lock the code until the picutre is taken
    const takePicture = async () => {
        if(camera){
            const data = await camera.takePictureAsync(null);
            //when picutre is taken it is saved in a temp folder and we are going to see what the URI is //console.log(data.uri) 
            setImage(data.uri)

        }

    }

    //Function to pick image (stock function)
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, //MediaType is an inum and we can pick between 3 options 
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result.uri);
        }
      };

    if (hasPermission === null || hasGalleryPermission == false) {
        return <View />;
    }
    if (hasPermission === false || hasGalleryPermission == false) {
        return <Text>No access to camera or gallery</Text>;
    }
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={ref => setCamera(ref)} //we are able to access the camera because it has the reference to the camera we are using
                    style={styles.fixedRatio}
                    type={type}
                    ratio={'1:1'} />
            </View>

            <Button
                style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center'
                }}
                title="Flip"
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back //if I have front camera activated it will switch to back and vice versa
                        // it is another state function
                    );
                }}>
            </Button>

            <Button title="Click" onPress={() => takePicture()} />
            <Button title="From Gallery " onPress={() => pickImage()} />
            <Button title="Save" onPress={() => navigation.navigate('Save', {image})} /> {/*Save can access the image data*/}
            {image && <Image source={{uri: image}} style={{flex: 1}}/>} 
            {/*When a picture is taken it appears below as a view*/}
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1 //forces the camera component to be a square
    }
})