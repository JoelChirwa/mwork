import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

function useSocialAuth() {
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startSSOFlow } = useSSO();

    const handleSocialAuth = async (strategy: "oauth_google"| "oauth_facebook") => {
        setLoadingStrategy(strategy);
        try {
           const { createdSessionId, setActive} = await startSSOFlow({ strategy });
              if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
              }  
        } catch (error) {
            console.log("Social auth error: ", error);
            const provider = strategy === "oauth_google" ? "Google" : "Facebook";
            Alert.alert("Authentication Error", `Failed to sign in with ${provider}. Please try again.`); 
        } finally {
            setLoadingStrategy(null);
        }
    }
  return { loadingStrategy, handleSocialAuth };
}

export default useSocialAuth;