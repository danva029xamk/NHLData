import { createTheme } from '@mui/material/styles';
import teamColors from './constants/colours';

type TeamColors = {
    primary: string;
    secondary: string;
    tertiary?: string;
};

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#B9B3B3',
    },
    secondary: {
      main: '#525252',
    },
    background: {
      default: '#d3d3d3',
      paper: '#fff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#404040',
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h3: {
      fontWeight: 700, 
    },
    h5: {
      fontWeight: 500, 
    },
  },
});
  
export const getTeamTheme = (teamCode: keyof typeof teamColors) => {
  const colors: TeamColors = teamColors[teamCode];

  return createTheme({
    palette: {
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },

      ...(colors.tertiary && {
        tertiary: {
          main: colors.tertiary,
        },
      }),

      background: {
        default: colors.primary,
        paper: colors.secondary
      },

      text: {
        // Tarkistetaan, onko tertiary-väri määritelty ja käytetään sitä tekstin värinä
        // Muussa tapauksessa käytetään primary-väriä
        primary: colors.tertiary ? colors.tertiary : colors.primary,
        secondary: colors.secondary,
      },

    },
  });
};
    
export default defaultTheme;