import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'

import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import axios from 'axios'
import { firestore } from './firebase.js'

import {firestore} from './firebase.js'

import {
    Link
} from 'react-router-dom'

class Content extends Component {

    constructor(props) {
        super(props)

        this.state = {
<<<<<<< HEAD
            source: "content",
            page: 1
=======
            source: "all",
            page: 1,
            allArticles: []
>>>>>>> 11e32086d684e7f0210f907a1dba9aeaf375a40c
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.source !== this.state.source) {
            this.setState({
                ...this.state,
                source: nextProps.source
            }, () => {
                this.changeSort(this.state.source)
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
<<<<<<< HEAD
                const url = "/api/" + this.state.source + "/?page=" + this.state.page
                axios.get(url)
                .then(response => {
                    this.setState({
                        ...this.state,
                        articles: {
                            ...this.state.articles,
                            ...response.data
                        }
                    });
                })
                .catch(err => {
                    console.log(err)
                });
=======
                this._populate();
>>>>>>> 11e32086d684e7f0210f907a1dba9aeaf375a40c
            })
        }
    }

    componentWillMount() {
<<<<<<< HEAD
        const url = "/api/content/?page=" + this.state.page
        axios.get(url)
        .then(response => {
            this.setState({
                ...this.state,
                articles: response.data
            });
        })
        .catch(err => {
            console.log(err)
        });
=======
        this._populate();
    }

    _populate = () => {
        const { allArticles } = this.state
        const collection = firestore.collection("articles")
        let startAt = null;

        console.log("POPULATING")        

        if (allArticles && allArticles.length > 0) {
            startAt = allArticles[allArticles.length - 1]['date-a']
        }
        collection
            .limit(20)
            .orderBy("date-a")
            .startAt(startAt)
            .get()
            .then(articles => {
                const articlesData = []
                articles.forEach(doc => {
                    articlesData.push(doc.data())
                })
                
                this.setState({
                    ...this.state,
                    allArticles: this.state.allArticles.concat(articlesData)
                }, () => {
                    this.changeSort(this.state.source)
                });
            })
>>>>>>> 11e32086d684e7f0210f907a1dba9aeaf375a40c
    }

    changeSort = source => {
        var articles = {}
        firestore.collection("articles")
        .where("site", "==", source)
        .get()
        .then( querySnapshot => {
            querySnapshot.forEach(article => {
                articles[article.id] = article.data()
            })
            this.setState({
                ...this.state,
                articles: articles,
                source: source,
                page: 1
            })
        })
        
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