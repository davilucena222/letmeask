// import {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom';
// import {AuthContext} from '../contexts/AuthContext'

import {FormEvent, useState} from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import {Button} from '../components/Button';
// import {useAuth} from '../hooks/useAuth'

import '../styles/auth.scss';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';


export function NewRoom() {

    const{user} = useAuth() //pegando o ID do usuário que criou a sala para poder ter acesso ao usuário autenticado

    //redireciona o usuário para uma ouitra rota da página
    const history = useHistory()

    //Estado para armazenar o valor de uma variável
    const [newRoom, setNewRoom] = useState('')

    //sempre que separar funções é preciso tipar
    //o parâmetro de uma função que está sendo repassada para alguma tag nativa do HTML é o próprio evento dela, sendo assim ela passa a ter acesso direto a todos os eventos daquela determianda tag HTML 
    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()

        if(newRoom.trim() === ''){
            return
        }

        //se refere a uma "linha" do banco de dados
        const roomRef = database.ref('rooms')

        //acessando o local "room" dentro do banco de dados e jogando alguma informação lá dentro
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/rooms/${firebaseRoom.key}`)
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
    </div>
    )
}