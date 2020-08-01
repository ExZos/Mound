import React from 'react';
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';

import GeneralComponent from './GeneralComponent';
import Sidebar from './Sidebar';
import ConfirmDialog from './ConfirmDialog';
import '../styles/home.scss';

import { setShowDialog } from '../reducers/root';
import { setSpace, setSpaceName,
         getSpaceByName, addSpace } from '../reducers/space';

const mapStateToProps = (state) => {
  return {
    loaded: state.space.loaded,
    error: state.space.error,
    showDialog: state.root.showDialog,
    space: state.space.space,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setShowDialog: (show) => dispatch(setShowDialog(show)),
    setSpace: (space) => dispatch(setSpace(space)),
    setSpaceName: (name) => dispatch(setSpaceName(name)),
    getSpaceByName: (name) => dispatch(getSpaceByName(name)),
    addSpace: (space) => dispatch(addSpace(space)),
  };
};

class Home extends GeneralComponent {
  constructor(props) {
    super(props);

    this.props.setSpace({});
  }

  componentDidMount() {
    // TEMP
    console.log(this.getSessionItem('users'));
  }

  getSpaceByName = async () => {
    await this.props.getSpaceByName(this.props.space.name);

    if(!this.props.error) {
      this.push();
    }
    else if(this.props.space.name) {
      this.props.setShowDialog(true);
    }
  }

  addSpace = async () => {
    await this.props.addSpace(this.props.space);

    if(!this.props.error) {
      this.push();
    }
    else {
      // TODO: render error component
    }
  }

  push = () => {
    this.props.history.push({
      pathname: '/s/',
      state: {
        space: this.props.space
      }
    });
  }

  render() {
    // console.log(this.props.space);
    return (
      <div id="home">
        <Sidebar />

        <br />

        <form id="getSpaceByName" onSubmit={this.handleFormSubmit}>
          <div className="textFieldWButton">
            <TextField name="name" label="Type a space name..." autoFocus
              size="small" variant="outlined"
              value={this.props.space.name}
              onChange={(e) => this.props.setSpaceName(e.target.value)}
            />

            <Button type="submit" color="primary"
              size="small" variant="outlined"
              tabIndex="-1" onClick={this.getSpaceByName}>
                ENTER
            </Button>
          </div>
        </form>

        <ConfirmDialog showDialog={this.props.showDialog}
          setShowDialog={() => this.props.setShowDialog(!this.props.setShowDialog)} confirm={this.addSpace}
          mHeader={"Space '" + this.props.space.name + "' does not exist"}
          mBody="Do you want to request approval for this space?"
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
