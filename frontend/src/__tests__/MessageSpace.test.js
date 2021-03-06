import React from 'react';
import { shallow, mount } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';
import styled from 'styled-components';
import 'jest-styled-components';

import MessageSpace from '../components/MessageSpace';
import TestingUtilities from '../TestingUtilities';
import { endpoints as api } from '../endpoints';

const history = createBrowserHistory();
const tutils = new TestingUtilities();

describe('MessageSpace', () => {
  it('should render CircularProgress while loading messages with props and session', () => {
    const user = {
      id: 1,
      name: 'user1',
      space: 1,
      space_name: 'space1'
    };

    const component = shallow(<MessageSpace user={user} updateState={jest.fn()} history={history} />);
    const messages = component.find('div.message');
    const circularProgresss = component.find('WithStyles(ForwardRef(CircularProgress))');

    expect(component).toMatchSnapshot();
    expect(messages).toHaveLength(0);
    expect(circularProgresss).toHaveLength(1);
  });

  it('should render no messages correctly with props and session', async () => {
    const user = {
      id: 1,
      name: 'user1',
      space: 1,
      space_name: 'space1'
    };

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<MessageSpace user={user} updateState={jest.fn()} history={history} />);
    const messages = component.find('div.message');
    const noMessages = component.find('div.noMessages');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getMessagesInSpace + 1);
    expect(messages).toHaveLength(0);
    expect(noMessages).toHaveLength(1);
  });

  it('should render messages correctly with props and session', async () => {
    const user = {
      id: 2,
      name: 'user2',
      space: 2,
      space_name: 'space2'
    };

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<MessageSpace user={user} updateState={jest.fn()} history={history} />);
    const messages = component.find('div.message');

    expect(component).toMatchSnapshot();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getMessagesInSpace + 2);
    expect(messages).toHaveLength(5);
  });

  it('should mark own messages correctly', async () => {
    const user = {
      id: 2,
      name: 'user2',
      space: 2,
      space_name: 'space2'
    };

    const spy = jest.spyOn(axios, 'get');
    const component = await shallow(<MessageSpace user={user} updateState={jest.fn()} history={history} />);
    const messages = component.find('div.message.own div.sender');

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getMessagesInSpace + 2);
    expect(messages).toHaveLength(2);
    expect(messages.at(0).text()).toEqual('You');
    expect(messages.at(1).text()).toEqual('You');
  });

  it('should create a state entry equal to the input value', async () => {
    const user = {
      id: 2,
      name: 'user2',
      space: 2,
      space_name: 'space2'
    };

    const component = await shallow(<MessageSpace user={user} updateState={jest.fn()} history={history} />);
    const textField = component.find('WithStyles(ForwardRef(TextField))');

    textField.props().onChange({
      target: {
        name: 'content',
        value: 'content1'
      }
    });

    expect(component.state('message')).toBeDefined();
    expect(component.state('message')).toHaveProperty('content', 'content1');
  });

  it('should call post api on message submit', async () => {
    const user = {
      id: 2,
      name: 'user2',
      space: 2,
      space_name: 'space2'
    };

    const component = await shallow(<MessageSpace user={user} updateState={jest.fn()} history={history} />);
    const textField = component.find('WithStyles(ForwardRef(TextField))');
    const spy = jest.spyOn(axios, 'post');
    const mockPreventDefault = jest.fn();

    component.setState({
      message: {
        id: 2,
        content: 'content1'
      }
    });
    textField.props().onKeyDown({
      keyCode: 13,
      shiftKey: false,
      preventDefault: mockPreventDefault
    });

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.messages, {
      id: 2,
      content: 'content1'
    });
  });

  // TODO: finish this
  it('should show message timestamp on message content click', async () => {
    // const component = await shallow(<MessageSpace spaceID={2} updateState={jest.fn()} history={history} />);
    // const messageContents = component.find('div.content');
    // const messageTimestamps = component.find('div.timestamp');

    // expect(messageTimestamps.at(0)).toHaveStyleRule('display', 'inherit');
  });
});
