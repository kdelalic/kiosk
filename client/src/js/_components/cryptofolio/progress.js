import React, { Component } from 'react';
import '../../../css/cryptofolio/progress.css';
import Paper from 'material-ui/Paper';
import { checkPos } from './helpers.js'
import { connect } from 'react-redux';

class Progress extends Component {

	constructor(props) {
		super(props);

		this.state = {
			convertCurrency: 'USD',
			initial: 0,
			profit: 0,
			holdings: 0,
			change: 0,
		};
	}

	componentWillReceiveProps(nextProps) {
		var profit = 0
		var initial = 0
		var holdings = 0
		var change = 0
		for (var key in nextProps.coins) {
			const coin = nextProps.coins[key]
			if (coin.profit !== undefined) {
				profit = profit + coin.profit
				initial = initial + coin.price * coin.amount
				holdings = initial + profit
				change = profit / initial * 100
			}
		}
		this.setState({
			...this.state,
			initial: initial,
			profit: profit,
			holdings: holdings,
			change: change,
		})
	}

	componentDidMount() {
			this.setState({
				...this.state,
				CAD: this.props.CAD
			})
			this.setState({
				...this.state,
				convertCurrency: this.props.convertCurrency
			})
			var profit = 0
			var initial = 0
			var holdings = 0
			var change = 0
			for (var key in this.props.coins) {
				const coin = this.props.coins[key]
				if (coin.profit !== undefined) {
					profit = profit + coin.profit
					initial = initial + coin.price * coin.amount
					holdings = initial + profit
					change = profit / initial * 100
				}
			}
			this.setState({
				...this.state,
				initial: initial,
				profit: profit,
				holdings: holdings,
				change: change,
			})
	}

	render() {
		const currency = this.state.convertCurrency === undefined ? "" : this.state.convertCurrency.toUpperCase();
		return (
			<div className={"cryptofolio-progress container" + (this.props.minimal ? " minimal" : "")}>
				<div className="cards">
					<Paper className="stat">
						<div className="stat-content">
							<h1 className={checkPos((this.state.initial * (this.state.convertCurrency === "USD" ? 1 : this.state.CAD)))}>{currency + " " + (this.state.initial * (this.state.convertCurrency === "USD" ? 1 : this.state.CAD)).toFixed(2)}</h1>
							<h2>Initial Investment</h2>
						</div>
					</Paper>
					<Paper className="stat">
						<div className="stat-content">
							<h1 className={checkPos(this.state.profit)}>{currency + " " + this.state.profit.toFixed(2)}</h1>
							<h2>Profit/Loss</h2>
						</div>
					</Paper>
					<Paper className="stat">
						<div className="stat-content">
							<h1 className={checkPos(this.state.holdings * (this.state.holdingsinitial * (this.state.convertCurrency === "USD" ? 1 : this.state.CAD)))}>{currency + " " +(this.state.holdings * (this.state.convertCurrency === "USD" ? 1 : this.state.CAD)).toFixed(2)}</h1>
							<h2>Total Holdings</h2>
						</div>
					</Paper>
					<Paper className="stat">
						<div className="stat-content">
							<h1 className={checkPos(this.state.change)}>{this.state.change.toFixed(2) + "%"}</h1>
							<h2>Change</h2>
						</div>
					</Paper>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
    coins: state.coins,
});

export default connect(
    mapStateToProps
)(Progress);