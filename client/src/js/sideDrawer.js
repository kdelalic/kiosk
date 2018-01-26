import React, { Component } from 'react'
import '../css/sideDrawer.css'
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button'

class SideDrawer extends Component {

    constructor(props) {
        super(props)

        this.state = {
            drawerOpen: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.drawerOpen !== this.state.drawerOpen){
            this.setState({
                ...this.state,
                drawerOpen: nextProps.drawerOpen
            });
        }
    }

    render() {
        return (
            <Drawer className="drawer" anchor="right" open={this.state.drawerOpen} onClose={this.props.closeDrawer}>
                <div className="drawerBody">
                    <Button className="loginButton" raised color="secondary" onClick={this.props.handleLogout}>Logout</Button>
                </div>
            </Drawer>
        )
    }
}

export default SideDrawer