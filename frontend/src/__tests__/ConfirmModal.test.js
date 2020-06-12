import React from 'react';
import { shallow, mount, render } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import ConfirmModal from '../components/ConfirmModal';

const history = createBrowserHistory();

describe('ConfirmModal', () => {
  it('should render correctly with props', () => {
    const component = shallow(<ConfirmModal
      showModal={true}
      toggleModal={jest.fn()}
      confirm={jest.fn()}
      mHeader="Some header"
      mBody="Some body"
    />);
    const modalHeader = component.find('ModalHeader');
    const modalBody = component.find('ModalBody');

    expect(component).toMatchSnapshot();
    expect(modalHeader.childAt(0).text()).toEqual('Some header');
    expect(modalBody.childAt(0).text()).toEqual('Some body');
  });

  it('should call cancel function prop on cancel click', () => {
    const mockCancel = jest.fn();
    const mockConfirm = jest.fn();

    const component = shallow(<ConfirmModal
      showModal={true}
      toggleModal={mockCancel}
      confirm={mockConfirm}
      mHeader="Some header"
      mBody="Some body"
    />);
    const button = component.find('Button.modalCancel');

    button.props().onClick();

    expect(mockCancel).toHaveBeenCalled();
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  it('should call confirm function prop on confirm click', () => {
    const mockCancel = jest.fn();
    const mockConfirm = jest.fn();

    const component = shallow(<ConfirmModal
      showModal={true}
      toggleModal={mockCancel}
      confirm={mockConfirm}
      mHeader="Some header"
      mBody="Some body"
    />);
    const button = component.find('Button.modalConfirm');

    button.props().onClick();

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockCancel).toHaveBeenCalled();
  });

  it('should show the modal', () => {
    const component = shallow(<ConfirmModal
      showModal={true}
      toggleModal={jest.fn()}
      confirm={jest.fn()}
      mHeader="Some header"
      mBody="Some body"
    />);

    expect(component.props().isOpen).toEqual(true);
  });

  it('should hide the modal', () => {
    const component = shallow(<ConfirmModal
      showModal={false}
      toggleModal={jest.fn()}
      confirm={jest.fn()}
      mHeader="Some header"
      mBody="Some body"
    />);

    expect(component.props().isOpen).toEqual(false);
  });
});
