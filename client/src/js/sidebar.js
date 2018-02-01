import React, { Component } from 'react'
import '../css/sidebar.css'
import Source from './source.js'
import Button from 'material-ui/Button'
import All from '../img/all.png'
import CoinDesk from '../img/coindesk.png'
import BitcoinNews from '../img/bitcoin.png'
import Bitcoinist from '../img/bitcoinist.png'
import Bitmag from '../img/bitmag.png'
import Blockonomi from '../img/blockonomi.png'
import Coinmeme from '../img/coinmeme.png'
import TheBlockchain from '../img/theblockchain.png'

class Sidebar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            defaultSource: {
                name: "All news",
                logo: All,
            },
            sources: {
                "CoinDesk": {
                    name: "CoinDesk",
                    logo: CoinDesk,
                    url: "https://www.coindesk.com/"
                },
                "coinmeme": {
                    name: "Coinmeme",
                    logo: Coinmeme,
                    url: "https://coinmeme.io/"
                },
                "Bitcoinist": {
                    name: "Bitcoinist",
                    logo: Bitcoinist,
                    url: "http://bitcoinist.com/"
                },
                "Bitcoin Magazine": {
                    name: "Bitcoin Magazine",
                    logo: Bitmag,
                    url: "https://bitcoinmagazine.com/"
                },
                "Bitcoin News": {
                    name: "Bitcoin News",
                    logo: BitcoinNews,
                    url: "https://news.bitcoin.com/"
                },
                "Blockonomi": {
                    name: "Blockonomi",
                    logo: Blockonomi,
                    url: "https://blockonomi.com/"
                },
                "The Blockchain": {
                    name: "The Blockchain",
                    logo: TheBlockchain,
                    url: "http://the-blockchain.com/"
                },
                "TechCrunch": {
                    name: "TechCrunch",
                    logo: TheBlockchain,
                    url: "https://techcrunch.com/"
                },
                "CCN": {
                    name: "CryptoCoinNews",
                    logo: TheBlockchain,
                    url: "https://www.ccn.com/"
                },
                "CNBC": {
                    name: "CNBC",
                    logo: TheBlockchain,
                    url: "https://www.cnbc.com/"
                },
                "NYTimes": {
                    name: "New York Times",
                    logo: TheBlockchain,
                    url: "https://www.nytimes.com/"
                },
                "Quartz": {
                    name: "The Blockchain",
                    logo: TheBlockchain,
                    url: "https://qz.com/"
                },
                "WSJ": {
                    name: "Wall Street Journal",
                    logo: TheBlockchain,
                    url: "https://www.wsj.com/"
                },
                "Hacker Noon": {
                    name: "Hacker Noon",
                    logo: TheBlockchain,
                    url: "https://hackernoon.com/"
                },
            }
        }
    }

    render() {
        return (
            <div className="sidebar">
                <Button onClick={this.props.sortBySource("content")} className="source">
                    <img className="sourceLogo" src={this.state.defaultSource.logo} alt={this.state.defaultSource.name}/>
                    <div className="sourceName">{this.state.defaultSource.name}</div>
                </Button>
                {this.state.sources && Object.keys(this.state.sources).map((key) => {
                    return (
                        <Source className="sourceComp" key={key} sortBySource={this.props.sortBySource} id={key} sourceData={this.state.sources[key]}/>
                    )
                })}
            </div>
        )
    }
}

export default Sidebar