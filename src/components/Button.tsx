//importando propriedades HTML para usar no react
import {ButtonHTMLAttributes} from 'react'

import '../styles/button.scss'

//passando propriedades HTML para o botão
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined? : boolean
}

//desestrurando um objeto, tudo o que não for de "isOutlined" é repassado para "...props", ou seja, "rest operator".
export function Button({ isOutlined = false, ...props }: ButtonProps) {
    return(
        //spread operator: distribuir as propriedades que são recebidas via parâmetros para uma tag (button) em específico 
        <button 
            className={`button ${isOutlined ? 'outlined' : ''}`}
            {...props}
        />
    )
}