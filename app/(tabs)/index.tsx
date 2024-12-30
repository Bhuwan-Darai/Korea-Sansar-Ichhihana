import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, View, Text, Button } from "react-native";
import { WebView } from "react-native-webview";
import { useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { get } from "http";

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [error, setError] = useState<{
    code: number;
    description: string;
  } | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  console.log("Permission", permission);

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    };

    getLocationPermission();
  }, []);

  if ((!permission?.granted && !location) || errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <StatusBar style="dark" />
          <Text style={styles.message}>
            We need your permission to show the camera
          </Text>
          <Button
            onPress={() => requestPermission()}
            title="Grant Permission"
          />
          <Button
            onPress={async () => {
              const { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
              }

              let location = await Location.getCurrentPositionAsync({});
              setLocation(location);
            }}
            title="Grant Location Permission"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error.description}</Text>
          </View>
        ) : (
          <WebView
            style={styles.webview}
            source={{
              uri: "https://www.ichhihana.com.np/login",
              // headers: {
              //   "User-Agent":
              //     "Mozilla/133.0.3 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.200 Safari/537.36",
              // },
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              setError(nativeEvent);
            }}
            // onShouldStartLoadWithRequest={(request) => {
            //   if (request.url.includes("accounts.google.com")) {
            //     WebBrowser.openBrowserAsync(request.url);
            //     return false;
            //   }
            //   return true;
            // }}
            domStorageEnabled={true}
            sharedCookiesEnabled={true}
            userAgent="Mozilla/133.0.3 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.200 Safari/537.36"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
