import React, { Component } from 'react'
import '../css/article.css'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import ShareIcon from 'react-icons/lib/md/share'
import FacebookIcon from 'react-icons/lib/fa/facebook'
import TwitterIcon from 'react-icons/lib/fa/twitter'
import LinkedinIcon from 'react-icons/lib/fa/linkedin'
import SlackIcon from 'react-icons/lib/fa/slack'
import CloseIcon from 'react-icons/lib/md/close'
import BookmarkO from 'react-icons/lib/fa/bookmark-o'
import Bookmark from 'react-icons/lib/fa/bookmark'


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
        this.setState({
            ...this.state,
            bookmarked: true
        })
    }

    unbookmark = event => {
        this.setState({
            ...this.state,
            bookmarked: false
        })
    }

    render() {
        const {articleData} = this.state
        return (
            <div className="card">
                <a className="cardLink" href={articleData.url} target="_blank" >
                    <img src={articleData.image ? articleData.image : ''} className="media" alt=""/>
                    <Typography type="headline" className="title" component="h2">
                        {articleData.title}
                    </Typography>
                </a>
                <Divider />
                <div className="cardActions">
                    <div className="actionButtons">
                        <IconButton className="actionButton" onClick={this.state.bookmarked ? this.unbookmark : this.bookmark} color="primary">
                            {this.state.bookmarked ? <Bookmark className="actionIcon"/> : <BookmarkO className="actionIcon"/>}
                        </IconButton>
                        <IconButton onClick={this.state.shareOpen ? this.closeShare : this.openShare} color="primary">
                            {this.state.shareOpen ? <CloseIcon className="actionIcon"/> : <ShareIcon className="actionIcon"/>}
                        </IconButton>
                    </div>
                    <div className={this.state.shareOpen ? "shareButtons" : "shareButtons hideShare"}>
                        <IconButton className="shareFacebook"><FacebookIcon/></IconButton>
                        <IconButton className="shareTwitter"><TwitterIcon/></IconButton>
                        <IconButton className="shareLinkedin"><LinkedinIcon/></IconButton>
                        <IconButton className="shareSlack"><SlackIcon/></IconButton>
                    </div>
                </div>
            </div>
        )
    }
}

export default Article