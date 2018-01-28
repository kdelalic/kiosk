import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'
import Typography from 'material-ui/Typography'

import {firestore} from './firebase.js'
import {connect} from 'react-redux';

class Bookmarks extends Component {
    constructor(props) {
        super(props)

        this.state = {
            bookmarks: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.user !== null){
            const docRef = firestore.collection("users").doc(nextProps.user.uid);

            docRef.get().then( doc => {
                if (doc.exists) {
                    this.setState({
                        ...this.state,
                        bookmarks: doc.data().bookmarks
                    })
                } else {
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });  
        }
      
    }

    render() {
        return (
            <div className="content">
                <Typography type="headline" component="h2" className="content-title">
                    Bookmarks
                </Typography>
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

export default connect(
    mapStateToProps
)(Bookmarks);