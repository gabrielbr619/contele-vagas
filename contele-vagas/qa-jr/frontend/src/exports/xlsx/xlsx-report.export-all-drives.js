import { formatTimeToCard } from "helpers/ReportCardsCalc";
import { convert } from "helpers/IntlService";
import { format } from "date-fns";
import api from 'axios'
import { localizedStrings } from 'constants/localizedStrings';
import { convertUserMaskToDateFns } from 'utils/convert';
import { formatRoutes } from 'utils/formatRoutesAllDrivers'
const reportTranslateStrings = localizedStrings.reportsExport;

export default function ExportXLSX ({
    organizationId,
    setStatusSuccessXLSX,
    setDocXlsx,
    filters,
    user_settings
}) {
    const MAX_LIMIT_FOR_SELECTORS = 10000
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
            } = await api.get(URL);
    
    
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


    const loadReports = async () => {
        try {
            const URL = "/routes/v1/drivers";
            const hasPeriod = !!filters.period.start_date && !!filters.period.end_date
            if (hasPeriod) {
                const params = {
                    group: 'driver',
                    organization_id: organizationId || '',
                    start_date: filters.period.start_date,
                    end_date: filters.period.end_date,
                    limit: '-1',
                    offset: 0
                };

                const { data: { drivers,routes, total } } = await api.get(URL);
                
                return {
					drivers,
                    routes,
                    total
                }
            }
        } catch (error) {
            console.log(error)
            return {
                routes: [],
                total: 0
            }
        }
    }

    const formatExpireDriverLicenseDate = ({
        expire_driver_license_date
    }) => {

        const has_expire_driver_license_date = !!expire_driver_license_date;

        if(has_expire_driver_license_date === false) return "";

        const [date,] = expire_driver_license_date.split("T");

        const date_formatted = `${date}T06:00:00.000Z`;

        return date_formatted;

    }

    const driversPerDayReportsLoadSuccess = ({ driversPerRoute, drivers, driver_compiled_per_period }) => {
        const {
            distance_unit,
            short_date_format
        } = user_settings;

        const valid_mask_date_fns = convertUserMaskToDateFns({ mask: short_date_format });

        const has_routes = Object.keys(driversPerRoute)?.length > 0;
        const has_new_routes = driver_compiled_per_period?.length > 0;

        const {
            inicial_night_period,
            end_night_period
        } = filters;

        const {
            routes_formated
        } = formatRoutes({
            routes: has_routes ? driversPerRoute : [],
            inicial_night_period,
            end_night_period,
            driver_compiled_per_period: has_new_routes ? driver_compiled_per_period : [],
            drivers: has_routes ? drivers : [],
        })

        return routes_formated.map(elem => {
            const {
                h: hoursConduction = "00", i: minutesConduction = "00"
              } = formatTimeToCard(elem.total_conduction_hours, 'obj');
            const total_conduction_hours = `${hoursConduction}:${minutesConduction}`;
            const {
                h: hoursDriving = "00", i: minutesDriving = "00"
              } = formatTimeToCard(elem.greater_continuous_driving_hour, 'obj');
            const greater_continuous_driving_hour = `${hoursDriving}:${minutesDriving}`;

            const cnh_expiration_date = formatExpireDriverLicenseDate({ expire_driver_license_date: elem?.expire_driver_license || elem?.driver_cnh_expiration })

            const has_cnh_expiration_date = !!cnh_expiration_date;

            return {
                [reportTranslateStrings.driver]: elem.driver_name,
                [reportTranslateStrings.CNH]: elem?.driver_license || elem.driver_cnh,
                [reportTranslateStrings.CNHExpirationDate]: !!has_cnh_expiration_date ? format(new Date(cnh_expiration_date), valid_mask_date_fns) : localizedStrings.reportsExport.expire_driver_license_not_found,
                [reportTranslateStrings.telephone]:elem.driver_phone,
                [reportTranslateStrings.totalCondutionTimeInHour]: total_conduction_hours,
                [reportTranslateStrings.longestCondutionTime]: greater_continuous_driving_hour,
                [`${reportTranslateStrings.total_distance} - ${distance_unit}`]: Number(convert(elem.total_distance, "m", distance_unit).toFixed(0)),
            }
        });

    }

    const lastProcess = async ({ driver_compiled_per_period, routes = [], drivers }) => {
        const data = driversPerDayReportsLoadSuccess({ driversPerRoute: routes, drivers, driver_compiled_per_period });
        setStatusSuccessXLSX({ success: true });
        setDocXlsx(data)
    };


    const init = async () => {
        const [
            {
                routes,
                drivers,
            },
            {
                driver_compiled_per_period
            }
        ] = await Promise.all([
            loadReports(),
        ]);
        
        await lastProcess({
            driver_compiled_per_period,
            routes,
            drivers,
        });
    };

    init();
}
