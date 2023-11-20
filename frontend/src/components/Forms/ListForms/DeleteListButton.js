import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { BsXCircle } from "react-icons/bs";
import { connectAPI } from "../connectAPI";

export default function DeleteListButton({
  listId,
  ListName,
  setError,
  setSuccess,
}) {
  //Modal state (show/hide)
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  //remove function
  const handleRemove = async () => {
    const reply = await connectAPI({ ListId: listId }, "deleteLIst");
    if (reply.Error !== "") {
      setError(reply.Error);
    } else {
      setSuccess("List deleted successfully!");
      setTimeout(() => setSuccess(""), 2000);
      handleClose();
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
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to Delete {ListName} from your lists?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-accent" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="accent" onClick={handleRemove}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
