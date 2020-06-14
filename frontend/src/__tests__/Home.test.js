import React from 'react';
import { shallow, mount } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import Home from '../components/Home';

const history = createBrowserHistory();

describe('Home', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Home />);
  });

  it('should render correctly with no props', () => {
    expect(component).toMatchSnapshot();
  });

  it('should create a state entry equal to the input value', () => {
    const input = component.find('input');

    input.props().onChange({
      target: {
        name: 'name',
        value: 'test'
      }
    });

    expect(component.state('space')).toBeDefined();
    expect(component.state('space')).toHaveProperty('name', 'test');
  });

  it('should create a state entry on valid submit', async () => {
    component.setProps({
      history: history
    });
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    component.setState({
      space: {
        name: "Headon's Floor"
      }
    });
    await button.props().onClick();

    expect(spy).toHaveBeenCalled();
    expect(component.state('space')).toBeDefined();
    expect(component.state('space')).toHaveProperty('id');
  });

  it('should not create a state entry on invalid submit and should trigger modal', async () => {
    component.setProps({
      history: history
    });
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    component.setState({
      space: {
        name: 'Missing Floor'
      }
    });
    await await button.props().onClick();

    expect(spy).toHaveBeenCalled();
    expect(component.state('space')).toBeDefined();
    expect(component.state('space')).not.toHaveProperty('id');
    expect(component.state('showModal')).toBeDefined();
    expect(component.state('showModal')).toBeTruthy();
  });

  it('should not create a state entry nor trigger modal on empty submit', async () => {
    component.setProps({
      history: history
    });
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    component.setState({
      space: {
        name: ''
      }
    });
    await button.props().onClick();

    expect(spy).toHaveBeenCalled();
    expect(component.state('space')).toBeDefined();
    expect(component.state('space')).not.toHaveProperty('id');
    expect(component.state('showModal')).toBeUndefined();
  });
});
