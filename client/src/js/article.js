import React, {Component} from 'react'
import '../css/article.css'

import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'

import ShareIcon from 'react-icons/lib/ti/arrow-forward'
import FacebookIcon from 'react-icons/lib/fa/facebook'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import LinkedinIcon from 'react-icons/lib/fa/linkedin'
// import SlackIcon from 'react-icons/lib/fa/slack'
import CloseIcon from 'react-icons/lib/md/close'
import BookmarkO from 'react-icons/lib/fa/bookmark-o'
import Bookmark from 'react-icons/lib/fa/bookmark'

import {firestore} from './firebase.js'

import {connect} from 'react-redux';
import {
    ShareButtons,
} from 'react-share';

const {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
} = ShareButtons;

class Article extends Component {

    constructor(props) {
        super(props)

        this.state = {
            shareOpen: false,
            bookmarked: false,
        }
    }

    componentWillMount() {
        this.setState({
            ...this.state,
            articleData: this.props.articleData
        })
    }

    openShare = event => {
        this.setState({
            ...this.state,
            shareOpen: true
        })
    }

    closeShare = event => {
        this.setState({
            ...this.state,
            shareOpen: false
        })
    }

    bookmark = event => {
        event.preventDefault()
        this.setState({
            ...this.state,
            bookmarked: true
        })
        firestore.collection("users").doc(this.props.user.uid).set({
            bookmarks: {
                [this.props.id]: this.state.articleData
            }
        }, { merge: true })

    }

    unbookmark = event => {
        event.preventDefault()
        this.setState({
            ...this.state,
            bookmarked: false
        })
        // firestore.collection("users").doc(this.props.user.uid).update({
        //     bookmarks: {
        //         [this.props.id]: firestore.FieldValue.delete()
        //     }
        // })
    }

    render() {
        const {articleData} = this.state
        return (
            <div className="card">
                <a className="cardLink" href={articleData.url} target="_blank" >
                    <img src={articleData.image ? articleData.image : ''} className="media" alt=""/>
                    <Typography type="headline" className="title post-title" component="h2">
                        {articleData.title}
                    </Typography>
                </a>
                <Divider />
                <div className="cardActions">
                    <div className="actionButtons">
                        {this.props.user === null ? <div/> : <IconButton className={"actionButton bookmark-button" + (this.state.bookmarked ? ' active' : '')} onClick={this.state.bookmarked ? this.unbookmark : this.bookmark} color="primary">
                            {this.state.bookmarked ? <Bookmark className="actionIcon bookmarkedIcon" /> : <BookmarkO className="actionIcon" />}
                        </IconButton>}
                        <IconButton onClick={this.state.shareOpen ? this.closeShare : this.openShare} color="primary">
                            {this.state.shareOpen ? <CloseIcon size={21} className="actionIcon"/> : <ShareIcon size={21} className="actionIcon"/>}
                        </IconButton>
                    </div>
                    <div className={this.state.shareOpen ? "shareButtons" : "shareButtons hideShare"}>
                        <FacebookShareButton url={articleData.url} quote={articleData.title}>
                            <IconButton className="shareFacebook">
                                <FacebookIcon/>
                            </IconButton>
                        </FacebookShareButton>
                        <TwitterShareButton url={articleData.url} quote={articleData.title}>
                            <IconButton className="shareTwitter">
                                <TwitterIcon/>
                            </IconButton>
                        </TwitterShareButton>
                        <LinkedinShareButton url={articleData.url} quote={articleData.title}>
                            <IconButton className="shareLinkedin"><LinkedinIcon/></IconButton>
                        </LinkedinShareButton>
                        {
                            // <TwitterShareButton url={articleData.url} quote={articleData.title}>
                            // <IconButton className="shareSlack"><SlackIcon/></IconButton>
                            // </TwitterShareButton>
                        }
                    </div>
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
)(Article);