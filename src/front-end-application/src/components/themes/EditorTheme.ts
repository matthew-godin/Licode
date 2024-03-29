import { createTheme } from '@mui/material/styles';
import React from 'react';

declare module '@mui/material/styles' {
    interface PaletteColor {
        checkmark?: string;
        cross?: string;
    }

    interface SimplePaletteColorOptions {
        checkmark?: string;
        cross?: string;
    }

    interface Palette {
        button: Palette['primary'];
    }

    interface PaletteOptions {
        button: PaletteOptions['primary'];
    }

    interface TypographyVariants {
        problemDescription: React.CSSProperties;
        problemHighlightedWord: React.CSSProperties;
        problemHighlightedItalicWord: React.CSSProperties;
        problemDescriptionItalic: React.CSSProperties;
        aboveEditor: React.CSSProperties;
        inputOutput: React.CSSProperties;
        buttonExponent: React.CSSProperties;
        welcomeTitle: React.CSSProperties;
        welcomeSubtitle: React.CSSProperties;
        mainTitle: React.CSSProperties;
        expandable: React.CSSProperties;
    }

    interface TypographyVariantsOptions {
        problemDescription?: React.CSSProperties;
        problemHighlightedWord: React.CSSProperties;
        problemHighlightedItalicWord: React.CSSProperties;
        problemDescriptionItalic: React.CSSProperties;
        aboveEditor: React.CSSProperties;
        inputOutput: React.CSSProperties;
        buttonExponent: React.CSSProperties;
        welcomeTitle?: React.CSSProperties;
        welcomeSubtitle?: React.CSSProperties;
        mainTitle?: React.CSSProperties;
        expandable?: React.CSSProperties;
    }
}

declare module '@mui/material/IconButton' {
    interface IconButtonPropsColorOverrides {
        button: true;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        problemDescription: true;
        problemHighlightedWord: true;
        problemHighlightedItalicWord: true;
        problemDescriptionItalic: true;
        aboveEditor: true;
        inputOutput: true;
        buttonExponent: true;
        welcomeTitle: true;
        welcomeSubtitle: true;
        mainTitle: true;
        expandable: true;
    }
}

const editorTheme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',
            checkmark: '#11bb77',
            cross: '#ff0000',
        },
        button: {
            main: '#000000',
        },
    }
});

editorTheme.typography.expandable = {
    fontFamily: 'Inter',
}

editorTheme.typography.problemDescription = {
    fontFamily: 'Arial',
    color: '#000000',
    fontSize: 16,
}

editorTheme.typography.problemHighlightedWord = {
    fontFamily: 'Arial',
    color: '#1468ab',
    fontSize: 16,
}

editorTheme.typography.problemDescriptionItalic = {
    fontFamily: 'Arial',
    color: '#000000',
    fontSize: 16,
    fontStyle: 'italic',
}

editorTheme.typography.problemHighlightedItalicWord = {
    fontFamily: 'Arial',
    color: '#1468ab',
    fontSize: 16,
    fontStyle: 'italic',
}

editorTheme.typography.aboveEditor = {
    fontFamily: 'Arial',
    color: '#000000',
    fontSize: 18,
}

editorTheme.typography.inputOutput = {
    fontFamily: 'Arial',
    color: '#000000',
    fontSize: 16,
}

editorTheme.typography.buttonExponent = {
    fontFamily: 'Arial',
    color: '#000000',
    fontSize: 12,
}

editorTheme.typography.welcomeTitle = {
    fontFamily: 'Varela Round',
    color: '#000000',
    fontSize: 56,
}

editorTheme.typography.welcomeSubtitle = {
    fontFamily: 'Varela Round',
    color: '#000000',
    fontSize: 20,
}

editorTheme.typography.mainTitle = {
    fontFamily: 'Varela Round',
    color: '#000000',
    fontSize: 48,
}

export default editorTheme;