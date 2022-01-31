//para utilizar uma imagem em uma tag HTML é preciso realizar a importação dela, não funciona apenas passando o "src" dela ou caminho... (webpack)
//além disso, a importação é passada para a tag HTML dentro de chaves 
import {useHistory} from 'react-router-dom';
import { FormEvent, useState } from 'react';

import toast, { Toaster } from 'react-hot-toast';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import {database} from '../services/firebase';

import {Button} from '../components/Button';
import {useAuth} from '../hooks/useAuth';

import { AuthHomePageLogoutAccount } from '../components/logoutAuthPage/HomeAuthLogout';

import '../styles/auth.scss';

//todo nome de componente react começa com letra maiúscula 
export function Home() {
    //todo use/hook deve ser utilizado dentro do componente porque ele vai utilizar as informações do componente 
    const history = useHistory()
    const {user, signInWithGoogle} = useAuth()
    const [roomCode, setRoomCode] = useState('')

    const notifyRoomNoExist = () => {
        toast.error('Room does not exists!',
            {
                style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                },
            }
        );
    }

    const notifyRoomIsClosed = () => {
        toast.error('Room already closed!');
    }

    async function handleCreateRoom() {
        if(!user){
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault() //para não dar reload e recarregar (piscar) a página toda

        //verificando se a sala está vazia
        if(roomCode.trim() === '') {
            return
        }

        //buscando a chave/código da sala no bancod de dados do firebase
        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        //caso a sala não exista, dar um alert na tela
        if(!roomRef.exists()){
            notifyRoomNoExist()
            return
        }

        if(roomRef.val().endedAt){
            // alert('Room already closed.');
            notifyRoomIsClosed()
            return;
        }

        //caso a sala exista o usuário é redirecionado para a ela 
        history.push(`/rooms/${roomCode}`)
    }



    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask"/>
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="ícone do Google"/>
                        Crie a sua sala com o Google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                        <Toaster />
                    </form>
                    <AuthHomePageLogoutAccount />
                </div>
            </main>

    </div>
    )
}