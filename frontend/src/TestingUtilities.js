import GeneralComponent from './components/GeneralComponent';

class TestingUtilities extends GeneralComponent {
  addUserSessionItem(userID, spaceID) {
    const user = {
      id: userID,
      name: 'name' + userID,
      space: spaceID,
      space_name: 'space' + spaceID,
      space_status: true
    };

    this.addToSessionArrayItem('users', user);
  }
}

export default TestingUtilities;
