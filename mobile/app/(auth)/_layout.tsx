import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  // Don't redirect, just show the stack - navigation will be handled elsewhere
  return <Stack screenOptions={{headerShown: false}} />
}