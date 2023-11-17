import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { BsXCircle } from "react-icons/bs";
import { connectAPI } from "../connectAPI";

export default function RemoveButton({ appid, name, list, listId }) {
  //Modal state (show/hide)
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  //remove function
  const handleRemove = async () => {
    const reply = await connectAPI(
      { AppID: appid, ListId: listId },
      "removeGameFromList"
    );
    if (reply.Error !== "") {
      console.log(reply.Error);
    } else {
      window.location.reload(false);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        <BsXCircle />
      </Button>
      <Modal show={show} onHide={handleClose} size="md">
        {/* Bootstrap modal with header and body*/}
        <Modal.Header closeButton>
          <Modal.Title>Remove Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove {name} from {list}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-accent" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="accent" onClick={handleRemove}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
