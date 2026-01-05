import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import useSocialAuth from "@/hooks/useSocialAuth";

const AuthScreen = () => {
  const { isLoading, handleSocialAuth } = useSocialAuth();

  return (
    <View className="flex-1 bg-gray-50 px-8">
      {/* Top Spacer */}
      <View className="flex-1 justify-center items-center">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-64 h-64"
          resizeMode="contain"
        />

        <Text className="text-center text-gray-600 text-base mt-4 px-6">
          Connect with trusted local workers or find jobs near you — fast.
        </Text>
      </View>

      {/* Auth Buttons */}
      <View className="gap-4">
        {/* Google */}
        <TouchableOpacity
          className={`flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-4 ${
            isLoading ? "opacity-60" : ""
          }`}
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <>
              <Image
                source={require("../../assets/images/google.png")}
                className="w-6 h-6 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Facebook */}
        <TouchableOpacity
          className={`flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-4 ${
            isLoading ? "opacity-60" : ""
          }`}
          onPress={() => handleSocialAuth("oauth_facebook")}
          disabled={isLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#1877F2" />
          ) : (
            <>
              <Image
                source={require("../../assets/images/facebook.png")}
                className="w-6 h-6 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">
                Continue with Facebook
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Legal */}
      <View className="mt-10 mb-8">
        <Text className="text-center text-gray-500 text-sm leading-5 px-4">
          By continuing, you agree to our{" "}
          <Text className="text-blue-500">Terms of Service</Text>,{" "}
          <Text className="text-blue-500">Privacy Policy</Text> and{" "}
          <Text className="text-blue-500">Cookie Policy</Text>.
        </Text>
      </View>
    </View>
  );
};

export default AuthScreen;
