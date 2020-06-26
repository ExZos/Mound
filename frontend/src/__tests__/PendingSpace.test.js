import React from 'react';
import { shallow, mount, render } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import PendingSpace from '../components/PendingSpace';
import TestingUtilities from '../TestingUtilities';
import { endpoints as api } from '../endpoints';

const history = createBrowserHistory();
const tutils = new TestingUtilities();

describe('PendingSpace', () => {
  it('should render approved correctly with props and session', async () => {
    const mockUpdateState = jest.fn();
    const user = {
      id: 1,
      name: 'user1',
      space: 1,
      space_name: 'space1'
    };

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<PendingSpace user={user} updateState={mockUpdateState} />);
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getUserCountInSpaceForUser + '1/1');
    expect(progressStatement.childAt(1).text()).toEqual('3');
    expect(resultingStatement.text()).toContain('approved');
    expect(mockUpdateState).toHaveBeenCalled();
  });

  it('should render pending correctly with props and session', async () => {
    const mockUpdateState = jest.fn();
    const user = {
      id: 2,
      name: 'user2',
      space: 2,
      space_name: 'space2'
    };

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<PendingSpace user={user} updateState={mockUpdateState} />);
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getUserCountInSpaceForUser + '2/2');
    expect(progressStatement.childAt(1).text()).toEqual('1');
    expect(resultingStatement.text()).toContain('more users');
    expect(mockUpdateState).not.toHaveBeenCalled();
  });

  it('should render pending correctly with props and session', async () => {
    const mockUpdateState = jest.fn();
    const user = {
      id: 3,
      name: 'user3',
      space: 3,
      space_name: 'space3'
    };

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<PendingSpace user={user} updateState={mockUpdateState} />);
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getUserCountInSpaceForUser + '3/3');
    expect(progressStatement.childAt(1).text()).toEqual('2');
    expect(resultingStatement.text()).not.toContain('more users');
    expect(resultingStatement.text()).toContain('more user');
    expect(mockUpdateState).not.toHaveBeenCalled();
  });
});
