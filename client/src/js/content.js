import React, { Component } from 'react'
import '../css/content.css'
import Article from './article.js'
import Typography from 'material-ui/Typography';
import axios from 'axios'

class Content extends Component {

    constructor(props) {
        super(props)

        this.state = {
            source: "all"
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
        return (
            <div className="content">
                <div className="headline">
                    <Typography type="headline" component="h2" className="content-title">
                        {this.state.source === "all" ? "Latest News" : this.state.source}
                    </Typography>
                </div>
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