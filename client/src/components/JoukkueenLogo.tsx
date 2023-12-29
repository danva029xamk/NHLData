import React from 'react';
import logot from '../constants/logot';

interface JoukkueenLogoProps {
    teamCode: keyof typeof logot;
    width?: string;  // Lisätty valinnainen leveysprop
}
  
const JoukkueenLogo: React.FC<JoukkueenLogoProps> = ({ teamCode, width = '100px' }) => {
    const logoUrl = logot[teamCode];

    if (!logoUrl) {
        return null;
    }

    const logoStyle = {
        width,
        height: 'auto'
    };

    return <img src={logoUrl} alt={`${teamCode} logo`} style={logoStyle} />;
}

export default JoukkueenLogo;