import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2450a8',
        },
        secondary: {
            light: '#f50057',
            dark: '#f50031',
            main: '#f50031',
        },
        mode: 'light',
    },
});
export default theme;
