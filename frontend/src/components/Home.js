import React from 'react';
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';

import GeneralComponent from './GeneralComponent';
import Sidebar from './Sidebar';
import ConfirmDialog from './ConfirmDialog';
import '../styles/home.scss';

import { setSpace, setShowDialog } from '../store';
import { getSpaceByName, addSpace } from '../middleware';

const mapStateToProps = (state) => {
  return {
    loaded: state.root.loaded,
    error: state.root.error,
    space: state.root.space,
    showDialog: state.root.showDialog,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSpace: (space) => dispatch(setSpace(space)),
    setShowDialog: (show) => dispatch(setShowDialog(show)),
    getSpaceByName: (name) => dispatch(getSpaceByName(name)),
    addSpace: (space) => dispatch(addSpace(space)),
  };
};

class Home extends GeneralComponent {
  componentDidMount() {
    // TEMP
    console.log(this.getSessionItem('users'));
  }

  getSpaceByName = async () => {
    await this.props.getSpaceByName(this.props.space.name);
    this.push();
  }

  addSpace = async () => {
    await this.props.addSpace(this.props.space);
    this.push();
  }

  push = () => {
    if(!this.props.error) {
      this.props.history.push({
        pathname: '/s/',
        state: {
          space: this.props.space
        }
      });
    }
  }

  render() {
    return (
      <div id="home">
        <Sidebar />

        <br />

        <form id="getSpaceByName" onSubmit={this.handleFormSubmit}>
          <div className="textFieldWButton">
            <TextField name="name" label="Type a space name..." autoFocus
              size="small" variant="outlined"
              value={this.props.space.name}
              onChange={(e) => this.props.setSpace({ name: e.target.value })}
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
