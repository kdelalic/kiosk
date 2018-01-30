import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import {firestore} from './firebase.js'

import {
    Link
} from 'react-router-dom'

// import {firestore} from './firebase.js'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    setBookmarks,
    addBookmark
} from './redux.js';

class Bookmarks extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    componentDidMount() {
        //get uids from somewhere
        const articleIDs = this.props.bookmarks

        var docRef = firestore.collection("articles")

        articleIDs.forEach(uid => {
            docRef.where("uid", "==", uid) 
        })

        docRef.get().then(articles => {
            articles.forEach(article => {
                console.log("Article: ", article.id)
            })
        })
    }

    render() {
        return (
            <div className="content">
                <Grid container spacing={24} className="headline">
                    <Grid item md={6}>
                        <Typography type="headline" component="h2" className="content-title">
                            Bookmarks
                        </Typography>
                    </Grid>

                    <Grid item md={6}>
                        <Link to={'/'}>
                            <Button raised color="secondary" style={{ float: 'right' }}>
                                Back
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
                <div className="feed">
                    {
                        this.state.bookmarks !== undefined && Object.keys(this.state.bookmarks).map((key) => {
                            return (
                                <Article key={key} id={key} articleData={this.state.bookmarks[key]}/>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    bookmarks: state.bookmarks
});

const mapDispatchToProps = dispatch => {
    return {
        setBookmarks: bindActionCreators(setBookmarks, dispatch),
        addBookmark: bindActionCreators(addBookmark, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Bookmarks);