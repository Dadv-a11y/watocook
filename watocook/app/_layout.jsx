import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
 return <>
  <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home"  />
      <Stack.Screen name="recipe-list"/>
      <Stack.Screen name="login"  />
      <Stack.Screen name="register" />
      <Stack.Screen name="bookmark" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="recipe-detail" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="recipes" />
      </Stack>
      <StatusBar/>
 </>
}
