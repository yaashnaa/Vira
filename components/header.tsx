import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import { lightTheme } from "@/config/theme";

interface HeaderProps {
    title: string;
  }
  

const HeaderContainer = styled.View`
  position: relative;
  width: 200px;
  align-self: center;
  border: 2px solid #222;
  padding: 5px 11px 3px 11px;
  margin: auto;
`;

const HeaderText = styled.Text`
  font-size: 32px;
  /* font-weight: 700; */
  text-transform: uppercase;
  text-align: center;
`;

const Circle = styled.View`
  position: absolute;
  background-color: #adb5d3;
  height: 10px;
  width: 10px;
  border-radius: 3.5px; /* half of 7px for a perfect circle */
  bottom: 15px;
`;

const LeftCircle = styled(Circle)`
  left: -20px;
`;

const RightCircle = styled(Circle)`
  right: -20px;
`;


const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <HeaderContainer>
      <HeaderText>{title} </HeaderText>
      <LeftCircle />
      <RightCircle />
    </HeaderContainer>
  );
};

export default Header;
