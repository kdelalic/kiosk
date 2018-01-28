import React, { Component } from 'react'
import '../css/app.css'
import Topbar from './topbar.js'
import Content from './content.js'
import Sidebar from './sidebar.js'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';

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
            source: "all",
            bookmarksOpen: false
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

    toggleBookmarks = event => {
        event.preventDefault()

        const {bookmarksOpen} = this.state
        this.setState({
            ...this.state,
            bookmarksOpen: !bookmarksOpen
        })
    }

    render() {
        return (
            <div className="app">
                <MuiThemeProvider theme={theme}>
                    <Reboot />
                    <Topbar toggleBookmarks={this.toggleBookmarks}/>
                    <Sidebar sortBySource={this.sortBySource}/>
                    <Content source={this.state.source} bookmarksOpen={this.state.bookmarksOpen}/>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default App;