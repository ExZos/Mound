import React from 'react';
import { shallow, mount, render } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import ConfirmDialog from '../components/ConfirmDialog';

const history = createBrowserHistory();

describe('ConfirmDialog', () => {
  it('should render correctly with props', () => {
    const component = shallow(<ConfirmDialog showModal={true}
      setShowDialog={jest.fn()} confirm={jest.fn()}
      mHeader='Some header' mBody='Some body'
    />);
    const dialogTitle = component.find('WithStyles(ForwardRef(DialogTitle))');
    const dialogContent = component.find('WithStyles(ForwardRef(DialogContent))');

    expect(component).toMatchSnapshot();
    expect(dialogTitle.childAt(0).text()).toEqual('Some header');
    expect(dialogContent.childAt(0).text()).toEqual('Some body');
  });

  it('should call cancel function prop on cancel click', () => {
    const mockCancel = jest.fn();
    const mockConfirm = jest.fn();

    const component = shallow(<ConfirmDialog showDialog={true}
      setShowDialog={mockCancel} confirm={mockConfirm}
      mHeader='Some header' mBody='Some body'
    />);
    const button = component.find('.modalCancel');

    button.props().onClick();

    expect(mockCancel).toHaveBeenCalled();
    expect(mockConfirm).not.toHaveBeenCalled();
  });

  it('should call confirm function prop on confirm click', () => {
    const mockCancel = jest.fn();
    const mockConfirm = jest.fn();

    const component = shallow(<ConfirmDialog showDialog={true}
      setShowDialog={mockCancel} confirm={mockConfirm}
      mHeader='Some header' mBody='Some body'
    />);
    const button = component.find('.modalConfirm');

    button.props().onClick();

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockCancel).toHaveBeenCalled();
  });

  it('should show the modal', () => {
    const component = shallow(<ConfirmDialog showDialog={true}
      setShowDialog={jest.fn()} confirm={jest.fn()}
      mHeader='Some header' mBody='Some body'
    />);

    expect(component.props()).toHaveProperty('open', true);
  });

  it('should hide the modal', () => {
    const component = shallow(<ConfirmDialog showDialog={false}
      setShowDialog={jest.fn()} confirm={jest.fn()}
      mHeader='Some header' mBody='Some body'
    />);

    expect(component.props()).toHaveProperty('open', false);
  });
});
