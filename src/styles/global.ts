import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    body {
        background: ${props => props.theme.colors.background};
        font-size: 14px;
        color: ${props => props.theme.colors.text};
        font-family: sans-serif;
    }
`;