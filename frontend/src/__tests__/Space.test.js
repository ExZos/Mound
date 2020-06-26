import React from 'react';
import { shallow, mount } from 'enzyme';
import axios from 'axios';
import { createBrowserHistory } from 'history';

import Space from '../components/Space';
import TestingUtilities from '../TestingUtilities';
import { endpoints as api } from '../endpoints';

const history = createBrowserHistory();
const tutils = new TestingUtilities();

describe('Space', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should render correctly with props but no session', () => {
    const props = {
      state: {
        space: {
          id: 1,
          name: 'space1',
          status: true
        }
      }
    };

    const component = shallow(<Space location={props} />);
    const user = component.find('NavItem.user');
    const space = component.find('NavItem.space');
    const close = component.find('NavItem.close');
    const spaceForm = component.find('form#getUserInSpaceByName');

    expect(component).toMatchSnapshot();
    expect(user).toHaveLength(0);
    expect(space).toHaveLength(1);
    expect(space.children().text()).toEqual('space1');
    expect(close).toHaveLength(1);
    expect(spaceForm).toHaveLength(1);
  });

  it('should render MessageSpace with props and session', () => {
    tutils.addUserSessionItem(2, 2, 2);

    const props = {
      state: {
        space: {
          id: 2,
          name: 'space2',
          status: true
        }
      }
    };

    const component = shallow(<Space location={props} />);
    const user = component.find('NavItem.user');
    const space = component.find('NavItem.space');
    const close = component.find('NavItem.close');
    const spaceForm = component.find('form#getUserInSpaceByName');
    const messageSpace = component.find('MessageSpace');

    expect(component).toMatchSnapshot();
    expect(user).toHaveLength(1);
    expect(user.children().text()).toEqual('user2');
    expect(space).toHaveLength(1);
    expect(space.children().text()).toEqual('space2');
    expect(close).toHaveLength(1);
    expect(spaceForm).toHaveLength(0);
    expect(messageSpace).toHaveLength(1);
  });

  it('should render PendingUser with props and session ', () => {
    tutils.addUserSessionItem(undefined, 3, 3);

    const props = {
      state: {
        space: {
          id: 3,
          name: 'space3',
          status: true
        }
      }
    };

    const component = shallow(<Space location={props} />);
    const user = component.find('NavItem.user');
    const space = component.find('NavItem.space');
    const close = component.find('NavItem.close');
    const spaceForm = component.find('form#getUserInSpaceByName');
    const pendingUser = component.find('PendingUser');

    expect(component).toMatchSnapshot();
    expect(user).toHaveLength(1);
    expect(user.children().text()).toEqual('userundefined');
    expect(space).toHaveLength(1);
    expect(space.children().text()).toEqual('space3');
    expect(close).toHaveLength(1);
    expect(spaceForm).toHaveLength(0);
    expect(pendingUser).toHaveLength(1);
  });

  it('should render PendingSpace with props and session', () => {
    tutils.addUserSessionItem(undefined, 3, 3, false);

    const props = {
      state: {
        space: {
          id: 3,
          name: 'space3',
          status: false
        }
      }
    };

    const component = shallow(<Space location={props} />);
    const user = component.find('NavItem.user');
    const space = component.find('NavItem.space');
    const close = component.find('NavItem.close');
    const spaceForm = component.find('form#getUserInSpaceByName');
    const pendingSpace = component.find('PendingSpace');

    expect(component).toMatchSnapshot();
    expect(user).toHaveLength(1);
    expect(user.children().text()).toEqual('userundefined');
    expect(space).toHaveLength(1);
    expect(space.children().text()).toEqual('space3');
    expect(close).toHaveLength(1);
    expect(spaceForm).toHaveLength(0);
    expect(pendingSpace).toHaveLength(1);
  });

  it('should create a state entry equal to the input value', () => {
    const props = {
      state: {
        space: {
          id: 1,
          name: 'space1',
          status: true
        }
      }
    };

    const component = shallow(<Space location={props} />);
    const input = component.find('input');

    input.props().onChange({
      target: {
        name: 'name',
        value: 'user1'
      }
    });

    expect(component.state('user')).toBeDefined();
    expect(component.state('user')).toHaveProperty('name', 'user1');
  });

  it('should create state and session entries on approved space submit', async () => {
    const props = {
      state: {
        space: {
          id: 1,
          name: 'space1',
          status: true
        }
      }
    };

    const component = shallow(<Space location={props} />);
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    component.setState({
      user: {
        name: 'user1'
      }
    });
    await button.props().onClick();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getUserInSpaceByName + '1/user1');
    expect(component.state('user')).toBeDefined();
    expect(component.state('user')).toHaveProperty('id', 1);
    expect(tutils.getSessionItem('users')).toBeDefined();
    expect(tutils.getSessionItem('users')[1]).toBeDefined();
  });

  it('should create state and session entries on pending space/user submit', async () => {
    const props = {
      state: {
        space: {
          id: 2,
          name: 'space2',
          status: true
        }
      }
    };

    const component = shallow(<Space location={props} />);
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    component.setState({
      user: {
        name: 'user2',
        space: 2
      }
    });
    await button.props().onClick();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getPendingJoinPollInSpaceByName + '2/user2');
    expect(component.state('user')).toBeDefined();
    expect(component.state('user')).not.toHaveProperty('id');
    expect(component.state('poll')).toBeDefined();
    expect(tutils.getSessionItem('users')).toBeDefined();
    expect(tutils.getSessionItem('users')[2]).toBeDefined();
    expect(tutils.getSessionItem('users')[2]).toHaveProperty('poll', 2);
  });

  it('should not create state or session entries on invalid submit and should trigger modal', async () => {
    const props = {
      state: {
        space: {
          id: 1,
          name: 'space1',
          status: true
        }
      }
    };

    const component = shallow(<Space location={props} />);
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    component.setState({
      user: {
        name: 'Missing User'
      }
    });
    await button.props().onClick();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getPendingJoinPollInSpaceByName + '1/Missing User');
    expect(component.state('user')).toBeDefined();
    expect(component.state('user')).not.toHaveProperty('id');
    expect(component.state('poll')).toBeUndefined();
    expect(tutils.getSessionItem('users')).toBeNull();
    expect(component.state('showModal')).toBeDefined();
    expect(component.state('showModal')).toBeTruthy();
  });

  it('should not create state or session entries nor trigger modal on empty submit', async () => {
    const props = {
      state: {
        space: {
          id: 1,
          name: 'space1',
          status: true
        }
      }
    };

    const component = shallow(<Space location={props} />);
    const button = component.find('button');
    const spy = jest.spyOn(axios, 'get');

    await button.props().onClick();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.getPendingJoinPollInSpaceByName + '1/');
    expect(component.state('user')).toBeDefined();
    expect(component.state('user')).not.toHaveProperty('id');
    expect(component.state('poll')).toBeUndefined();
    expect(tutils.getSessionItem('users')).toBeNull();
    expect(component.state('showModal')).toBeDefined();
    expect(component.state('showModal')).toBeFalsy();
  });

  it('should call post api on modal confirm', () => {
    const props = {
      state: {
        space: {
          id: 1,
          name: 'space1',
          status: true
        }
      }
    };

    const component = shallow(<Space location={props} />);
    const confirmDialog = component.find('ConfirmDialog');
    const spy = jest.spyOn(axios, 'post');

    component.setState({
      user: {
        name: 'user1',
        space: 1
      }
    });
    confirmDialog.props().confirm();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(api.createNameRelatedPoll, {
      space: 1,
      name: 'user1'
    });
  });
});
