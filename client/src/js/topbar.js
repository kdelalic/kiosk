import React, { Component } from 'react'
import { findDOMNode } from 'react-dom';
import '../css/topbar.css'
import SideDrawer from './sideDrawer.js'
import ChromeApps from './chromeApps.js'
import LoginModal from './loginModal.js'
import Logo from '../img/logo.png'
import AppsLogo from '../img/apps.svg'
import axios from 'axios'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip';
import Popover from 'material-ui/Popover'
import SearchIcon from 'react-icons/lib/md/search';
import More from 'react-icons/lib/md/more-vert';
import { base } from './firebase.js'

class Topbar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            search: '',
            drawerOpen: false,
            appsOpen: false,
            anchorEl: null,
            loginOpen: false,
            user: null
        }

        this.firebase = base.initializedApp.firebase_;
    }

    componentWillMount() {
		this.firebase.auth().onAuthStateChanged( (user) => {
			if (user) {
				this.setState({
					...this.state,
					user: user,
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
        this.setState({
            ...this.state,
            drawerOpen: true
        })
        event.preventDefault()
    }

    openApps = event => {
        this.setState({
            ...this.state,
            appsOpen: true,
            anchorEl: findDOMNode(this.button),
        })
        event.preventDefault()
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

    getLogo = URL => {
        var output = null
        axios.get("https://logo.clearbit.com/" + this.cleanURL(URL))
            .then(response => {
                 output =  "https://logo.clearbit.com/" + URL
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
		if(site === "facebook") {
			provider = new this.firebase.auth.FacebookAuthProvider();
		} else if (site === "google") {
			provider = new this.firebase.auth.GoogleAuthProvider();
		} else if (site === "twitter") {
			provider = new this.firebase.auth.TwitterAuthProvider();
        }

		this.firebase.auth().signInWithPopup(provider).then(result => {
			this.setState({
				...this.state,
				user: result.user
			}, () => {
                axios.post('/api/user', {
                    uid: this.state.user.uid
                  })
                  .then( response => {
                    console.log("post complete")
                    console.log(response);
                  })
                  .catch( error => {
                    console.log(error);
                });
                this.closeLogin()
            })
		});
		
		this.setState({ ...this.state, anchorEl: null });
		event.preventDefault();
    };
    
    handleLogout = () => {
		this.firebase.auth().signOut().then( () => {
			this.setState({
				user: null
			})
		  }).catch(function(error) {
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
                        <form className="searchBar" onSubmit={this.handleSearch}>
                            
                            <TextField
                                id="search"
                                label="Search"
                                className="searchField"
                                value={this.state.search}
                                onChange={this.handleSearchText}
                                margin="normal"
                            />
                            <SearchIcon className="searchIcon"/>
                        </form>
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
                        <div className="topSites">
                            { this.state.sites && this.state.sites.map((site) => {
                                    const src = "https://s2.googleusercontent.com/s2/favicons?domain=" + site.url
                                    // const src = "https://logo.clearbit.com/" + site.url
                                    return (
                                        <Tooltip id="tooltip-icon" className="spacing" title={this.cleanURL(site.url)}>
                                            <Button href={site.url} className="topSite">
                                                <img src={src} alt=""/>
                                            </Button>
                                        </Tooltip>
                                    )
                                })
                            }
                        </div>
                        <Button className="loginButton" raised color="secondary" onClick={this.openLogin}>Login</Button>
                        <LoginModal loginOpen={this.state.loginOpen} handleLogin={this.handleLogin}/>
                        <IconButton className="moreButton" aria-label="Menu" onClick={this.openDrawer}>
                            <More className="moreIcon"/>
                        </IconButton>
                    </div>
                </Toolbar>
                <SideDrawer drawerOpen={this.state.drawerOpen}/>
            </AppBar>
        )
    }
}

export default Topbar