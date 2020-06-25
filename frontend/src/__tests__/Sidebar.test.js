import React from 'react';
import { shallow, mount, render } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import Sidebar from '../components/Sidebar';
import TestingUtilities from '../TestingUtilities';

const history = createBrowserHistory();
const tutils = new TestingUtilities();

describe('Sidebar', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should render correctly without props nor session', () => {
    const component = shallow(<Sidebar />);
    const tabs = component.find('div.spaceNavItem');

    expect(component).toMatchSnapshot();
    expect(tabs).toHaveLength(0);
  });

  it('should render tabs with session storage', () => {
    tutils.addUserSessionItem(1, 1, undefined);
    tutils.addUserSessionItem(2, 2, undefined);
    tutils.addUserSessionItem(3, 3, undefined);

    const component = shallow(<Sidebar />);
    const tabs = component.find('div.spaceNavItem');

    expect(component).toMatchSnapshot();
    expect(tabs).toHaveLength(3);
    expect(tabs.at(0).text()).toEqual('space1');
    expect(tabs.at(1).text()).toEqual('space2');
    expect(tabs.at(2).text()).toEqual('space3');
  });

  it('should highlight a tab with props and session', () => {
    tutils.addUserSessionItem(1, 1, undefined);
    tutils.addUserSessionItem(2, 2, undefined);
    tutils.addUserSessionItem(3, 3, undefined);

    const component = shallow(<Sidebar spaceID={2} />);
    const tab = component.find('Link.active');

    expect(tab).toHaveLength(1);
    expect(tab.children().text()).toEqual('space2');
  });

  it('should clear session on clear click', () => {
    tutils.addUserSessionItem(1, 1, undefined);
    tutils.addUserSessionItem(2, 2, undefined);
    tutils.addUserSessionItem(3, 3, undefined);

    const component = shallow(<Sidebar />);
    const clear = component.find('div.menuItem.clear Link');

    clear.props().onClick();

    expect(sessionStorage.getItem('users')).toBeNull();
  });
});
