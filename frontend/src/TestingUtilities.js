import GeneralComponent from './components/GeneralComponent';

class TestingUtilities extends GeneralComponent {
  addUserSessionItem(userID, spaceID, pollID, status=true) {
    const user = {
      id: userID,
      name: 'user' + userID,
      space: spaceID,
      space_name: 'space' + spaceID,
      space_status: status,
      poll: pollID
    };

    this.addToSessionArrayItem('users', user);
  }
}

export default TestingUtilities;
