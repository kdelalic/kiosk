import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import {
    Link
} from 'react-router-dom'

import {firestore} from './firebase.js'
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

    componentWillMount() {
        const docRef = firestore.collection("users").doc(this.props.user.uid);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log(doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.user !== null){
            const docRef = firestore.collection("users").doc(nextProps.user.uid).collection("bookmarks")

            docRef.get().then(function(querySnapshot) {
                console.log(querySnapshot)
            });
        }
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