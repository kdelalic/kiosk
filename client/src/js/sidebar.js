import React, { Component } from 'react'
import '../css/sidebar.css'
import Source from './source.js'
import Button from 'material-ui/Button'
import CoinDesk from '../img/coindesk.png'
import BitcoinNews from '../img/bitcoin.png'

class Sidebar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            defaultSource: {
                name: "All news",
                logo: CoinDesk,
                url: "https://www.coindesk.com/"
            },
            sources: {
                "source-1": {
                    name: "CoinDesk",
                    logo: CoinDesk,
                    url: "https://www.coindesk.com/"
                },
                "source-2": {
                    name: "Bitcoin News",
                    logo: BitcoinNews,
                    url: "https://news.bitcoin.com/"
                },
                "source-3": {
                    name: "test",
                    logo: BitcoinNews,
                    url: "https://news.bitcoin.com/"
                },
            }
        }
    }

    render() {
        return (
            <div className="sidebar">
                <Button onClick={this.props.sortBySource("all")} className="source">
                    <img className="sourceLogo" src={this.state.defaultSource.logo} alt={this.state.defaultSource.name}/>
                    <div className="sourceName">{this.state.defaultSource.name}</div>
                </Button>
                {this.state.sources && Object.keys(this.state.sources).map((key) => {
                    return (
                        <Source className="sourceComp" key={key} sortBySource={this.props.sortBySource} sourceData={this.state.sources[key]}/>
                    )
                })}
            </div>
        )
    }
}

export default Sidebar