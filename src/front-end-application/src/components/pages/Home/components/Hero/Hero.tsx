import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';
import HomeButton from '../HomeButton/HomeButton';
import Banner from './components/Banner/Banner';
import AOS from "aos";
import 'aos/dist/aos.css';

export interface HeroProps {
}

const StyledSection = styled('section')(({ theme }) => ({
    backgroundColor: "black",
    padding: "2rem"
}));
const StyledHeading = styled('h1')(({ theme }) => ({
    color: "white",
    marginBottom: "1rem",
    lineHeight: "1.1",
    fontSize: "2rem",
    [theme.breakpoints.up('md')]: {
        fontSize: "4rem"
    }
}));
const StyledParagraph = styled('p')(({ theme }) => ({
    fontSize: "1.25rem",
    color: "#c3c3c3",
    letterSpacing: "1px",
    margin: "2rem 0 2.5rem",
    [theme.breakpoints.up('md')]: {
        fontSize: "1.5rem"
    }
}));
const StyledBlock = styled('div')(({ theme }) => ({
    textAlign: "center",
    alignSelf: "center"
}));

function Hero(props: HeroProps) {
    useEffect(() => {
        AOS.init();
        AOS.refresh();
      }, []);
    return (
        <StyledSection>
            <Box sx={{ flexGrow: 1, margin: "0 auto" }}>
                <Grid container spacing={2}>
                    <Grid xs={0} md={0.2} />
                    <Grid item xs={12} md={5.8}>
                        <StyledBlock>
                            <StyledHeading data-aos="zoom-in-up"><Typography variant="expandable">Competitive Programming for Everyone</Typography></StyledHeading>
                            <StyledParagraph><Typography variant="expandable">Measure yourself against other programmers today.</Typography></StyledParagraph>
                            <HomeButton label="GET STARTED" background="#fff" color="#000" />
                        </StyledBlock>
                    </Grid>
                    <Grid data-aos="zoom-in" item xs={12} md={5.8}>
                        <Banner dataAos="" color="white" />
                    </Grid>
                    <Grid xs={0} md={0.2} />
                </Grid>
            </Box>
        </StyledSection>
    );
}

export default Hero;