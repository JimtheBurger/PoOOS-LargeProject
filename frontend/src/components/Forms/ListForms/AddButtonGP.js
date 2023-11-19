import { useState } from "react";
import { Modal, Button, Tab, Tabs } from "react-bootstrap";
import AddGameToList from "./AddGameToList";
import AddList from "./AddList";
import { BsPlusCircle } from "react-icons/bs";

export default function AddButtonGP({ appid }) {
  //Modal state (show/hide)
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  //Literal BS that allows form to reload options
  const [keyVal, setKeyVal] = useState(1);
  const handleSetKey = () => {
    setKeyVal(keyVal + 1);
  };

  return (
    <>
      <Button
        variant="accent"
        onClick={handleShow}
        style={{ marginTop: "10px" }}
      >
        Add to List
        <BsPlusCircle style={{ marginLeft: "10px", marginBottom: "3px" }} />
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        {/* Bootstrap modal with header and body*/}
        <Modal.Header closeButton>
          <Modal.Title>Add Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="AddGame" id="AddTabs" className="mb-3">
            <Tab eventKey="AddGame" title="Add Game to Lists">
              <AddGameToList
                appid={appid}
                keyVal={keyVal}
                handleSetKey={handleSetKey}
              />
            </Tab>
            <Tab eventKey="AddList" title="Create New List">
              <AddList keyVal={keyVal} handleSetKey={handleSetKey} />
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
}
