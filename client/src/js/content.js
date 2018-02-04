import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'
import Progress from './_components/cryptofolio/progress.js'

import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import { CircularProgress } from 'material-ui/Progress'

import Input, { InputLabel } from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Select from 'material-ui/Select'

import axios from 'axios'
// import { firestore } from './firebase.js'
import {connect} from 'react-redux';

import {
    Link
} from 'react-router-dom'

class Content extends Component {

    constructor(props) {
        super(props)

        this.state = {
            source: "content",
            populating: false,
            page: 1,
            articles: {},
            ogArticles: {},
            languages: {
                en: 'English',
                fr: 'French',
                de: 'German',
                es: 'Spanish',
                ru: 'Russian'
            },
            activeLanguage: 'en',
            languageChanged: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.source !== this.state.source) {
            this.setState({
                ...this.state,
                source: nextProps.source,
                page: 0,
                articles: null
            }, () => {
                window.scrollTo(0, 0)
                this._populate(this.state.source)
            })
        }
    }

    componentWillMount() {
        window.scrollTo(0, 0)
        this._populate(this.state.source);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll = () => {
        if(!this.state.populating){
            const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            const body = document.body;
            const html = document.documentElement;
            const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            const windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom + docHeight * .25 >= docHeight) {
                this.setState({
                    page: this.state.page + 1
                }, () => {
                    this._populate(this.state.source);
                })
            }
        }
    }

    _populate = source => {
        this.setState({
            ...this.state,
            populating: true
        }, () => {
            // const {articles} = this.state;
            // const collection = firestore.collection("articles")
            // let startAt = null;

            if (source === "content") {
                console.log("POPULATING with", source)
                const url = "/api/content/?page=" + this.state.page
                axios.get(url)
                    .then(response => {
                        this.setState({
                            ...this.state,
                            page: this.state.page + 1,
                            populating: false,
                            articles: {
                                ...this.state.articles,
                                ...response.data
                            },
                            ogArticles: {
                                ...this.state.ogArticles,
                                ...response.data
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err)
                    });
                // if (articles) {
                //     const articleKeys = Object.keys(articles);
                //     if (articleKeys.length > 0) {
                //         startAt = articles[articleKeys[articleKeys.length - 1]]['date-a']
                //     }
                // }
                // collection
                //     .limit(20)
                //     .orderBy("date-a")
                //     .startAt(startAt)
                //     .get()
                //     .then(articlesResponse => {
                //         const articlesData = {}
                //         articlesResponse.forEach(doc => {
                //             articlesData[doc.id] = doc.data()
                //         })

                //         this.setState({
                //             ...this.state,
                //             articles: {
                //                 ...this.state.articles,
                //                 ...articlesData
                //             }
                //         });
                //     })
            } else {
                console.log("POPULATING with", source + " (" + this.props.sources[this.state.source].name + ")")
                // const url = "/api/" + source + "/?page=" + this.state.page
                const url = "/api/" + source + "/?page=" + this.state.page
                axios.get(url)
                    .then(response => {
                        this.setState({
                            ...this.state,
                            page: this.state.page + 1,
                            populating: false,
                            articles: Object.assign({
                                ...this.state.articles,
                                ...response.data
                            }, {}),
                            ogArticles: Object.assign({
                                ...this.state.ogArticles,
                                ...response.data
                            }, {})
                        });
                    })
                    .catch(err => {
                        console.log(err)
                    });
                // if (articles) {
                //     const articleKeys = Object.keys(articles);
                //     if (articleKeys.length > 0) {
                //         startAt = articles[articleKeys[articleKeys.length - 1]]['date-a']
                //     }
                // }
                // collection
                //     .where("site", "==", source)
                //     .limit(20)
                //     .orderBy("date-a")
                //     .startAt(startAt)
                //     .get()
                //     .then(articlesResponse => {
                //         const articlesData = {}
                //         articlesResponse.forEach(doc => {
                //             articlesData[doc.id] = doc.data()
                //         })

                //         this.setState({
                //             ...this.state,
                //             articles: {
                //                 ...this.state.articles,
                //                 ...articlesData
                //             }
                //         });
                //     })
            }
        })
    }

    passCoins = coins => {
        this.setState({
            ...this.state,
            coins: coins
        })
    }

    passConvertCurrency = convertCurrency => {
        this.setState({
            ...this.state,
            convertCurrency: convertCurrency
        })
    }

    passCAD = CAD => {
        this.setState({
            ...this.state,
            CAD: CAD
        })
    }

    _handleLanguageChange = (value) => {
        this.setState({
            ...this.state,
            activeLanguage: value.target.value,
            articles: (value.target.value === 'en') ? this.state.ogArticles : this.state.articles
        })

        if (value.target.value === 'en') {
            return true
        }

        const headlines = [];
        Object.keys(this.state.ogArticles).map(articleKey => {
            headlines.push(this.state.ogArticles[articleKey].title)
        })

        axios.get('/api/translate', {
            params: {
                to: value.target.value,
                text: headlines.join('   --***--   ')
            }
        })
            .then(response => {
                const results = response.data.results;
                const articlesToUpdate = {};
                
                Object.keys(this.state.articles).map((articleKey, index) => {
                    articlesToUpdate[articleKey] = {
                        ...this.state.ogArticles[articleKey],
                        title: results[index]
                    }
                })

                this.setState({
                    ...this.state,
                    articles: Object.assign({}, articlesToUpdate),
                    languageChanged: true
                });
            })
            .catch(err => {
                console.log(err)
            });
    }

    render() {
        return (
            <div className="content">
                    {this.props.user ?
                        <Grid container spacing={24} className="headline">
                            <Grid item md>
                                <Typography type="headline" component="h2" className="content-title">
                                    {this.state.source === "content" ? "Latest News" : this.props.sources[this.state.source].name}
                                </Typography>
                            </Grid>
                            {this.props.investmentProgressVisible ? 
                                this.props.coinsLoaded ? 
                                <Grid item md={6} style={{margin: "auto", padding: "0", width: "100%"}} className="cryptoProgress">
                                    <Progress minimal convertCurrency={this.state.convertCurrency} CAD={this.state.CAD} />
                                </Grid> :
                                <CircularProgress color="secondary" />
                                 :
                                <div />
                            }
                            <Grid item md>
                                <Link to={'/cryptofolio'}>
                                    <Button raised color="secondary" style={{ float: 'right' }}>
                                        Cryptofolio
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid> :
                        <Grid container spacing={24} className="headline">
                            <Grid item md>
                                <Typography type="headline" component="h2" className="content-title">
                                    {this.state.source === "content" ? "Latest News" : this.props.sources[this.state.source].name}
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                

                <Select
                    value={this.state.activeLanguage}
                    onChange={this._handleLanguageChange}
                >
                    <MenuItem value={'en'}>English</MenuItem>
                    <MenuItem value={'fr'}>French</MenuItem>
                    <MenuItem value={'de'}>German</MenuItem>
                    <MenuItem value={'es'}>Spanish</MenuItem>
                    <MenuItem value={'ru'}>Russian</MenuItem>
                </Select>

                <div className="feed">
                    {this.state.articles ? Object.keys(this.state.articles).map((key) => {
                        // console.log(this.state.articles[key].title)
                        return (
                            <Article className="newsComp" key={key} id={key} articleData={this.state.languageChanged ? Object.assign({}, this.state.articles[key]) : this.state.articles[key]}/>
                        )
                    }):
                    <CircularProgress color="secondary" />
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    sources: state.sources,
    user: state.user,
    investmentProgressVisible: state.investmentProgressVisible,
    coins: state.coins,
    coinsLoaded: state.coinsLoaded
});

export default connect(
    mapStateToProps,
)(Content);