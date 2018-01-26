import React, { Component } from 'react'
import '../css/sideDrawer.css'
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';

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

    closeDrawer = () => {
        this.setState({
            ...this.state,
            drawerOpen: false
        })
    }

    render() {
        return (
            <Drawer className="sideDrawer" anchor="right" open={this.state.drawerOpen} onClose={this.closeDrawer}>
                <div>test</div>
            </Drawer>
        )
    }
}

export default SideDrawer