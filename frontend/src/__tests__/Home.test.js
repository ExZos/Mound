import React from 'react';
import { shallow, mount } from 'enzyme';
import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
import { createBrowserHistory } from 'history';

import Home from '../components/Home';

// var mockAdapter = new MockAdapter(axios);
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
          value: 'test'
        }
      });

    expect(component).toMatchSnapshot();
    expect(component.state('space')).toBeDefined();
    expect(component.state('space').name).toBeDefined();
    expect(component.state('space').name).toEqual('test');
  });

  it('should create a state entry on valid submit', () => {
    const component = shallow(<Home history={history} />);
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    // component.setState({
    //   space: {
    //     name: "Headon's Floor"
    //   }
    // });

    // mockAdapter.onGet(api.getSpaceByName + "Headon's Floor/").reply(200, {
    //   space: {
    //     id: 1,
    //     name: "Headon's Floor",
    //     status: true
    //   }
    // });
    button.props().onClick();

    console.log(component.state('space'));

    // expect(spy).toHaveBeenCalled();
    expect(component.state('space')).toBeDefined();
    console.log(component.state('space'));
    expect(component.state('space').id).toBeDefined();
  });
});
