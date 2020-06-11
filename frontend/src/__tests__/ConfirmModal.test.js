import React from 'react';
import { shallow, mount } from 'enzyme';
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

    expect(component).toMatchSnapshot();
  });
});
