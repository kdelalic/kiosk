import React, { Component } from 'react'
import '../../../css/cryptofolio/crypto.css';
import Progress from './progress.js'
import Modal from 'material-ui/Modal'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add'
import AddCoin from './addcoin.js';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { checkPos, toMonth } from './helpers.js'
import axios from 'axios'
import { firestore } from '../../firebase'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    addCoin
} from '../../redux.js';

class Crypto extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			convertCurrency: 'USD'
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			...this.state,
			coins: nextProps.coins
		})
	}

	componentDidMount() {
		if (this.props.coins) {
			this.setState({
				...this.state,
				coins: this.props.coins
			})
			this._getRates
		}
	}

	_getRates = () => {
		axios.get("https://api.fixer.io/latest?base=USD")
			.then(response => {
				const CAD = response.data["rates"]["CAD"];

				this.setState({
				  	...this.state,
					CAD: CAD
				});
			})
			.catch(err => {               
	        	console.log(err)
		});
	}

	handleOpen = () => {
		this.setState({ ...this.state, open: true });
	};

	handleClose = () => {
		this.setState({ ...this.state, open: false });
	};

	coinData = (dataFromChild, key) => {
		this.setState({
			...this.state,
			coins: {
				...this.state.coins,
				[key]: dataFromChild
			},
		}, () => {
			firestore.collection("coins")
				.doc(this.props.user.uid)
				.set(this.state.coins, {merge: true})
			this.props.addCoin(key, dataFromChild)
			this.handleClose();
		})
	};

	handleChange = event => {
		this.setState({
			...this.state,
			convertCurrency: event.target.value
		})
	}

	render() {
		let coins = undefined;
		if (this.props.coins) coins = this.state.coins
		return (
			<div className="crypto">
				<Progress coins={coins} convertCurrency={this.state.convertCurrency} CAD={this.state.CAD} />
				
				<div className="header container">
					<Paper className="table">
						<Table>
							<TableHead children={TableRow}>
								<TableRow>
									<TableCell>Coin</TableCell>
									<TableCell numeric>Current Price</TableCell>
									<TableCell numeric>Total Value</TableCell>
									<TableCell numeric>Profit/Loss</TableCell>
									<TableCell numeric>Change</TableCell>
								</TableRow>
							</TableHead>
							<TableBody children={TableRow}>
								{coins && Object.keys(coins).map((key, index) => {
									const coin = coins[key]
									return (
										<TableRow key={`coin-${index}`}>
											<TableCell>
												<div className="main">{coin.value}</div>
												<div className="subMain">{"(" + toMonth(coin.date.substring(5, 7)) + " " + coin.date.substring(8, 10) + ", " + coin.date.substring(0, 4) + ")"}</div>
											</TableCell>
											<TableCell className="currentPrice">
												<div className="main">{this.state.convertCurrency + " " + coin.currentPrice.toFixed(2)}</div>
												<div className="subMain">{coin.amount + " @ " + coin.currency.toUpperCase() + " " + coin.price}</div>
											</TableCell>
											<TableCell numeric className="main">{this.state.convertCurrency + " " + (coin.currentPrice * coin.amount).toFixed(2)}</TableCell>
											<TableCell numeric className={"main" + checkPos(coin.profit)}>{this.state.convertCurrency + " " + coin.profit}</TableCell>
											<TableCell numeric className={"main" + checkPos(((coin.profit / (coin.amount * coin.currentPrice)) * 100).toFixed(2))}>{((coin.profit / (coin.amount * coin.currentPrice)) * 100).toFixed(2) + "%"}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</Paper>
					
					<Button fab mini color="primary" aria-label="add" onClick={this.handleOpen} className="add">
						<AddIcon />
					</Button>
				</div>
				<Modal
					aria-labelledby="Add Coin"
					aria-describedby="Add a Coin"
					open={this.state.open}
					onClose={this.handleClose}
				>
					<AddCoin coinData={this.coinData} handleClose={this.handleClose} />
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user,
    coins: state.coins
});

const mapDispatchToProps = dispatch => {
    return {
        addCoin: bindActionCreators(addCoin, dispatch),
    };
};

export default connect(
	mapStateToProps,
    mapDispatchToProps
)(Crypto);