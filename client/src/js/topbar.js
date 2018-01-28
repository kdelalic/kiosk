import React, { Component } from 'react'
import { findDOMNode } from 'react-dom';
import '../css/topbar.css'
import SideDrawer from './sideDrawer.js'
import ChromeApps from './chromeApps.js'
import LoginModal from './loginModal.js'
import TopSites from './topSites.js'
import Logo from '../img/logo.png'
import AppsLogo from '../img/apps.svg'
import axios from 'axios'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton'
import Popover from 'material-ui/Popover'
import Avatar from 'material-ui/Avatar';
import SearchIcon from 'react-icons/lib/md/search';
import More from 'react-icons/lib/md/more-vert';
import { base } from './firebase.js'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    setUser
} from './redux.js';

class Topbar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            search: '',
            drawerOpen: false,
            appsOpen: false,
            anchorEl: null,
            loginOpen: false,
            topSitesVisible: true
        }
        this.firebase = base.initializedApp.firebase_;
    }

    componentWillMount() {
		this.firebase.auth().onAuthStateChanged( (user) => {
			if (user) {
                this.props.setUser(user)
				this.setState({
					...this.state,
					loading: false,
				})
			} else {
				this.setState({
					...this.state,
					loading: false
				})
			}
		});
	}

    componentDidMount(){
        // chrome.topSites.get(topSites => {
        //     var sites = topSites
        //     delete sites[8]
        //     delete sites[9]
        //     this.setState({
        //         ...this.state,
        //         sites: sites
        //     })
        // })
    }

    handleSearchText = event => {
        this.setState({
            ...this.state,
            search: event.target.value
        })
        event.preventDefault()
    }

    handleSearch = event => {
        window.location = "https://www.google.com/search?q=" + this.state.search
    }

    openDrawer = event => {
        event.preventDefault()

        this.setState({
            ...this.state,
            drawerOpen: true
        })
    }

    closeDrawer = () => {
        this.setState({
            ...this.state,
            drawerOpen: false
        })
    }

    openApps = event => {
        event.preventDefault()

        this.setState({
            ...this.state,
            appsOpen: true,
            anchorEl: findDOMNode(this.button),
        })
    }

    closeApps = event => {
        this.setState({
            ...this.state,
            appsOpen: false
        })
        event.preventDefault()
    }

    cleanURL = URL => {
        const splitURL = URL.split("/")
        const splitPeriods = splitURL[2].split(".")
        if(splitPeriods[0] === "www"){
            return splitURL[2].substring(splitURL[2].indexOf(".") + 1, splitURL[2].length)
        } else {
            return splitURL[2]
        }
    }

    toggleTopSites = (event, checked) => {
        this.setState({
            ...this.state,
            topSitesVisible: checked
        }, () => {
            console.log(this.state.topSitesVisible)
        })
        event.preventDefault()
    }

    getLogo = URL => {
        var output = null
        axios.get("https://logo.clearbit.com/" + this.cleanURL(URL))
            .then(response => {
                output = "https://logo.clearbit.com/" + URL
            })
            .catch(err => {
                axios.get("https://s2.googleusercontent.com/s2/favicons?domain=" + this.cleanURL(URL))
                    .then(response => {
                        output = "https://s2.googleusercontent.com/s2/favicons?domain=" + this.cleanURL(URL)
                    })
                    .catch(err2 => {
                        console.log(err2)
                    });
            })

        return output
    }

    openLogin = event => {
        this.setState({
            ...this.state,
            loginOpen: true
        })
    }

    closeLogin = event => {
        this.setState({
            ...this.state,
            loginOpen: false
        })
    }

    handleLogin = site => event => {
        var provider = null
        if (site === "facebook") {
            provider = new this.firebase.auth.FacebookAuthProvider();
        } else if (site === "google") {
            provider = new this.firebase.auth.GoogleAuthProvider();
        } else if (site === "twitter") {
            provider = new this.firebase.auth.TwitterAuthProvider();
        }

        this.firebase.auth().signInWithPopup(provider).then(result => {
            this.props.setUser(result.user)

            axios.get('/api/user', {
                    headers: {
                        refreshToken: this.props.user.refreshToken
                    }
                })
                .then(response => {
                    //console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
            this.closeLogin()
        })

        this.setState({ ...this.state,
            anchorEl: null
        });
        event.preventDefault();
    };

    handleLogout = () => {
        this.firebase.auth().signOut().then(() => {
            this.props.setUser(null)
            this.closeDrawer()
        }).catch(function (error) {
            console.log("LOGOUT ERROR" + error)
        });
    }

    render() {
        return (
            <AppBar position="fixed" className="appBar">
                <Toolbar>
                    <div className="left">
                        <a href="https://loving-morse-4f5653.netlify.com/">
                            <img src={Logo} alt="logo" />
                        </a>
                        {/* <form className="searchBar" onSubmit={this.handleSearch}>
                            <TextField
                                id="search"
                                label="Search"
                                className="searchField"
                                value={this.state.search}
                                onChange={this.handleSearchText}
                                margin="normal"
                            />
                            <SearchIcon className="searchIcon"/>
                        </form> */}
                    </div>
                    <div className="right">
                        <Button ref={node => {this.button = node}} onClick={this.openApps} className="appsLogo">
                            <img src={AppsLogo} alt="appsLogo" />
                        </Button>
                        <Popover
                            className="popover"
                            open={this.state.appsOpen}
                            anchorEl={this.state.anchorEl}
                            anchorReference={"anchorEl"}
                            onClose={this.closeApps}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            >
                            <div className="arrow-up"></div>
                            
                            <ChromeApps/>
                        </Popover>
                        {this.state.topSitesVisible ? <TopSites sites={this.state.sites} cleanURL={this.cleanURL}/> : <div></div>}
                        {this.props.user === null ?
                            <div>
                                <Button className="loginButton" raised color="secondary" onClick={this.openLogin}>Login</Button>
                                <LoginModal loginOpen={this.state.loginOpen} handleLogin={this.handleLogin} closeLogin={this.closeLogin} />
                                <IconButton className="moreButton" aria-label="Menu" onClick={this.openDrawer}>
                                    <More className="moreIcon"/>
                                </IconButton>
                            </div>
                            :
                            <IconButton className="moreButton" aria-label="Menu" onClick={this.openDrawer}>
                                <Avatar alt="Avatar" src={this.props.user.photoURL}/>
                            </IconButton>
                        }
                    </div>
                </Toolbar>
                <SideDrawer drawerOpen={this.state.drawerOpen} topSitesVisible={this.state.topSitesVisible} toggleTopSites={this.toggleTopSites} user={this.props.user} handleLogout={this.handleLogout} closeDrawer={this.closeDrawer}/>
            </AppBar>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = dispatch => {
    return {
        setUser: bindActionCreators(setUser, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Topbar);