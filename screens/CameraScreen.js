import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Slider,
  SafeAreaView,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      hasMediaPermission: null,
      type: Camera.Constants.Type.back,
      isFlashLightOn: Camera.Constants.FlashMode.off,
      flashMode: "flash-off",
      flashStatus: "off",
      cameraMode: "Main",
      zoom: 0,
      whiteBalance: Camera.Constants.WhiteBalance.auto,
      whiteBalanceStatus: "auto",
      autoFocus: Camera.Constants.AutoFocus.on,
      supportedRatio: [],
      ratio: "16:9",
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({
      hasPermission: status === "granted",
    });
    const { mediaPermission } = await MediaLibrary.requestPermissionsAsync();
    this.setState({
      hasMediaPermission: mediaPermission === "granted",
    });
    this.getSupportedRatios();
  }

  /** Toggle the flash on press of button. */
  toggleFlash = () => {
    if (this.state.isFlashLightOn === Camera.Constants.FlashMode.off) {
      this.setState({
        isFlashLightOn: Camera.Constants.FlashMode.on,
        flashMode: "flash",
        flashStatus: "on",
      });
    } else if (this.state.isFlashLightOn === Camera.Constants.FlashMode.on) {
      this.setState({
        isFlashLightOn: Camera.Constants.FlashMode.auto,
        flashMode: "flash-auto",
        flashStatus: "auto",
      });
    } else {
      this.setState({
        isFlashLightOn: Camera.Constants.FlashMode.off,
        flashMode: "flash-off",
        flashStatus: "off",
      });
    }
  };

  getSupportedRatios = async () => {
    try {
      if (Platform.OS === "android" && this.camera) {
        const ratios = await this.camera.getSupportedRatiosAsync();
        this.setState({
          supportedRatio: ratios,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  takePicture = async () => {
    try {
      if (this.camera) {
        const { uri } = await this.camera.takePictureAsync();
        MediaLibrary.saveToLibraryAsync(uri);
        this.props.navigation.navigate("ClickedPhoto", {
          photo: uri,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  recordVideo = async () => {
    try {
      if (this.camera) {
        const { uri, codec = "mp4" } = await this.camera.recordAsync({
          maxDuration: 30,
        });
        const asset = await MediaLibrary.createAssetAsync(uri);
        MediaLibrary.createAlbumAsync("Expo Videos", asset)
          .then(() => {
            console.log("Video Album Created");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  zoomOut = () => {
    this.setState({
      zoom: this.state.zoom - 0.05,
    });
  };

  zoomIn = () => {
    this.setState({
      zoom: this.state.zoom + 0.05,
    });
  };

  setSlider = (value) => {
    this.setState({
      zoom: value,
    });
  };

  /** Method to change white balance. */
  toggleWhiteBalance = () => {
    if (this.state.whiteBalance === Camera.Constants.WhiteBalance.auto) {
      this.setState({
        whiteBalance: Camera.Constants.WhiteBalance.sunny,
        whiteBalanceStatus: "sunny",
      });
    } else if (
      this.state.whiteBalance === Camera.Constants.WhiteBalance.sunny
    ) {
      this.setState({
        whiteBalance: Camera.Constants.WhiteBalance.cloudy,
        whiteBalanceStatus: "cloudy",
      });
    } else if (
      this.state.whiteBalance === Camera.Constants.WhiteBalance.cloudy
    ) {
      this.setState({
        whiteBalance: Camera.Constants.WhiteBalance.shadow,
        whiteBalanceStatus: "shadow",
      });
    } else if (
      this.state.whiteBalance === Camera.Constants.WhiteBalance.shadow
    ) {
      this.setState({
        whiteBalance: Camera.Constants.WhiteBalance.fluorescent,
        whiteBalanceStatus: "fluorescent",
      });
    } else if (
      this.state.whiteBalance === Camera.Constants.WhiteBalance.fluorescent
    ) {
      this.setState({
        whiteBalance: Camera.Constants.WhiteBalance.incandescent,
        whiteBalanceStatus: "incandescent",
      });
    } else {
      this.setState({
        whiteBalance: Camera.Constants.WhiteBalance.auto,
        whiteBalanceStatus: "auto",
      });
    }
  };

  stopRecording = async () => {
    Alert.alert("Stop");
    try {
      if (this.camera) {
        this.camera.stopRecording();
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    console.log(this.props);

    if (this.state.hasPermission === null) {
      return <View />;
    }

    if (this.state.hasPermission === false) {
      return <Text>Sorry, You don't have access to the camera.</Text>;
    }

    return (
      <View style={styles.container}>
        <SafeAreaView
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            paddingTop: 40,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={this.toggleWhiteBalance}
          >
            <View>
              <MaterialIcons name="wb-iridescent" size={24} color="white" />
            </View>
            <View>
              <Text style={{ color: "white", fontSize: 12 }}>
                {this.state.whiteBalanceStatus}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <MaterialIcons name="aspect-ratio" size={24} color="white" />
            </View>
            <View>
              <Text style={{ color: "white", fontSize: 12 }}>Ratio</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
        <Camera
          style={{ flex: 9 }}
          zoom={this.state.zoom}
          type={this.state.type}
          autoFocus={this.state.autoFocus}
          whiteBalance={this.state.whiteBalance}
          ratio={this.state.ratio}
          flashMode={this.state.isFlashLightOn}
          // useCamera2Api={true}
          ref={(ref) => {
            this.camera = ref;
          }}
        >
          <View style={styles.iconsContainer}>
            <View style={styles.topViewContainer}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 2,
                    borderWidth: 0.5,
                    borderColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: "rgba(0,0,0,0.2)",
                  }}
                  onPress={this.zoomOut}
                >
                  <Feather name="zoom-out" size={35} color="white" />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 8,
                    padding: 10,
                  }}
                >
                  <Slider
                    color="white"
                    style={styles.zoomSlider}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor="white"
                    maximumTrackTintColor="rgba(122,122,122,0.8)"
                    thumbTintColor="white"
                    onValueChange={(value) =>
                      this.setState({
                        zoom: value,
                      })
                    }
                  />
                </View>
                <TouchableOpacity
                  style={{
                    flex: 2,
                    borderWidth: 0.5,
                    borderColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: "rgba(0,0,0,0.2)",
                  }}
                  onPress={this.zoomIn}
                >
                  <Feather name="zoom-in" size={35} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bottomViewContainer}>
              <View style={styles.iconTouchables}>
                <TouchableOpacity
                  style={styles.flipCameraButton}
                  onPress={() => {
                    this.setState({
                      type:
                        this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back,
                    });
                  }}
                >
                  <FontAwesome
                    name="camera"
                    size={50}
                    style={styles.cameraClickButton}
                  />
                </TouchableOpacity>
                <View>
                  {this.state.type === Camera.Constants.Type.back ? (
                    <Text style={{ color: "white" }}>Front</Text>
                  ) : (
                    <Text style={{ color: "white" }}>Back</Text>
                  )}
                </View>
              </View>

              <View style={styles.iconTouchables}>
                <TouchableOpacity onPress={this.takePicture}>
                  <FontAwesome
                    name="circle"
                    size={50}
                    style={styles.cameraClickButton}
                  />
                </TouchableOpacity>
                <View>
                  <Text style={{ color: "white" }}>Click</Text>
                </View>
              </View>

              <View style={styles.iconTouchables}>
                <TouchableOpacity onPress={this.toggleFlash}>
                  <MaterialCommunityIcons
                    name={this.state.flashMode}
                    size={50}
                    color="white"
                    style={styles.cameraClickButton}
                  />
                </TouchableOpacity>
                <View>
                  <Text style={{ color: "white" }}>
                    {this.state.flashStatus}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  iconsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topViewContainer: {
    flex: 9,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
    width: "80%",
    marginTop: 60,
  },
  cameraControlContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  bottomViewContainer: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  iconTouchables: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderContainer: {
    width: "60%",
  },
  zoomSlider: {
    borderWidth: 4,
  },

  cameraClickButton: {
    color: "rgba(255,255,255, 1)",
    padding: 10,
  },
});
