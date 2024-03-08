import { useState } from "react";
import { AppBar, Link, List, ListItem, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { shouldForwardProp } from "@mui/styled-engine";

export interface NavigationBarProps {
    color: string,
    bodyColor: string,
    borderColor: string,
    iconColor: string
}

const StyledNav = styled('nav', {shouldForwardProp: () => true})<{color: string}>(({ theme, color}) => ({
    background: color,
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: "1rem",
    alignItems: "center"
}));
const StyledSvg = styled('svg', {shouldForwardProp: () => true})<{collapsed:boolean, bodyColor: string, iconColor: string}>(({ theme, collapsed,
    bodyColor, iconColor }) => ({
    width: "40px",
    height: "40px",
    fill: collapsed ? bodyColor : iconColor,
    boxShadow: !collapsed ? "0 0 0 3px #666" : undefined,
    borderRadius: "5px",
    transition: "box-shadow 0.15s",
    cursor: "pointer",
    [theme.breakpoints.up('md')]: {
        display: "none"
    }
}));
const StyledList = styled('ul', {shouldForwardProp: () => true})<{collapsed:boolean, bodyColor: string}>(({ theme, collapsed, bodyColor }) => ({
    listStyle: "none",
    paddingLeft: "0",
    color: bodyColor,
    fontStyle: "bold",
    width: "100%",
    margin: "0",
    maxHeight: collapsed ? "0px" : "100vh",
    opacity: collapsed ? "0" : "1",
    transition: "all 0.3s",
    overflow: "hidden",
    fontSize: "1.6rem",
    [theme.breakpoints.up('md')]: {
        width: "auto",
        fontSize: "1.6rem",
        maxHeight: "100%",
        opacity: "1",
        display: "flex",
    }
}));
const StyledListItem = styled('li', {shouldForwardProp: () => true})<{borderColor: string}>(({ theme, borderColor }) => ({
    marginRight: "2rem",
    padding: "0.5rem 2rem",
    borderBottom: "1px solid " + borderColor,
    [theme.breakpoints.up('md')]: {
        border: "0px",
        display: "inline-block"
    }
}));
const StyledLink = styled('a', {shouldForwardProp: () => true})<{bodyColor: string}>(({ theme, bodyColor }) => ({
    textDecoration: "none",
    color: bodyColor,
    transition: "color 0.3s",
    "&:hover": {
        color: "#fff"
    }
}));

function NavigationBar(props: NavigationBarProps) {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const collapsibleClick = () => {
        setCollapsed(!collapsed);
    };

    return (
        <StyledNav color={props.color}>
            <a href="/licode">
                <img src="./licode.svg" width="200px" style={{filter: "invert(100%)"}} />
            </a>
            <StyledSvg collapsed={collapsed} bodyColor={props.bodyColor} iconColor={props.iconColor} onClick={collapsibleClick}>
                <use xlinkHref="./sprite.svg#menu"></use>
            </StyledSvg>
            <StyledList collapsed={collapsed} bodyColor={props.bodyColor}>
                <StyledListItem borderColor={props.borderColor}>
                    <StyledLink bodyColor={props.bodyColor} href="#"><Typography variant="expandable">Sign In</Typography></StyledLink>
                </StyledListItem>
                <StyledListItem borderColor={props.borderColor}>
                    <StyledLink bodyColor={props.bodyColor} href="#"><Typography variant="expandable">Sign Up</Typography></StyledLink>
                </StyledListItem>
            </StyledList>
        </StyledNav>
    );
}

export default NavigationBar;
