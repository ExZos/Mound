import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import GeneralComponent from './GeneralComponent';
import '../styles/confirmModal.css';

class ConfirmModal extends GeneralComponent {
  confirm = () => {
    this.props.toggleModal();

    this.props.confirm();
  }

  render() {
    return (
      <Modal isOpen={this.props.showModal}>
        <ModalHeader>
          {this.props.mHeader}
        </ModalHeader>

        <ModalBody>
          {this.props.mBody}
        </ModalBody>

        <ModalFooter>
          <Button className="modalConfirm" color="primary" onClick={this.confirm}>Confirm</Button>
          <Button className="modalCancel" color="secondary" onClick={this.props.toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmModal;
