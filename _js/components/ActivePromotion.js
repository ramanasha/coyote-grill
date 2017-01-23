import { h, Component } from 'preact';
import firebase from 'firebase';
import Color from 'color';
import * as colors from 'colors.css';

import { isPromotionRedeemed } from '../utils.js';
import { BREAKPOINTS } from '../constants.js';

export default class ActivePromotion extends Component {
	constructor(){
		super();
		this.state = {
			redeemed: false
		};

		this.redeem = this.redeem.bind(this);
		this.handleKeyup = this.handleKeyup.bind(this);
	}

	componentDidMount(){
		document.querySelector('html').classList.add('locked');
		document.addEventListener('keyup', this.handleKeyup);
	}

	render(){
		const redeemed = isPromotionRedeemed(this.props.id, this.props.userData);

		const style = {
			backgroundColor: redeemed
				? this.state.redeemed
					? Color(colors.green).alpha(0.95).rgb().string()
					: Color(colors.red).alpha(0.95).rgb().string()
				: 'rgba(64, 64, 64, 0.95)'
		};

		return (
			<div className="active-promotion" style={style}>
				<style jsx>
				{`
					.active-promotion {
						z-index: 10000;
						position: fixed;
						top: 0;
						right: 0;
						bottom: 0;
						left: 0;
						backface-visibility: hidden;
						overflow: auto;

						display: flex;
						flex-direction: column;
						justify-content: space-around;
						align-items: center;

						color: white;
						font-size: 2em;
						font-family: sans-serif;
					}

					h2 {
						text-align: center;
						margin: 0;
					}

					img {
						width: 20%;
						height: auto;
						margin: 2em;
					}

					.info-container,
					.redeem-container {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						text-align: center;
					}

					p {
						text-align: center;
						margin: 0.5em 2em;
						font-size: 0.75em;
					}

					@media (min-width: ${BREAKPOINTS.SMALL_DESKTOP}px) {
						p {
							font-size: 1em;
						}
					}

					.button {
						border-radius: 5px;
						background-clip: padding-box;
						border: 2px solid;
						outline: none;
						cursor: pointer;
						color: white;
						font-size: 1em;
						padding: 0.25em 1em;
					}

					.redeem-button {
						background: rgba(255, 255, 255, 0.5);
						border-color: rgba(255, 255, 255, 0.5);
						background-clip: padding-box;
						padding: 0.25em 1em;
						margin: 1em 0;
					}

					.redeem-button:hover {
						background: rgba(255, 255, 255, 0.3);
						background-clip: padding-box;
					}

					.redeem-button[disabled] {
						transform: none;
						background: rgba(0, 0, 0, 0.3);
						background-clip: padding-box;
						color: rgba(255, 255, 255, 0.8);
						cursor: not-allowed;
					}

					.close-button {
						background: transparent;
						background-clip: padding-box;
						border-color: rgba(255, 255, 255, 0.5);
						color: rgba(255, 255, 255, 0.5);
					}

					.close-button:hover {
						background: rgba(255, 255, 255, 0.2);
						background-clip: padding-box;
					}

				`}
				</style>
				<h2>{this.props.title}</h2>

	{
		redeemed
			? (
				<div className="info-container">
					<span>
		{
			this.state.redeemed
				? 'Promotion redeemed successfully'
				: 'This promotion has already been redeemed'
		}
					</span>
					<img alt="" src={`/images/icons/${this.state.redeemed
						? 'checkmark' : 'x-mark'}.svg`} width="300" height="300" />
				</div>
			)
			: (
				<div className="redeem-container">
					<p>
						Promotions must be redeemed in front of a bartender.
						Are you sure you want to redeem this now?
					</p>
					<button type="button" className="button redeem-button"
							onClick={this.redeem}>
						Redeem
					</button>
					<p>
						This can't be undone.
					</p>
				</div>
			)
	}


				<button type="button" className="button close-button"
						onClick={this.props.close}>
					Close
				</button>
			</div>
		);
	}

	redeem(){
		this.setState({redeemed: true});

		const userId = this.props.user.uid;
		firebase.database()
			.ref(`users/${userId}/redeemedPromotions/${this.props.id}`).set({
				redeemed: true,
				redeemedAt: new Date().toISOString()
			});
	}

	handleKeyup(event){
		if(event.key === 'Escape')
			this.props.close();
	}

	componentWillUnmount(){
		document.querySelector('html').classList.remove('locked');
		document.removeEventListener('keyup', this.handleKeyup);
	}
}

ActivePromotion.propTypes = {
	user: Object,
	userData: Object,
	id: String,
	title: String,
	desc: String,
	close: Function
};
