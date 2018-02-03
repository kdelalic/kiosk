import React, { Component } from 'react'
import '../css/sideDrawer.css'
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography'
import Avatar from 'material-ui/Avatar';
import Switch from 'material-ui/Switch';
import { withStyles } from 'material-ui/styles';
import { bindActionCreators } from 'redux';

import {
    toggleInvestmentProgress,
} from './redux.js';

const styles = {
    bar: {},
    checked: {
        color: "#745fb5",
        '& + $bar': {
            backgroundColor: "#745fb5",
        },
    },
};

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
        const { classes } = this.props;
        return (
            <Drawer className="drawer" anchor="right" open={this.state.drawerOpen} onClose={this.props.closeDrawer}>
                <div className="drawerBody">
                    {this.props.user === null ? <div></div> : 
                        <div>
                            <div className="userSettings">
                                <div className="userInfo">
                                    <Avatar alt="Avatar" src={this.props.user.photoURL}/>
                                    <Typography component="h3">{this.props.user.displayName}</Typography>
                                </div>
                                <Button className={this.props.user === null ? "loginButton hidden" : "loginButton"} raised color="secondary" onClick={this.props.handleLogout}>Logout</Button>
                            </div>
                            <Divider/>
                        </div>
                    }
                    <div className="preferences">
                        <div className="preference">
                            <Switch
                                color="secondary"
                                checked={this.props.topSitesVisible}
                                onChange={this.props.toggleTopSites}
                                aria-label="Top Sites Toggle"
                                classes={{
                                    checked: classes.checked,
                                    bar: classes.bar,
                                }}
                                />
                            <Typography component="h3" className="topSitesInfo">Recent Sites</Typography>
                        </div>
                        <div className="preference">
                            <Switch
                                color="secondary"
                                checked={this.props.investmentProgressVisible}
                                onChange={this.props.toggleInvestmentProgress}
                                aria-label="Top Sites Toggle"
                                classes={{
                                    checked: classes.checked,
                                    bar: classes.bar,
                                }}
                                />
                            <Typography component="h3" className="topSitesInfo">Investment Tracker</Typography>
                        </div>
                    </div>
                    <Divider/>
                </div>
            </Drawer>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    investmentProgressVisible: state.investmentProgressVisible
});

const mapDispatchToProps = dispatch => {
    return {
        toggleInvestmentProgress: bindActionCreators(toggleInvestmentProgress, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SideDrawer));