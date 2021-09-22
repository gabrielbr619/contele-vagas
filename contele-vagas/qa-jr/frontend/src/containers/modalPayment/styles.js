import styled from "styled-components";

const ModalTitle = styled.p((props) => ({
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "black",
  padding: "1.5rem",
  ...props,
}));

const Bold = styled.span((props) => ({
  fontWeight: "bold",
  ...props,
}));

const ModalContent = styled.div((props) => ({
  margin: "1.2rem",
  fontSize: "1rem",
  height: "12rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  ...props,
}));

const DivFullHeight = styled.div((props) => ({
  height: "100%",
  ...props,
}));

const ModalFooter = styled.div((props) => ({
  display: "flex",
  justifyContent: "flex-end",
  margin: "1rem",
}));

const ModalItem = styled.div((props) => ({
  padding: "1rem",
  marginTop: "1rem",
  border: "1px solid #E5E5E5",
  borderRadius: "5px",
}));

export {
  ModalTitle,
  ModalContent,
  Bold,
  DivFullHeight,
  ModalFooter,
  ModalItem,
};
