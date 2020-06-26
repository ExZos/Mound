import React from 'react';
import { shallow, mount, render } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import PendingUser from '../components/PendingUser';
import TestingUtilities from '../TestingUtilities';
import { endpoints as api } from '../endpoints';

const history = createBrowserHistory();
const tutils = new TestingUtilities();

describe('PendingUser', () => {
  it('should render pending correctly with props and session', async () => {
    const mockUpdateState = jest.fn();
    const user = {
      name: 'user1',
      space: 1,
      space_name: 'space1',
      poll: 1
    };

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<PendingUser user={user} updateState={mockUpdateState} />)
    const statusStatement = component.find('div.statusStatement');
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getJoinPollResults + '1/user1');
    expect(statusStatement.childAt(1).text()).toContain('pending');
    expect(progressStatement.childAt(1).text()).toEqual('5');
    expect(progressStatement.childAt(3).text()).toEqual('10');
    expect(resultingStatement.text()).toContain('not yet voted');
    expect(mockUpdateState).not.toHaveBeenCalled();
  });

  it('should render approved correctly with props and session', async () => {
    const mockUpdateState = jest.fn();
    const user = {
      name: 'user2',
      space: 2,
      space_name: 'space2',
      poll: 2
    };

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<PendingUser user={user} updateState={mockUpdateState} />);
    const statusStatement = component.find('div.statusStatement');
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getJoinPollResults + '2/user2');
    expect(statusStatement.childAt(1).text()).toContain('pending');
    expect(progressStatement.childAt(1).text()).toEqual('3');
    expect(progressStatement.childAt(3).text()).toEqual('3');
    expect(resultingStatement.text()).toContain('approved');
    expect(mockUpdateState).toHaveBeenCalled();
  });

  it('should render rejected correctly with props and session', async () => {
    const mockUpdateState = jest.fn();
    const user = {
      name: 'user3',
      space: 3,
      space_name: 'space3',
      poll: 3
    };

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<PendingUser user={user} updateState={mockUpdateState} />)
    const statusStatement = component.find('div.statusStatement');
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getJoinPollResults + '3/user3');
    expect(statusStatement.childAt(1).text()).toContain('rejected');
    expect(progressStatement.childAt(1).text()).toEqual('2');
    expect(progressStatement.childAt(3).text()).toEqual('7');
    expect(resultingStatement.text()).toContain('rejected');
    expect(mockUpdateState).not.toHaveBeenCalled();
  });
});
