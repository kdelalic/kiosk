import React, { Component } from 'react'
import '../css/app.css'

// Components
import Topbar from './topbar.js'
import Content from './content.js'
import Sidebar from './sidebar.js'
import Bookmarks from './bookmarks'
import CryptoFolio from './cryptofolio'

import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    IndexRoute,
    Redirect
} from 'react-router-dom'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Reboot from 'material-ui/Reboot'

const theme = createMuiTheme({
	palette: {
		primary: { main: "#000000" },
		secondary: { main: "#745fb5" },
	},
});

export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            source: "all",
            sidebar: true
        }
    }
    
    sortBySource = source => event =>{
        this.setState({
            ...this.state,
            source: source,
            bookmarksOpen: false
        })
        event.preventDefault()
    }

    toggleSidebar = () => {
        this.setState({
            ...this.state,
            sidebar: !this.state.sidebar
        })
    }

    render() {
        const { sidebar } = this.state;
        return (
            <div className="app">
                <MuiThemeProvider theme={theme}>
                    <Reboot />

                    <Topbar />
                    {sidebar && <Sidebar sortBySource={this.sortBySource}/>}

                    <Switch>
                        <Route path="/"
                            render={() =>
                                <Content
                                    source={this.state.source}
                                    toggleSidebar={this.toggleSidebar}
                                />
                            }
                            exact={true}
                        />

                        <Route path="/bookmarks" component={Bookmarks} exact={true} />

                        <Route path="/cryptofolio" component={CryptoFolio} exact={true} />
                    </Switch>
                </MuiThemeProvider>
            </div>
        )
    }
}