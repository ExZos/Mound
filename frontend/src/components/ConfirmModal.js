import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

import GeneralComponent from './GeneralComponent';
import '../styles/confirmModal.css';

class ConfirmModal extends GeneralComponent {
  render() {
    return (
      <div>
        <Modal isOpen={this.props.showModal}>
          <ModalHeader>
            {this.props.mHeader}
          </ModalHeader>

          <ModalBody>
            {this.props.mBody}
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={this.props.confirm}>Confirm</Button>
            <Button color="secondary" onClick={this.props.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ConfirmModal;
