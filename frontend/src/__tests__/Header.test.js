import React from 'react';
import { shallow, mount, render } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import Header from '../components/Header';
import TestingUtilities from '../TestingUtilities';

const history = createBrowserHistory();
const tutils = new TestingUtilities();

describe('Header', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should render correctly without props nor session', () => {
    const component = shallow(<Header />);
    const tabs = component.find('span.spaceNavItem');

    expect(component).toMatchSnapshot();
    expect(tabs.length).toEqual(0);
  });

  it('should render tabs with session storage', () => {
    tutils.addUserSessionItem(1, 1);
    tutils.addUserSessionItem(2, 2);
    tutils.addUserSessionItem(3, 3);

    const component = shallow(<Header />);
    const tabs = component.find('span.spaceNavItem');

    expect(component).toMatchSnapshot();
    expect(tabs.length).toEqual(3);
  });

  it('should highlight a tab with props and session', () => {
    tutils.addUserSessionItem(1, 1);
    tutils.addUserSessionItem(2, 2);
    tutils.addUserSessionItem(3, 3);

    const component = shallow(<Header spaceID={2} />);
    const tab = component.find('Link.active');

    expect(tab.length).toEqual(1);
    expect(tab.children().text()).toEqual("space2");
  });

  it('should clear session on clear click', () => {
    tutils.addUserSessionItem(1, 1);
    tutils.addUserSessionItem(2, 2);
    tutils.addUserSessionItem(3, 3);

    const component = shallow(<Header />);
    const clear = component.find('Link.clearSesh');

    clear.props().onClick();

    expect(sessionStorage.getItem('users')).not.toBeDefined;
  });

  it('should ', () => {

  });
});
