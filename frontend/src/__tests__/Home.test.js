import React from 'react';
import { shallow, mount } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import Home from '../components/Home';
import { endpoints as api } from '../endpoints';

const history = createBrowserHistory();

describe('Home', () => {
  it('should render correctly with no props', () => {
    const component = shallow(<Home />);

    expect(component).toMatchSnapshot();
  });

  it('should create a state entry equal to the input value', () => {
    const component = shallow(<Home />);
    const input = component.find('input');

    input.props().onChange({
      target: {
        name: 'name',
        value: 'space1'
      }
    });

    expect(component.state('space')).toBeDefined();
    expect(component.state('space')).toHaveProperty('name', 'space1');
  });

  it('should create a state entry on valid submit', async () => {
    const component = shallow(<Home history={history} />);
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    component.setState({
      space: {
        name: 'space1'
      }
    });
    await button.props().onClick();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getSpaceByName + 'space1/');
    expect(component.state('space')).toBeDefined();
    expect(component.state('space')).toHaveProperty('id');
  });

  it('should not create a state entry on invalid submit and should trigger modal', async () => {
    const component = shallow(<Home history={history} />);
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    component.setState({
      space: {
        name: 'Missing Space'
      }
    });
    await await button.props().onClick();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getSpaceByName + 'Missing Space/');
    expect(component.state('space')).toBeDefined();
    expect(component.state('space')).not.toHaveProperty('id');
    expect(component.state('showModal')).toBeDefined();
    expect(component.state('showModal')).toBeTruthy();
  });

  it('should not create a state entry nor trigger modal on empty submit', async () => {
    const component = shallow(<Home history={history} />);
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    component.setState({
      space: {
        name: ''
      }
    });
    await await button.props().onClick();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getSpaceByName + '/');
    expect(component.state('space')).toBeDefined();
    expect(component.state('space')).not.toHaveProperty('id');
    expect(component.state('showModal')).toBeDefined();
    expect(component.state('showModal')).toBeFalsy();
  });

  it('should call post api on modal confirm', () => {
    const component = shallow(<Home history={history} />);
    const confirmDialog = component.find('ConfirmDialog');
    const spy = jest.spyOn(axios, 'post');

    component.setState({
      space: {
        name: 'space1'
      }
    });
    confirmDialog.props().confirm();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.spaces, {
      name: 'space1'
    });
  });
});
