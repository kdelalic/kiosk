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
                    name: "Bitcoinist",
                    logo: Bitcoinist,
                    url: "https://news.bitcoin.com/"
                },
                "source-4": {
                    name: "Bitmag",
                    logo: Bitmag,
                    url: "https://news.bitcoin.com/"
                },
                "source-5": {
                    name: "Blockonomi",
                    logo: Blockonomi,
                    url: "https://news.bitcoin.com/"
                },
                "source-6": {
                    name: "Coinmeme",
                    logo: Coinmeme,
                    url: "https://news.bitcoin.com/"
                },
                "source-7": {
                    name: "The Blockchain",
                    logo: TheBlockchain,
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