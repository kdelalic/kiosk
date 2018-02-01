import React, { Component } from 'react'
import '../css/sidebar.css'
import Source from './source.js'
import Button from 'material-ui/Button'
import All from '../img/all.png'

import {firestore} from './firebase.js'

class Sidebar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            defaultSource: {
                name: "Latest News",
                logo: All,
            },
            sources: {

            }
        }
    }

    componentDidMount() {
            firestore.collection("sources")
            .get()
            .then(snapshot => {
                let sources = {}
                snapshot.forEach(doc => {
                    sources[doc.id] = doc.data()
                });
                this.setState({
                    ...this.state,
                    sources: sources
                })
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
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
                        <Source className="sourceComp" key={key} sortBySource={this.props.sortBySource} id={key} sourceData={this.state.sources[key]}/>
                    )
                })}
            </div>
        )
    }
}

export default Sidebar