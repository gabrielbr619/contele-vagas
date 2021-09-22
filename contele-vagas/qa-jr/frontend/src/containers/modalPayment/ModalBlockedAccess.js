import React from "react";
import { Modal, Link } from "components";
import Divider from "@material-ui/core/Divider";
import adjustElementsScreen from "./adjustElementScreen";
import { localizedStrings } from "constants/localizedStrings";
import {
  ModalTitle,
  ModalContent,
  Bold,
  DivFullHeight,
  ModalFooter,
  ModalItem,
} from "./styles";

const ModalBlockedAccess = ({ handleClose, open, charge }) => {
  return (
    <Modal
      open={open}
      setOpen={handleClose}
      width={adjustElementsScreen()?.width}
      height={"auto"}
      top={"40%"}
      style={{ padding: "0", alignItems: "normal" }}
      header={
        <DivFullHeight>
          <ModalTitle color="red">
            {localizedStrings.modalBillet.blockedAccess.title}
          </ModalTitle>
          <Divider />
          <ModalContent height="25rem">
            <p
              dangerouslySetInnerHTML={{
                __html: localizedStrings.modalBillet.blockedAccess.text1,
              }}
            ></p>
            <Bold marginTop=".5rem">
              {localizedStrings.modalBillet.blockedAccess.text2}
            </Bold>
            <div>
              <ModalItem>
                <p
                  dangerouslySetInnerHTML={{
                    __html: localizedStrings.modalBillet.blockedAccess.item1,
                  }}
                ></p>
              </ModalItem>
              <ModalItem>
                <p
                  dangerouslySetInnerHTML={{
                    __html: localizedStrings.modalBillet.blockedAccess.item2,
                  }}
                ></p>
              </ModalItem>
              <ModalItem>
                <p
                  dangerouslySetInnerHTML={{
                    __html: localizedStrings.modalBillet.blockedAccess.item3,
                  }}
                ></p>
              </ModalItem>
              <ModalItem>
                <p
                  dangerouslySetInnerHTML={{
                    __html: localizedStrings.modalBillet.blockedAccess.item4,
                  }}
                ></p>
              </ModalItem>
            </div>
            <span>{localizedStrings.modalBillet.blockedAccess.text3}</span>
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
                  color: "white",
                }}
              >
                {localizedStrings.modalBillet.makePayment}
              </Link>
            )}
          </ModalFooter>
        </DivFullHeight>
      }
    />
  );
};

export default ModalBlockedAccess;
