import { Redirect } from "expo-router";

export default function Index() {
  // later verify if onboarding has been completed
  return  <Redirect href={"/onboarding"}/>
}