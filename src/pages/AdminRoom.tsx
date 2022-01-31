import { useHistory, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import circle1 from '../assets/images/circle1.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { Room } from '../pages/Room';

import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

import '../styles/admin-room.scss';

type RoomParams = {
    id: string;
}

export function AdminRoom(): JSX.Element {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { user } = useAuth();
    const { title, roomAuthorId, questions } = useRoom(roomId);


    function goHome() {
        history.push('/');
    }

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })
        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }  

    async function handleCheckQuestionAsAnswered(questionId: string, isAnswered: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: !isAnswered, //false value
        })
    }

    async function handleHighLightQuestion(questionId: string, isHighLighted: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: !isHighLighted, //false value
        })
    }

    useEffect(() => {
        if(user?.id && roomAuthorId) {
            if(user?.id !== roomAuthorId) {
                history.replace(`/rooms/${roomId}`)
            }
        }

        if(!user?.id && roomAuthorId) {
            history.replace(`/rooms/${roomId}`)
        }
    }, [history, roomAuthorId, user, roomId])

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" onClick={() => goHome()}/>
                    <a href={`/rooms/${roomId}`}>
                        Sala do Participante
                    </a>
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                {questions.length === 0 && <div className="empty-questions">
                    <img src={circle1} alt="Imagem de perguntas e respostas" />
                    <p className="first-description">Nenhuma pergunta por aqui...</p>
                    <p className="second-description">Envie o código desta sala para seus amigos e <br></br>comece a responder perguntas.</p>
                </div> }
                

                <div className="question-list">
                    {questions.length >= 1 ? (
                        questions.map((question) => (
                            <Question
                                content={question.content}
                                userName={user?.name}
                                isHighLighted={question.isHighLighted}
                                isAnswered={question.isAnswered}
                                author={question.author}
                                key={question.id}
                            >
                            <button
                                type="button"
                                onClick={() =>
                                    handleCheckQuestionAsAnswered(question.id, question.isAnswered)
                                }
                            >
                                <img src={checkImg} alt="Marcar pergunta como respondida" />
                            </button>

                            {!question.isAnswered && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleHighLightQuestion(question.id, question.isHighLighted)}
                                    >
                                        <img src={answerImg} alt="Dar destaque à pergunta" />
                                </button>
                            )}

                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                                </Question>
                            ))
                        ) : (
                            <div></div>
                        )}
                </div>
            </main>
        </div>
    );
}
