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
  beforeEach(() => {
    tutils.addUserSessionItem(1, 1);
    tutils.addUserSessionItem(2, 2);
    tutils.addUserSessionItem(3, 3);
  });

  it('should render approved correctly with props and session', async () => {
    const mockUpdateState = jest.fn();

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<PendingSpace spaceID={1} updateState={mockUpdateState} />);
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

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<PendingSpace spaceID={2} updateState={mockUpdateState} />);
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

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<PendingSpace spaceID={3} updateState={mockUpdateState} />);
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
