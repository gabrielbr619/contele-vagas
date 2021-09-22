import {
    ALL_DRIVERS_REPORT_LOAD_SUCCESS,
    ALL_DRIVERS_REPORT_CHANGE_OPERATION_STATES,
    ALL_DRIVERS_SET_NIGHT_LOADING,
    CHANGE_LOADING_OPERATION_STATES
} from './reducer';
import { formatRoutes } from 'utils/formatRoutesAllDrivers'
import axios from 'axios';
const api = axios.create({
    baseURL: "",
});
const MAX_LIMIT_FOR_SELECTORS = 10000

export function changeLoadingOperationStates({
    loadLoading = false,
    loadSuccess = false,
    loadFail = false,
}) {
    return {
        type: CHANGE_LOADING_OPERATION_STATES,
        payload: {
            loadLoading,
            loadSuccess,
            loadFail,
        }
    }
}


export function allDriversReportsChangeOperationStates({
    exportLoading = false,
    exportSuccess = false,
    exportFail = false,
}) {
    return {
        type: ALL_DRIVERS_REPORT_CHANGE_OPERATION_STATES,
        payload: {
            exportLoading,
            exportSuccess,
            exportFail,
        }
    };
}

export function allDriversReportsLoadSuccess({ allDrivers, total, }) {
    return {
        type: ALL_DRIVERS_REPORT_LOAD_SUCCESS,
        payload: {
            allDrivers,
            total,
        }
    };
}

export function setAllDriversNightLoading({
    nightLoading = false,
    nightLoadingSuccess = false,
    nightLoadingFail = false,
}) {
    return {
        type: ALL_DRIVERS_SET_NIGHT_LOADING,
        payload: {
            nightLoading,
            nightLoadingSuccess,
            nightLoadingFail,
        }
    }
}

const sortedData = ({
    routes
}) => {

    const all_drivers_sorted = routes.sort((a, b) => b.total_conduction - a.total_conduction);

    return {
        all_drivers_sorted
    }

}

const loadDrivers = async ({ 
    organization_id
}) => {
    try {

        const params = {
            organization_id,
            limit: MAX_LIMIT_FOR_SELECTORS
        }

        const URL = "/driver/v1/";

        const {
            data: { drivers }
        } = await api.get(URL, { params });


        const driver_ids = drivers
            .filter(driver => driver.status === 1)
            .map(driver => driver.id);

        return {
            driver_ids
        }
        
    } catch (error) {
        console.log(error);
        return {
            drivers_ids: [],
        }
    }
};

export const loadAllDriversReports = data => async dispatch => {
    dispatch(changeLoadingOperationStates({ loadLoading: true }));
    
    try {

        const URL_OLD_API = "/routes/v1/drivers";

        const { 
            inicial_night_period = "22:00",
            end_night_period = "06:00",
            organization_id,
            period: {
                start_date,
                end_date
            }
        } = data;

        const [
            {
                data: {
                    drivers,
                    routes,
                    total
                }
            },
            {
                driver_ids
            }
        ] = await Promise.all([
            api.get(URL_OLD_API, { 
                params: {
                    organization_id,
                    start_date,
                    end_date,
                    limit: '-1',
                    offset: 0,
                    group: "driver"
            } 
        }),
        loadDrivers({ organization_id }),
        ]);

       const driver_compiled_per_period = []

        const total_data = total + driver_compiled_per_period.length;
        
        const has_routes = Object.keys(routes).length > 0;
        const has_driver_compiled_per_period = Array.isArray(driver_compiled_per_period) && driver_compiled_per_period.length > 0;

        if(has_routes === false && has_driver_compiled_per_period === false) {
            dispatch(allDriversReportsLoadSuccess({ allDrivers: [], total: 0, dispatch }));
            dispatch(changeLoadingOperationStates({ loadSuccess: true }));
            return;
        }

        if(has_routes === false) {

            const {
                all_drivers_sorted
            } = sortedData({
                routes: driver_compiled_per_period,
            })
            
            dispatch(allDriversReportsLoadSuccess({ allDrivers: all_drivers_sorted, total: total_data ,dispatch }));
            dispatch(changeLoadingOperationStates({ loadSuccess: true }));
            return;
        }

        if(has_driver_compiled_per_period === false) {
            
            const {
                routes_formated
            } = formatRoutes({
                routes,
                inicial_night_period,
                end_night_period,
                driver_compiled_per_period: [],
                drivers
            });
    
            const {
                all_drivers_sorted
            } = sortedData({
                routes: routes_formated
            })

            dispatch(allDriversReportsLoadSuccess({ allDrivers: all_drivers_sorted, total: total_data ,dispatch }));
            dispatch(changeLoadingOperationStates({ loadSuccess: true }));
            return;
        }

        const {
            routes_formated
        } = formatRoutes({
            routes,
            inicial_night_period,
            end_night_period,
            driver_compiled_per_period,
            drivers
        });

        const {
            all_drivers_sorted
        } = sortedData({
            routes: routes_formated
        })
        
        dispatch(allDriversReportsLoadSuccess({ allDrivers: all_drivers_sorted, total: total_data, dispatch }));

        dispatch(changeLoadingOperationStates({ loadSuccess: true }));

    } catch (error) {

        console.log("error loading:", error);
        dispatch(changeLoadingOperationStates({ loadFail: true }));

    }
};