import React from 'react';
import { shallow, mount, render } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import NamePoll from '../components/NamePoll';
import TestingUtilities from '../TestingUtilities';
import { endpoints as api } from '../endpoints';

const history = createBrowserHistory();
const tutils = new TestingUtilities();

describe('NamePoll', () => {
  it('should render name correctly with props', async () => {
    const spy = jest.spyOn(axios, 'get');

    const component = await shallow(<NamePoll spaceID={1} userID={1} />);
    const form = component.find('#addNamePoll');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(form).toHaveLength(1);
  });

  it('should render pending poll correctly with props', async () => {
    const spy = jest.spyOn(axios, 'get');

    const component = await shallow(<NamePoll spaceID={2} userID={2} />);
    const statusStatement = component.find('div.statusStatement');
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(statusStatement).toHaveLength(1);
    expect(statusStatement.childAt(1).text()).toContain('pending');
    expect(progressStatement).toHaveLength(1);
    expect(progressStatement.childAt(1).text()).toEqual('5');
    expect(progressStatement.childAt(3).text()).toEqual('10');
    expect(resultingStatement).toHaveLength(1);
    expect(resultingStatement.text()).toContain('not yet voted');
  });

  it('should render approved poll correctly with props', async () => {
    const spy = jest.spyOn(axios, 'get');

    const component = await shallow(<NamePoll spaceID={3} userID={3} />);
    const statusStatement = component.find('div.statusStatement');
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(statusStatement).toHaveLength(1);
    expect(statusStatement.childAt(1).text()).toContain('pending');
    expect(progressStatement).toHaveLength(1);
    expect(progressStatement.childAt(1).text()).toEqual('3');
    expect(progressStatement.childAt(3).text()).toEqual('3');
    expect(resultingStatement).toHaveLength(1);
    expect(resultingStatement.text()).toContain('approved');
  });

  it('should render rejected poll correctly with props', async () => {
    const spy = jest.spyOn(axios, 'get');

    const component = await shallow(<NamePoll spaceID={4} userID={4} />);
    const statusStatement = component.find('div.statusStatement');
    const progressStatement = component.find('div.progressStatement');
    const resultingStatement = component.find('div.resultingStatement');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(statusStatement).toHaveLength(1);
    expect(statusStatement.childAt(1).text()).toContain('rejected');
    expect(progressStatement).toHaveLength(1);
    expect(progressStatement.childAt(1).text()).toEqual('2');
    expect(progressStatement.childAt(3).text()).toEqual('7');
    expect(resultingStatement).toHaveLength(1);
    expect(resultingStatement.text()).toContain('rejected');
  });
});
