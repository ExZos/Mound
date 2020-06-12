import React from 'react';
import { shallow, mount, render } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import Header from '../components/Header';

const history = createBrowserHistory();

describe('Header', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should render correctly without props nor session', () => {
    const component = shallow(<Header />);
  });

  it('should render tabs with session storage', () => {
    sessionStorage.setItem('test', 1);

    const component = shallow(<Header />);

    console.log(sessionStorage.getItem('test'));
  });

  it('should highlight a tab based on props', () => {
    const component = shallow(<Header spaceID="1" />);
  });
});
