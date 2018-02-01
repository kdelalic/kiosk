import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'

import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import axios from 'axios'
import { firestore } from './firebase.js'

import {
    Link
} from 'react-router-dom'

class Content extends Component {

    constructor(props) {
        super(props)

        this.state = {
            source: "all",
            page: 1,
            articles: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.source !== this.state.source) {
            this.setState({
                ...this.state,
                source: nextProps.source,
                articles: null
            }, () => {
                this._populate(this.state.source)
            })
        }
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
            this.setState({
                page: this.state.page + 1
            }, () => {
                this._populate(this.state.source);
            })
        }
    }

    componentWillMount() {
        this._populate(this.state.source);
    }

    _populate = source => {
        const {articles} = this.state;
        const collection = firestore.collection("articles")
        let startAt = null;

        console.log("POPULATING")
        
        if (source === "all") {
            if (articles) {
                const articleKeys = Object.keys(articles);
                if (articleKeys.length > 0) {
                    startAt = articles[articleKeys[articleKeys.length - 1]]['date-a']
                }
            }
            collection
                .limit(20)
                .orderBy("date-a")
                .startAt(startAt)
                .get()
                .then(articlesResponse => {
                    const articlesData = {}
                    articlesResponse.forEach(doc => {
                        articlesData[doc.id] = doc.data()
                    })

                    this.setState({
                        ...this.state,
                        articles: {
                            ...this.state.articles,
                            ...articlesData
                        }
                    });
                })
        } else {
            if (articles) {
                const articleKeys = Object.keys(articles);
                if (articleKeys.length > 0) {
                    startAt = articles[articleKeys[articleKeys.length - 1]]['date-a']
                }
            }
            collection
                .where("site", "==", source)
                .limit(20)
                .orderBy("date-a")
                .startAt(startAt)
                .get()
                .then(articlesResponse => {
                    const articlesData = {}
                    articlesResponse.forEach(doc => {
                        articlesData[doc.id] = doc.data()
                    })

                    this.setState({
                        ...this.state,
                        articles: {
                            ...this.state.articles,
                            ...articlesData
                        }
                    });
                })
        }
    }

    changeSort = source => {
        
    }

    render() {
        return (
            <div className="content">
                <Grid container spacing={24} className="headline">
                    <Grid item md={6}>
                        <Typography type="headline" component="h2" className="content-title">
                            {this.state.source === "all" ? "Latest News" : this.state.source}
                        </Typography>
                    </Grid>

                    <Grid item md={6}>
                        <Link to={'/cryptofolio'}>
                            <Button raised color="secondary" style={{ float: 'right' }}>
                                Cryptofolio
                            </Button>
                        </Link>
                    </Grid>
                </Grid>

                <div className="feed">
                    {this.state.articles && Object.keys(this.state.articles).map((key) => {
                        return (
                            <Article className="newsComp" key={key} id={key} articleData={this.state.articles[key]}/>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Content;