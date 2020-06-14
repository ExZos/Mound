import React from 'react';
import { shallow, mount, render } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import PendingUser from '../components/PendingUser';
import TestingUtilities from '../TestingUtilities';

const history = createBrowserHistory();
const tutils = new TestingUtilities();

describe('PendingUser', () => {
  beforeEach(() => {
    tutils.addUserSessionItem(1, 1, 1);
    tutils.addUserSessionItem(2, 2, 2);
    tutils.addUserSessionItem(3, 3, 3);
  });

  it('should render pending correctly with props and session', async () => {
    const component = await shallow(<PendingUser spaceID={1} updateState={jest.fn()} />);
    const statusStatement = component.find('div.statusStatement');
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(statusStatement.childAt(1).text()).toContain('pending');
    expect(progressStatement.childAt(1).text()).toEqual('5');
    expect(progressStatement.childAt(3).text()).toEqual('10');
    expect(resultingStatement.text()).toContain('not yet voted');
  });

  it('should render approved correctly with props and session', async () => {
    const component = await shallow(<PendingUser spaceID={2} updateState={jest.fn()} />);
    const statusStatement = component.find('div.statusStatement');
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(statusStatement.childAt(1).text()).toContain('pending');
    expect(progressStatement.childAt(1).text()).toEqual('3');
    expect(progressStatement.childAt(3).text()).toEqual('3');
    expect(resultingStatement.text()).toContain('approved');
  });

  it('should render rejected correctly with props and session', async () => {
    const component = await shallow(<PendingUser spaceID={3} updateState={jest.fn()} />);
    const statusStatement = component.find('div.statusStatement');
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(statusStatement.childAt(1).text()).toContain('rejected');
    expect(progressStatement.childAt(1).text()).toEqual('2');
    expect(progressStatement.childAt(3).text()).toEqual('7');
    expect(resultingStatement.text()).toContain('rejected');
  });

  it('', () => {

  });

  it('', () => {

  });
});
