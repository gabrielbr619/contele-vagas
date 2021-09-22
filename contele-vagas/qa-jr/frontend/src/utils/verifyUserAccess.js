import populateSelects from "constants/populateSelects";

import {
    DRIVERS_MANAGE_PATH,
    DRIVERS_CREATE_PATH,
    DRIVERS_EDIT_PATH,
} from "constants/paths";
export const [
    admin,
    manager,
    defaultUser,
    viewer,
    userWithPermissions
] = [1, 2, 3, 4, 5];
const userWithoutAccess = { access: false }
const userWithoutAccessScreens = { screens: [] }

const allDriversScreens = [
    DRIVERS_MANAGE_PATH,
    DRIVERS_CREATE_PATH,
    DRIVERS_EDIT_PATH,
];
const accessByType = {
    [admin]: [
        ...allDriversScreens,
    ],
    [manager]: [
        ...allDriversScreens,
    ],
    [defaultUser]: [
    ],
    [viewer]: [
    ],
    [userWithPermissions]: [
        DRIVERS_MANAGE_PATH,

        DRIVERS_EDIT_PATH,

    ]
}
export const verifyUserAccess = ({
    role_id,
    path
}) => {
    try {
        const roleIdExists = accessByType?.[role_id]?.length;

        if (!roleIdExists || !path) return userWithoutAccess;

        const userHasAccess = accessByType[role_id].some(allowedPath => path.toLowerCase().match(allowedPath.toLowerCase()));

        return {
            access: userHasAccess,
        }
    } catch (error) {
        console.log(error);
        return userWithoutAccess;
    }
}
export const getUsersScreens = ({
    role_id,
}) => {
    const roleIdExists = accessByType?.[role_id]?.length;

    if (!roleIdExists) return userWithoutAccessScreens;

    return {
        screens: accessByType[role_id],
    }
}
export const getUserRole = ({
    role_id,
}) => {
    const [role] = populateSelects.type.filter(role => role.value === role_id)

    if (!role) return false;

    return {
        role: role?.label
    }
}
