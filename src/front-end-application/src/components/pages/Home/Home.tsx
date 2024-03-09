import * as React from "react";
import { ThemeProvider } from '@mui/material/styles';
import editorTheme from '../../themes/EditorTheme';
import { HomeProps } from "./HomeProps";
import { HomeState } from "./HomeState";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Hero from "./components/Hero/Hero";

class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <ThemeProvider theme={editorTheme}>
        <React.Fragment>
          <NavigationBar color="#000000" iconColor="#ffffff" bodyColor="#d4d4d4" borderColor="#222" />
          <Hero />
        </React.Fragment>
      </ThemeProvider>
    );
  }
}

export default Home;
