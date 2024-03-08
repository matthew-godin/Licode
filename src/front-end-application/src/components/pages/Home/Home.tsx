import * as React from "react";
//import LicodeAppBar from "../../common/LicodeAppBar";
//import ProductHero from "../../common/ProductHero";
import Banner from "./components/Banner/Banner";
import { ThemeProvider } from '@mui/material/styles';
import editorTheme from '../../themes/EditorTheme';
import { HomeProps } from "./HomeProps";
import { HomeState } from "./HomeState";
import HomeButton from "./components/HomeButton/HomeButton";

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <ThemeProvider theme={editorTheme}>
        <React.Fragment>
          {/*<LicodeAppBar />
          <ProductHero />*/}
          {/*<Banner />*/}
          <HomeButton label="GET STARTED" background="#000000" color="#ffffff" />
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default Home;
