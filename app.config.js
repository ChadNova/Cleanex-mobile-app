export default {
  expo: {
    name: "CleanEx",
    slug: "cleanex-student-app",
    version: "1.0.2",
    orientation: "default",
    icon: "./assets/images/icon.png",
    scheme: "cleanex",
    userInterfaceStyle: "light",
    newArchEnabled: false,

    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.cleanex.student",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription:
          "CleanEx uses the camera to allow users to upload their profile photos",
      },
    },

    android: {
      package: "com.cleanex.student",
    },

    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#4F46E5",
          image: "./assets/images/logo.png",
          resizeMode: "contain",
        },
      ],
    ],

    extra: {
      router: {},
      eas: {
        projectId: "aeb1b54c-2061-44fa-81e2-0f5ab0a0ee7f",
      },
    },
  },
};
