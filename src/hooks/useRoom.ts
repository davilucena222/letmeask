import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighLighted: boolean;
    isAnswered: boolean;
    likes?: Record<string, {
        authorId: string;
    }>
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighLighted: boolean;
    isAnswered: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type RetursFromUseRoom = {
    questions: QuestionType[];
    title: string;
    roomAuthorId: string;
}


export function useRoom(roomId: string): RetursFromUseRoom {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);

    const [roomAuthorId, setRomAuthorId] = useState('');

    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRoom = room.val(); //tira uma foto de como está as infomrações do banco de dados naquele determinado momento
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}; 

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, { author, content, isHighLighted, isAnswered, likes }]) => {

                const arrayLike = Object.entries(likes ?? {}).find(([likeId, like]) => like.authorId === user?.id)

                const likeId = arrayLike?.[0] ?? undefined

                return {
                    id: key,
                    content,
                    author,
                    isHighLighted,
                    isAnswered,
                    //não precisa do entries() porque o values() já capta o valor próprio de cada objeto sem a necessidade do id(identificador de cada questão)
                    likeCount: Object.values(likes ?? {}).length,
                    likeId,
                }
            })

            const findQuestionsPerLikes = parsedQuestions.sort((likeX, likeY) => likeY.likeCount - likeX.likeCount);

            const findQuestionsPerAnswered = findQuestionsPerLikes.sort((likeX, likeY) => {
                if(likeX.isAnswered === likeY.isAnswered){
                    return 0;
                }

                if(likeX.isAnswered){
                    return 1;
                }

                return -1;
            })

            setTitle(databaseRoom?.title);
            setQuestions(findQuestionsPerAnswered);
            setRomAuthorId(databaseRoom?.authorId);
        })

        return () => {
            //remove todos os eventListeners que fazem parte da referência de sala (roomRef) do "value"  
            roomRef.off('value');
        }
    }, [roomAuthorId, roomId, user]);

    return {questions, title, roomAuthorId}
}