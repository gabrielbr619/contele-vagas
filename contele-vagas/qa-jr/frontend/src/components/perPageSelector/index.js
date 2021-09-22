import React, { useState } from 'react';
import { PerPageSelectorDiv, PerPageSelectorWrapper } from './style';
import { Text, Icon } from '../../components'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
export default function PerPageSelector({ onClose, maxLengthOfList, styleDiv, ...options }) {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => setAnchorEl(event.currentTarget);

    const handleClose = (event, index) => {
        setAnchorEl(null);
        if (!event) return;
        onClose && onClose(index);
    };
    return (
        <PerPageSelectorWrapper {...styleDiv}>
            <PerPageSelectorDiv
                aria-controls="fences-lenght-control" aria-haspopup="true" onClick={handleClick}>
                <Text fontSize={"14px"} lineHeight={"19px"} style={{ alignItems: "center", display: "flex", }}>{maxLengthOfList}</Text>
                <div >
                    <Icon icon={'ASC'} width={'15px'}
                        height={'6px'} color={'#1A237A'}
                        cursor="pointer" />
                    <Icon icon={'DESC'} width={'15px'}
                        height={'6px'} color={'#1A237A'}
                        cursor="pointer" />
                </div>
            </PerPageSelectorDiv>
            <Menu
                id={"fences-lenght-control"}
                anchorEl={anchorEl}
                keepMounted
                onClick={() => handleClose(false)}
                open={Boolean(anchorEl)}  >
            </Menu>
        </PerPageSelectorWrapper>

    );
}
