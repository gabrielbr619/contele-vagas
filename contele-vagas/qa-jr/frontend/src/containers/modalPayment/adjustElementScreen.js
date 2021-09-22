const adjustElementsScreen = () => {
  const width = window.outerWidth;
  const sizeScreen =
    (width < 1480 && "md") ||
    (width >= 1480 && width < 800 && "xl") ||
    (width >= 1800 && "xll") ||
    "md";
  const cssAdjusting = {
    md: {
      width: "590px",
    },
    xl: {
      width: "590px",
    },
    xll: {
      width: "590px",
    },
  };
  return cssAdjusting[sizeScreen];
};

export default adjustElementsScreen;
