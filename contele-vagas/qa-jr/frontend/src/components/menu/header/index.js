import React, { useMemo, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { DivMenuColumn, DivMenuRow } from "../style.js";
import {
  DivCircle,
  Circle,
} from "../item/style.js";
import { ImageMenuHeader, UsageAchievementMenuItem } from "./style.js";
import { Text, PercentageProgressBar } from "components";
export default function HeaderMenu({
  id,
  name= '',
  title = '',
  icon = "arrow-down",
  ...option
}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const menuIsOpen = true
  const currentScreen = 0

  const onItemClick = screenId => {
   
  };

  const isScreenSelectedAndMenuOpen = useMemo(
    () => menuIsOpen && currentScreen === id ,
    [menuIsOpen, currentScreen, id]
  );

  const isScreenSelectedAndMenuClosed = useMemo(
    () => !menuIsOpen && currentScreen === id,
    [menuIsOpen, currentScreen, id]
  );

  const achievement_score = 0
  const organization_id = 0



  useEffect(() => {
  }, []);

  return (
    <DivMenuColumn
      position={"relative"}
      height={"min-content"}
      padding="0px"
      width="100%"
    >
      <DivMenuRow
        background={"transparent"}
        position={"relative"}
        justifyContent="center"
        menuIsOpen={menuIsOpen}
      >
        <ImageMenuHeader
          style={
            !menuIsOpen
              ? {
                  padding: "2px",
                  maxWidth: "50px",
                }
              : {}
          }
          alt={""}
          src={
            menuIsOpen
              ? "https://images.contelege.com.br/contele-rastreador-horiz-transparente.png"
              : "https://images.contelege.com.br/icone-contele-rastreador-transparente.png"
          }
        />
      </DivMenuRow>
      <UsageAchievementMenuItem menuIsOpen={menuIsOpen} > 
        <PercentageProgressBar 
          barHeight={'10px'}
          backgroundBarColor={'#141470'}
          barColor={'#B3B1FF'}
          borderRadius={'50px'}
          text={menuIsOpen &&
            <div style={{ display: 'flex', marginTop: '7px'}}>
              <Text style={{
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize: '12px',
                lineHeight: '14px',
                color: '#E9E9FF',
              }}>
              {`${achievement_score?.toFixed?.(0) || 0}%`}
              </Text>
              &nbsp;
              <Text style={{
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '12px',
                lineHeight: '14px',
                color: '#E9E9FF',
              }}>
                {"de aproveitamento"}
              </Text>
            </div>
          }
          value={achievement_score}
        />
        {(isScreenSelectedAndMenuOpen || isScreenSelectedAndMenuClosed) &&
          <DivCircle>
            <Circle />
          </DivCircle>
        }
      </UsageAchievementMenuItem>
    </DivMenuColumn>
  );
}
