import React, { useMemo } from "react";
import Checkbox from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Icon } from 'components';
import { ButtonMenu } from './style.js';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import './menuStyles.css';
import storage from 'redux-persist/lib/storage';

export default function MainMenu ({ columns = null, setColumnsSelected, setTotalLength = 0, nameTable = 'default' }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const columnsSort = useMemo(() => {
      const acc = [...columns]
      return acc.sort((a, b) => {
        if(a.label > b.label) return 1 
        if(a.label < b.label) return -1 
        return 0
      })
  },[columns])


  const handleChange = async (event) => {
    const name = event.target.getAttribute('name');
    const checked = event.target.checked;
    const numberActiveColumns = columns?.filter?.(column => column.active)?.length;
    if(numberActiveColumns <= 2 && !checked) return;
    const newColumns = columns.map(event => {
      if(event.label === name) {
        event.active = checked;
      }
      return event;
    })

    if(newColumns?.length) {
      const [totalLength] = [newColumns?.map(columns => {
        if(!columns.active) return;
        return columns
      }).length -1];
      setTotalLength(totalLength)
    }

    const tableSettings = await storage.getItem("@tablesSettings") || JSON.stringify({init: null});
    const tableSettingsParsed = JSON.parse(tableSettings);
    const columnsSettings = columns.reduce((acc, column, index) => {
      acc[column.key] = {
        index,
        status: column.active
      };
      return acc;
    }, {});
		if (nameTable === 'vehiclestatus'){
      columnsSettings.address = {
        index: columns.length,
        status: true,
      };
    } 
    const newTableSettings =  JSON.stringify({ ...tableSettingsParsed, [name]:columnsSettings })
    await storage.setItem("@tablesSettings", newTableSettings);

    setColumnsSelected(newColumns);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <ButtonMenu onClick={handleClick}>
        <Icon
          icon={'menu'}
          width={"14px"}
          height={"14px"}
          color={'#1D1B84'}
        />
      </ButtonMenu>
      <Menu
        id="main-menu-columns"
        anchorEl={anchorEl}
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
      >
        {columnsSort?.map?.((elem, index) => {
          if (!elem.key) return
          return (
            <MenuItem key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={elem.active}
                    onChange={handleChange}
                    name={elem.label}
                    className={elem.active ? 'active-label': 'inactive-label'}
                  />
                }
                label={elem.label}
                className={elem.active ? 'active-label': 'inactive-label'}
              />
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  );
}
