import * as React from "react";
import LicodeAppBar from "../../common/LicodeAppBar";
import ProductHero from "../../common/ProductHero";
import { ThemeProvider } from '@mui/material/styles';
import editorTheme from '../../themes/EditorTheme';
import { HomeProps } from "./HomeProps";
import { HomeState } from "./HomeState";

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <ThemeProvider theme={editorTheme}>
        <React.Fragment>
          <LicodeAppBar />
          <ProductHero />
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default Home;