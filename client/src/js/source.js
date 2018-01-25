import React, { Component } from 'react'
import '../css/source.css'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import LinkIcon from 'react-icons/lib/md/insert-link'

class Source extends Component {

    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    componentWillMount() {
        this.setState({
            ...this.state,
            sourceData: this.props.sourceData
        })
    }

    render() {
        const {sourceData} = this.state
        return (
            <div className="source">
                <Button onClick={this.props.sortBySource(sourceData.name)} className="sortSource">
                    <img className="sourceLogo" src={sourceData.logo} alt={sourceData.name}/>
                    <div className="sourceName">{sourceData.name}</div>
                </Button>
                <IconButton href={sourceData.url}>
                    <LinkIcon className="linkIcon"/>
                </IconButton>
            </div>
        )
    }
}

export default Source