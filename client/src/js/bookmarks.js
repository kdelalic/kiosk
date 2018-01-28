import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'

import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import axios from 'axios'

export default class Bookmarks extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="content">
                <Typography type="headline" component="h2" className="content-title">
                    Bookmarks
                </Typography>
            </div>
        )
    }
}