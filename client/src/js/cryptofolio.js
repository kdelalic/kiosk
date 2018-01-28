import React, { Component } from 'react'

import '../css/content.css'
import Crypto from './_components/cryptofolio/crypto'

import Typography from 'material-ui/Typography'

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