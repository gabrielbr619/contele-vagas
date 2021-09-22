import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ModalBlockedAccess from "./ModalBlockedAccess";
import ModalBillet from "./ModalBillet";
import { differenceInBusinessDays } from "date-fns";
import { setBilletModalLastDateShown } from "store/modules";
import { isToday } from "date-fns";
import { api } from "services/api";

const BILLETS_STATUS_DAYS = {
  available: 5,
  expires_today: 0,
  expires_soon: 3,
  expired1: -1,
  expired5: -5,
};

const MODAL_BILLETS_TYPES = {
  available: "billetAvailableForPayment",
  expires_today: "billetWillWinToday",
  expires_soon: "billetCloseToDueDate",
  expired1: "billetExpired1",
  expired5: "billetExpired5",
};

const ModalPayment = () => {
  const [openModalBlockedAccess, setOpenModalBlockedAccess] = useState(false);
  const [openModalBillet, setOpenModalBillet] = useState(false);
  const [billetModalType, setBilletModalType] = useState("");
  const [charge, setCharge] = useState({});
  const { organization } = useSelector((state) => state.organization);
  const { billetModalLastDateShown } = useSelector((state) => state.general);
  const dispatch = useDispatch();

  const modalAlreadyShownToday = isToday(new Date(billetModalLastDateShown));

  const getCustomerOnVindiByIdentification = async () => {
    try {
      if (!organization?.identification) return
      const path = `/billing/v1/proxy?product=gv&method=get&path=/api/v1/customers?query=registry_code:${organization.identification}`;
      const { data: customersData } = await api.get(path);
      const {
        data: { customers },
      } = customersData;
      const [customer] = customers;
      return customer;
    } catch (error) {
      console.log(error, "error on get customer on vindi");
    }
  };

  const getLastChargeOnVindi = async (customer) => {
    try {
      if (!customer?.id) return
      const path = `/billing/v1/proxy?product=gv&method=get&path=/api/v1/charges/?query=customer_id:${customer.id}`;
      const { data: chargesData } = await api.get(path);
      const {
        data: { charges },
      } = chargesData;
      const lastCharge = charges
        .reverse()
        .find(
          (charge) =>
            charge.status === "pending" &&
            charge.payment_method.type === "PaymentMethod::BankSlip"
        );
      return lastCharge;
    } catch (error) {
      console.log(error, "error on get charges on vindi");
    }
  };

  const handleModalClose = () => {
    setOpenModalBlockedAccess(false);
    setOpenModalBillet(false);
    const today = new Date().toISOString();
    dispatch(setBilletModalLastDateShown(today));
  };

  const checkModalToShow = async () => {
    if (modalAlreadyShownToday) return;
    const customer = await getCustomerOnVindiByIdentification();
    const lastCharge = await getLastChargeOnVindi(customer);

    if (!lastCharge) return;
    setCharge(lastCharge);
    const { due_at: chargeDueAt } = lastCharge;
    const daysUntilDueDate = differenceInBusinessDays(
      new Date(chargeDueAt),
      new Date()
    );

    if (daysUntilDueDate < BILLETS_STATUS_DAYS.expires_today) {
      if (daysUntilDueDate === BILLETS_STATUS_DAYS.expired1) {
        setBilletModalType(MODAL_BILLETS_TYPES.expired1);
        setOpenModalBillet(true);
      } else if (daysUntilDueDate === BILLETS_STATUS_DAYS.expired5) {
        setBilletModalType(MODAL_BILLETS_TYPES.expired5);
        setOpenModalBillet(true);
      } else if (daysUntilDueDate < BILLETS_STATUS_DAYS.expired5) {
        setOpenModalBlockedAccess(true);
      }
    } else if (daysUntilDueDate === BILLETS_STATUS_DAYS.expires_soon) {
      setBilletModalType(MODAL_BILLETS_TYPES.expires_soon);
      setOpenModalBillet(true);
    } else if (daysUntilDueDate === BILLETS_STATUS_DAYS.expires_today) {
      setBilletModalType(MODAL_BILLETS_TYPES.expires_today);
      setOpenModalBillet(true);
    } else if (daysUntilDueDate === BILLETS_STATUS_DAYS.available) {
      setBilletModalType(MODAL_BILLETS_TYPES.available);
      setOpenModalBillet(true);
    }
  };

  useEffect(() => {
    checkModalToShow(setOpenModalBlockedAccess, setOpenModalBillet);
    // eslint-disable-next-line
  }, []);

  return (
    !modalAlreadyShownToday && (
      <>
        <ModalBlockedAccess
          open={openModalBlockedAccess}
          handleClose={handleModalClose}
          charge={charge}
        />
        <ModalBillet
          open={openModalBillet}
          handleClose={handleModalClose}
          modalType={billetModalType}
          charge={charge}
        />
      </>
    )
  );
};

export default ModalPayment;
