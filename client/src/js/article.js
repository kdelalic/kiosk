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
import Bookmark from 'react-icons/lib/fa/bookmark'
import Trash from 'react-icons/lib/fa/trash'

import Smile from 'react-icons/lib/fa/smile-o'
import Meh from 'react-icons/lib/fa/meh-o'
import Frown from 'react-icons/lib/fa/frown-o'

import {firestore} from './firebase.js'
import firebase from 'firebase';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    setBookmarks,
    addBookmarkID,
    addBookmark,
    removeBookmarkID,
    removeBookmark
} from './redux.js';
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
            bookmarked: this.props.bookmarkIDs[this.props.id],
        }
    }

    componentDidMount() {
        if(this.props.articleData.score !== 5 && this.props.articleData.score !== undefined) {
            this.setState({
                ...this.state,
                sentiment: this.props.articleData.score
            })
        } else {
            this.setState({
                ...this.state,
                sentiment: Math.random()
            })
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
        firestore.collection("bookmarks").doc(this.props.user.uid).set({
            bookmarks: {
                [this.props.id] : true
            }
        }, {merge: true})
        this.props.addBookmarkID(this.props.id)
        this.props.addBookmark(this.props.id, this.state.articleData)
    }

    unbookmark = event => {
        event.preventDefault()
        this.setState({
            ...this.state,
            bookmarked: false
        })
        firestore.collection("bookmarks").doc(this.props.user.uid).update({
            ["bookmarks." + this.props.id]: firebase.firestore.FieldValue.delete()
        })
        this.props.removeBookmarkID(this.props.id)
        this.props.removeBookmark(this.props.id)
    }

    render() {
        const { articleData } = this.props

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
                        {this.props.user === null ? <div/> : <IconButton className={"actionButton bookmark-button" + (this.state.bookmarked ? ' bookmarked' : '')} onClick={this.state.bookmarked ? this.unbookmark : this.bookmark} color="primary">
                        {this.props.isBookmark && this.state.bookmarked ?  <Trash className={"actionIcon " + (this.state.bookmarked ? "bookmarkedIcon" : "")} /> : <Bookmark className={"actionIcon " + (this.state.bookmarked ? "bookmarkedIcon" : "")} />}
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
                    {this.state.sentiment < 0.33 ? <Frown className="sentiment" /> : this.state.sentiment > 0.34 && this.state.sentiment < 0.66 ? <Meh className="sentiment" /> : this.state.sentiment > 0.67 && this.state.sentiment <= 1 ? <Smile className="sentiment" /> : <div/>}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    bookmarkIDs: state.bookmarkIDs,
    bookmarks: state.bookmarks
});

const mapDispatchToProps = dispatch => {
    return {
        setBookmarks: bindActionCreators(setBookmarks, dispatch),
        addBookmarkID: bindActionCreators(addBookmarkID, dispatch),
        addBookmark: bindActionCreators(addBookmark, dispatch),
        removeBookmarkID: bindActionCreators(removeBookmarkID, dispatch),
        removeBookmark: bindActionCreators(removeBookmark, dispatch)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Article);