import { createContext, useContext, useEffect, useState } from "react";
import { statusCodes } from '@react-native-google-signin/google-signin';
import { auth , GoogleSigninConfig } from '../firebase.config';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebasesignOut, updateProfile , deleteUser} from 'firebase/auth';
import { useRouter } from "expo-router";
import authFirebase from '@react-native-firebase/auth';
import { useStorageState } from "../hooks/useStorage";

// webBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({
    user : null ,
    signIn : async (email, password) => {},
    signUp : async (name ,email, password) => {},
    googelSignIn : async () => {},
    isloading : false ,
    signOut : async () => {},
    error : { visible: false, message: '', type: 'info' },
    isLoadingData: false, 
    session : {email : '', displayName : '', photoURL : '', metadata : {} } ,
    deleteUser : async () => {}
});
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({ visible: false, message: '', type: 'info' });
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();
    const [[isLoadingData, session], setSession] = useStorageState('session');

      useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
          setGoogleLoading(false);
        })
        return () => unsubscribe();
      },[]);


      const signIn = async (email, password) => {
          setLoading(true);
             try {
             const { user } = await signInWithEmailAndPassword(auth, email, password);
             setSession({ ...user});
             setUser(user)
             router.back();
              } catch (error) {
               setError({ visible: true, message: 'Login failed. Please check your credentials.', type: 'error' });
              } finally{
               setLoading(false);
            }
      };

      const signUp = async (name ,email, password) => {
             setLoading(true);
                try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                 updateProfile( user , { displayName: name });
                 router.push('/login');
                } catch (error) {
                 setError({ visible: true, message: 'Registration failed. Please try again.', type: 'error' });
                } finally{
                 setLoading(false);
                }
      }

      const signOut = async () => {
         await firebasesignOut(auth);
          setSession(null)
      }

    const googelSignIn = async () => {
    setGoogleLoading(true);
    try {

      await GoogleSigninConfig.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const { idToken } = await GoogleSigninConfig.signIn();

      const googleCredential = authFirebase.GoogleAuthProvider.credential(idToken);

     const {user} = await authFirebase().signInWithCredential(googleCredential);
      setSession({...user})
      setUser(user)
      setError({ visible: true, message: 'Signed in with Google!', type: 'info' });

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        setError({ visible: true, message: 'Google Sign-in cancelled.', type: 'error' });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        setError({ visible: true, message: 'Google Sign-in already in progress.', type: 'warn' });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        setError({ visible: true, message: 'Google Play Services not available or outdated.', type: 'error' });
      } else {
        // some other error happened
        setError({ visible: true, message: 'Google Sign-in failed.', type: 'error' });
      }
    } finally {
      setGoogleLoading(false);
    }
  }

return <AuthContext.Provider value={{ user , signIn , signUp , isloading : loading || googleLoading, signOut , error , googelSignIn , isLoadingData  , session , deleteUser : deleteUser(user)}}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
