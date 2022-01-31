import {createContext, ReactNode, useEffect, useState} from 'react'
import {auth, firebase} from '../services/firebase'

//tipagem para evitar o erro de tipos no typescript
type User = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
    logoutPage: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType) 

export function AuthContextProvider(props: AuthContextProviderProps): JSX.Element {

  //criando um estado
  const [user, setUser] = useState<User>()

  //recupera a informação do usuário que está logado caso ele dê um F5 na página
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){
        const {displayName, photoURL, uid} = user

        if(!displayName || !photoURL){
          throw new Error('Missing information from Google Account.')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)

        if(result.user){
          const {displayName, photoURL, uid} = result.user

          if(!displayName || !photoURL){
            throw new Error('Missing information from Google Account.')
          }

          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
        }
      }

      async function logoutPage() {
        await auth.signOut()
        setUser(undefined)
      }

    return(
        <AuthContext.Provider value={{user, signInWithGoogle, logoutPage}}>
            {props.children}
        </AuthContext.Provider>
    );
}