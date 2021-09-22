import React from "react";
import { Modal, Link } from "components";
import { useSelector } from "react-redux";
import Divider from "@material-ui/core/Divider";
import { localizedStrings } from "constants/localizedStrings";
import { format } from "date-fns";
import adjustElementsScreen from "./adjustElementScreen";
import { ModalTitle, ModalContent, Bold, DivFullHeight, ModalFooter } from "./styles";
import { FINANCIAL_WHATSAPP } from "../../constants/environment";

const ModalBlockedAccess = ({ handleClose, open, modalType, charge }) => {
  const { organization } = useSelector((state) => state.organization);
  
  return (
    modalType && (
      <Modal
        open={open}
        setOpen={handleClose}
        width={adjustElementsScreen()?.width}
        height={"auto"}
        top={"40%"}
        padding="0"
        alignItems="normal"
        header={
          <DivFullHeight>
            <ModalTitle>
              {localizedStrings.modalBillet[modalType].title}
            </ModalTitle>
            <Divider />
            <ModalContent>
              <span>
                {localizedStrings.hello} {organization.company_name || organization.trading_name},
              </span>
              <p
                dangerouslySetInnerHTML={{
                  __html: localizedStrings.modalBillet[modalType].text,
                }}
              ></p>
              <p>
                <Bold>{localizedStrings.email}: </Bold>
                <span>{charge?.customer?.email}</span>
              </p>
              <p>
                <Bold>{localizedStrings.modalBillet.dueDate}: </Bold>
                <span>{format(new Date(charge?.due_at), "dd/MM/yyyy")}</span>
              </p>
              <p>
                <span>
                  {localizedStrings.modalBillet.talkToUs}{" "}
                  <Link
                    href={`https://api.whatsapp.com/send?phone=${FINANCIAL_WHATSAPP}&text=Ol%C3%A1!`}
                  >
                    {localizedStrings.whatsapp}
                  </Link>{" "}
                  {localizedStrings.modalBillet.orInSystemChat}.
                </span>
              </p>
            </ModalContent>
            <Divider />
            <ModalFooter>
            {charge && (
              <Link
                target="_blank"
                padding={".6rem"}
                borderRadius={"2px"}
                color={"white"}
                backgroundColor={"#272588"}
                hover={{
                  color: "white"
                }}
              >{localizedStrings.modalBillet.makePayment}
              </Link>
            )}
            </ModalFooter>
          </DivFullHeight>
        }
      />
    )
  );
};

export default ModalBlockedAccess;
