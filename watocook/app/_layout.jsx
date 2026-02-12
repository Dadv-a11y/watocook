import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { AuthProvider, useAuth } from "../contest/authContext";

export default function RootLayout() {

    const {session} = useAuth();

 return <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home"  />
      <Stack.Screen name="recipe-list"/>
      <Stack.Screen name="login"  />
      <Stack.Screen name="register" />
      <Stack.Protected guard={!!session}>
      <Stack.Screen name="profile" />
      </Stack.Protected>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="recipe-detail" />
      <Stack.Protected guard={!!session} >
        <Stack.Screen name="bookmark" />
      </Stack.Protected>
      <Stack.Screen name="recipes" />
      </Stack>
      <StatusBar/>
 </AuthProvider>
}
