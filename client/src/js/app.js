import React, { Component } from 'react'
import '../css/app.css'

// Components
import Topbar from './topbar.js'
import Content from './content.js'
import Sidebar from './sidebar.js'
import Bookmarks from './bookmarks'
import CryptoFolio from './cryptofolio'

import { base, firestore } from './firebase.js'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    setUser,
    setBookmarks
} from './redux.js';
import {
    Route,
    Switch
} from 'react-router-dom'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Reboot from 'material-ui/Reboot'

const theme = createMuiTheme({
	palette: {
		primary: { main: "#000000" },
		secondary: { main: "#745fb5" },
	},
});

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            source: "all",
            sidebar: true
        }

        this.firebase = base.initializedApp.firebase_;
    }

    componentWillMount() {
        this.firebase.auth().onAuthStateChanged( user => {
			if (user) {                
                firestore.collection("users").doc(user.uid)
                .get().then( doc => {
                    if (doc.exists) {
                        const bookmarks = []
                        Object.keys(doc.data().bookmarks).filter( key => {
                            return doc.data().bookmarks[key]
                        }).map(key => {
                            bookmarks.push(key)
                        })
                        this.props.setBookmarks(bookmarks)
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
                this.props.setUser(user)
			}
        });
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

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = dispatch => {
    return {
        setUser: bindActionCreators(setUser, dispatch),
        setBookmarks: bindActionCreators(setBookmarks, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);