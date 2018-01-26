import React, { Component } from 'react'
import '../css/app.css'
import Topbar from './topbar.js'
import Content from './content.js'
import Sidebar from './sidebar.js'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';
import { connect } from 'react-redux';

import {
    setUser
} from './redux.js';

const theme = createMuiTheme({
	palette: {
		primary: { main: "#000000" },
		secondary: { main: "#745fb5" },
	},
});

export class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            source: "all"
        }
    }

    
    sortBySource = source => event =>{
        this.setState({
            ...this.state,
            source: source
        })
        event.preventDefault()
    }

    render() {
        return (
            <div className="app">
                <MuiThemeProvider theme={theme}>
                    <Reboot />
                    <Topbar />
                    <Sidebar sortBySource={this.sortBySource}/>
                    <Content source={this.state.source}/>
                </MuiThemeProvider>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    user: state.user,
});

const mapDispatchToProps = {
    setUser
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppContainer