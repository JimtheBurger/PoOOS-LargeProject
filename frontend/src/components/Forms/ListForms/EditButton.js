import { useState } from "react";
import { Modal, Button, Tab, Tabs } from "react-bootstrap";
import EditList from "./EditList";
import { BsPencilSquare } from "react-icons/bs";

export default function EditButton({ listInfo }) {
  //Modal state (show/hide)
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        variant="outline-accent"
        className="text-center align-text-bottom"
        onClick={handleShow}>
        <BsPencilSquare />
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg">
        {/* Bootstrap modal with header and body*/}
        <Modal.Header closeButton>
          <Modal.Title>Editing List: {listInfo.Name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="EditList" id="AddTabs" className="mb-3">
            <Tab eventKey="EditList" title="Edit List">
              <EditList listInfo={listInfo} />
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
}
