import React from "react";
import { View, Text, StyleSheet, BlurView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "./screens/CameraScreen.js";
import HomeScreen from "./screens/HomeScreen";
import ClickedPhoto from "./screens/ClickedPhoto";

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      /* If you do not want the header use property headerMode="none" in createStackNavigator  */

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: "Camera",
              headerTintColor: "black",
              headerStyle: {
                backgroundColor: "#A4B0BD",
              },
              animationEnabled: false,
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="CameraScreen"
            component={CameraScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ClickedPhoto"
            component={ClickedPhoto}
            options={{
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
