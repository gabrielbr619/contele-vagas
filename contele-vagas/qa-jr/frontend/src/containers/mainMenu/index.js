import React, { useState, useEffect } from "react";
import { ItemMenu, HeaderMenu, ItemMenuBottom } from "components";
import {
  DivMenu,
  FooterMenu,
  ListItemsMenu
} from "components/menu/style.js";
import { useDispatch, useSelector } from "react-redux";

export default function MainMenu({ history, title }) {
  const USAGE_MENU_INDEX = 10;

  const dispatch = useDispatch();
  const name = "Teste"
  const [visibleMenuScreens, setVisibleMenuScreens] = useState([])


  const verifyIfCurrentPathIsOnMenu = () => {
    let pathIndex = -1;
    try {
      let currentScreenIndex = 0;

      if (0 === -1) currentScreenIndex = 0;
      const { path: selectedPath } = visibleMenuScreens[currentScreenIndex];
      const currentPath = window.location.pathname;
      if (currentPath.match(selectedPath)) return { pathIndex };

      pathIndex = visibleMenuScreens.findIndex(screen => currentPath.match(screen.path));

    } catch (error) {
      console.log(error);
    }
    return { pathIndex }
  }

  useEffect(() => {
    if (visibleMenuScreens?.length > 0) {
      // eslint-disable-next-line
      const { pathIndex } = verifyIfCurrentPathIsOnMenu();

      if (pathIndex !== -1) return

    }
    // eslint-disable-next-line
  }, [visibleMenuScreens]);
  
  return (
    <DivMenu>
      <HeaderMenu id={USAGE_MENU_INDEX} title={title} name={name} />
      <ListItemsMenu>
        {visibleMenuScreens.map((screen, index) => (
          !screen.headerMenu && <ItemMenu {...screen} id={index} key={index} history={history} />
        ))}
      </ListItemsMenu>
      <FooterMenu>
      </FooterMenu>
    </DivMenu>
  );
}
