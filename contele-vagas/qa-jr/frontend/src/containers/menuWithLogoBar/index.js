import React from "react";
import { MainMenu } from "containers";
import { HeaderIconBar, ErrorBoundary } from "components";
import { useSelector } from "react-redux";
import { ContainerWrapper, ScrollableContainer } from "./style";
export default function MenuWithLogoBar({ children, history }) {
  const onMap = history.location.pathname === '/mapa';
  const name = "Teste"
  return (
    <>
      <ContainerWrapper>
        <MainMenu title={name} history={history} />
        <ScrollableContainer>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ScrollableContainer>
      </ContainerWrapper>
    </>
  );
} 
