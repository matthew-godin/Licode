import * as React from "react";
import {  Button, Typography, Grid  } from "@mui/material"
import LicodeAppBar from "./LicodeAppBar";
import ProductHero from "./ProductHero";
import { ThemeProvider } from '@mui/material/styles';
import editorTheme from './themes/editorTheme';

export interface HomeProps {}

export interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
  //state = { :  }
  render() {
    return (
      <ThemeProvider theme={editorTheme}>
        <React.Fragment>
          <LicodeAppBar hasToken={false} username=""/>
          <ProductHero />
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default Home;