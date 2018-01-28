import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'

import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import axios from 'axios'

import {
    Link
} from 'react-router-dom'

class Content extends Component {

    constructor(props) {
        super(props)

        this.state = {
            source: "all",
            cryptofolio: false
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

    changeSort = source => {
        if(source === "all") {
            this.setState({
                ...this.state,
                articles: this.state.allArticles
            })
        } else {

        }
    }

    componentWillMount() {
        const url = "/api/content"
        axios.get(url)
			.then(response => {
				this.setState({
                    ...this.state,
                    allArticles: response.data
				}, () => {
                    this.changeSort(this.state.source)
                });
			})
			.catch(err => {
				console.log(err)
			});
    }

    render() {
        const { cryptofolio } = this.state;
        if (cryptofolio) return (
            <div className="content">
                <Typography type="headline" component="h2" className="content-title">
                    CryptoFolio
                </Typography>
            </div>
        )
        else return (
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
                            <Article className="newsComp" key={key} articleData={this.state.articles[key]}/>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Content;