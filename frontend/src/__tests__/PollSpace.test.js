import React from 'react';
import { shallow, mount, render } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import PollSpace from '../components/PollSpace';
import TestingUtilities from '../TestingUtilities';
import { endpoints as api } from '../endpoints';

const history = createBrowserHistory();
const tutils = new TestingUtilities();

describe('PollSpace', () => {
  it('should render no polls correctly with props', async () => {
    const component = await shallow(<PollSpace userID={1} />);
    const polls = component.find('div.poll');

    expect(component).toMatchSnapshot();
    expect(polls).toHaveLength(0);
  });

  it('should render poll correctly with props', async () => {
    const component = await shallow(<PollSpace userID={2} />);
    const polls = component.find('div.poll');

    expect(component).toMatchSnapshot();
    expect(polls).toHaveLength(3);
    expect(polls.at(0).text()).toContain('wants to join');
    expect(polls.at(1).text()).toContain('Name Poll');
    expect(polls.at(2).text()).toContain('Ban Poll');
  });

  it('should call post api on accept click with positive vote', async () => {
    const component = await shallow(<PollSpace userID={2} />);
    const button = component.find('Button.accept');
    const spyPost = jest.spyOn(axios, 'post');
    const spyGet = jest.spyOn(axios, 'get');

    button.at(0).props().onClick({
      target: {
        id: 2
      }
    });

    expect(spyPost).toHaveBeenCalled();
    expect(spyPost).toHaveBeenLastCalledWith(api.createVoteNUpdatePoll, {
      poll: 2,
      user: 2,
      result: true
    });
    expect(await spyGet).toHaveBeenCalled();
  });

  it('should call post api on decline click with negative vote', async () => {
    const component = await shallow(<PollSpace userID={2} />);
    const button = component.find('Button.decline');
    const spyPost = jest.spyOn(axios, 'post');
    const spyGet = jest.spyOn(axios, 'get');

    button.at(1).props().onClick({
      target: {
        id: 2
      }
    });

    expect(spyPost).toHaveBeenCalled();
    expect(spyPost).toHaveBeenLastCalledWith(api.createVoteNUpdatePoll, {
      poll: 2,
      user: 2,
      result: false
    });
    expect(await spyGet).toHaveBeenCalled();
  });
});
