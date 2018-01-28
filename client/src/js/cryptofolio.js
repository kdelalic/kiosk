import React, { Component } from 'react'

import '../css/content.css'
import Article from './article.js'
import Crypto from './_components/cryptofolio/crypto'

import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

import axios from 'axios'

export default class CryptoFolio extends Component {
    constructor(props) {
        super(props)

        this.state = {
            convertCurrency: 'USD'
        };
    }

    render() {
        return (
            <div className="content">
                <Typography type="headline" component="h2" className="content-title">
                    CryptoFolio
                </Typography>

                <Crypto convertCurrency={this.state.convertCurrency} />
            </div>
        )
    }
}