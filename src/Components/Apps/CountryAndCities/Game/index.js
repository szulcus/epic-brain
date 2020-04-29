// BASIC
import React, { Component } from 'react'
import styled from 'styled-components'
import { db, au } from '../../../../Config/firebase'
// COMPONENTS
import ChooseLetter from './components/ChooseLetter'
// ICONS
import {FaCheck} from 'react-icons/fa'

const GameSite = styled.div`
	width: 100vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30px;
`
const Cathegories = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-bottom: 50px;
`
const Cathegory = styled.div`
	text-align: center;
	width: 150px;
	margin: 0 10px;
`
const Title = styled.h3`

`
const Input = styled.input`
	background-color: transparent;
	border: 1px solid var(--color-main);
	padding: 10px;
	outline: none;
	color: var(--color-primary);
	text-align: center;
	border-radius: 10px;
	width: 100%;
	font-size: 18px;
	::placeholder {
		transition: all 0.2s ease;
		color: var(--color-secondary);
	}
	:focus {
		::placeholder {
			transform: scale(0.5);
			opacity: 0;
		}
	}
`
const Check = styled(FaCheck)`
	font-size: 35px;
	color: var(--color-main);
`
const Timer = styled.div`
	position: absolute;
	bottom: 30px;
	left: 30px;
	width: 50px;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--color-main);
	font-size: 25px;
	font-weight: bold;
	color: var(--color-bg);
	border-radius: 100%;
`
const Letter = styled.div`
	position: absolute;
	bottom: 30px;
	right: 30px;
	width: 50px;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--color-main);
	font-size: 25px;
	font-weight: bold;
	text-transform: uppercase;
	color: var(--color-bg);
	border-radius: 100%;
`
const Users = styled.div`
	position: absolute;
	bottom: 100px;
	right: 30px;
`
const Avatar = styled.div`
	width: 50px;
	height: 50px;
	background: url("${props => props.src}") no-repeat center center;
	background-size: cover;
	margin: 10px;
	border-radius: 100%;
`
class Game extends Component {
	state = {
		owner: null,
		userId: null,
		round: 1,
		rounds: null,
		userRound: {
			country: '-',
			city: '-',
			plant: '-',
			animal: '-',
			item: '-',
			name: '-'
		},
		seconds: '-',
		letter: false,
		startChoosing: false,
		timer: false,
		userImages: []
	}
	componentDidMount() {
		au.onAuthStateChanged(user => {
			if (user) {
				// db.collection('apps-data').doc(this.props.match.params.teamName).update({
				// 	[`users.${user.uid}`]: {
				// 		rounds: [],
				// 		userId: user.uid,
				// 		points: 0,
				// 	}
				// })
				this.setState({userId: user.uid})
				db.collection('apps-data').doc(this.props.match.params.teamName).get().then(snap => {
					const userImages = []
					Object.keys(snap.data().users).forEach((uid) => {
						db.collection('users').doc(uid).get().then(snap => {
							userImages.push(snap.data().info.avatar)
							this.setState({userImages})
						})
					})
				})
				db.collection('apps-data').doc(this.props.match.params.teamName).onSnapshot(snap => {
					if (snap.data()) {
						const data = snap.data()
						if (data.users[user.uid].addData) {
							this.ready()
							db.collection('apps-data').doc(this.props.match.params.teamName).update({
								[`users.${user.uid}.addData`]: false
							})
						}
						// console.log(data)
						this.setState({
							round: data.round,
							owner: data.owner,
							rounds: data.users[user.uid].rounds,
							letter: data.letter,
							seconds: data.seconds,
							startChoosing: snap.data().users[user.uid].startChoosing,
							timer: data.timer
						})
						// console.log(!Object.keys(snap.data().users).includes(user.uid))
						if (!Object.keys(snap.data().users).includes(user.uid)) {
							db.collection('apps-data').doc(this.props.match.params.teamName).update({
									[`users.${user.uid}`]: {
										userId: user.uid,
										points: 0,
										rounds: []
									}
							})
						}
					}
				})
			}
		})
	}
	updateData = (e) => {
		e.persist();
		if (!e.target.value) {
			this.setState(prevState => ({
				userRound: {
					...prevState.userRound,
					[e.target.id]: '-'
				}
			}));
		}
		else if (e.target.value.charAt(0).toLowerCase() === this.state.letter) {
			this.setState(prevState => ({
				userRound: {
					...prevState.userRound,
					[e.target.id]: e.target.value
				}
			}));
		}
		else {
			e.target.value = ''
		}
	}
	clear = () => {
		[...document.getElementsByClassName('input')].forEach(element => {
			element.value = '';
		})
	}
	endGame = () => {
		db.collection('apps-data').doc(this.props.match.params.teamName).update({
			timer: true
		})
		this.timer = setInterval(() => {
			db.collection('apps-data').doc(this.props.match.params.teamName).get().then(snap => {
				if (snap.data().seconds) {
					db.collection('apps-data').doc(this.props.match.params.teamName).update({
						seconds: snap.data().seconds - 1
					})
				}
				else {
					db.collection('apps-data').doc(this.props.match.params.teamName).update({
						seconds: 30
					})
				}
				if (this.state.seconds === 0) {
					clearInterval(this.timer);
					setTimeout(() => {
						alert('Koniec gry!')
						db.collection('apps-data').doc(this.props.match.params.teamName).get().then(snap => {
							Object.keys(snap.data().users).forEach(uid => {
								db.collection('apps-data').doc(this.props.match.params.teamName).update({
									[`users.${uid}`]: {
										points: 0,
										rounds: []
									}
								})
							})
							db.collection('apps-data').doc(this.props.match.params.teamName).update({
								letter: '',
								seconds: '-',
								timer: false,
								round: 0
							})
						})
					}, 1000);
				}
			})
		}, 300);
	}
	setTimer = () => {
		// db.collection('apps-data').doc(this.props.match.params.teamName).update({
		// 	timer: true
		// })
		this.timer = setInterval(() => {
			db.collection('apps-data').doc(this.props.match.params.teamName).get().then(snap => {
				if (snap.data().seconds === '-' && snap.data().timer === false) {
					db.collection('apps-data').doc(this.props.match.params.teamName).update({
						seconds: 30,
						timer: true
					})
				}
				else {
					if (snap.data().seconds > 0) {
						db.collection('apps-data').doc(this.props.match.params.teamName).update({
							seconds: snap.data().seconds - 1
						})
					}
					else {
						clearInterval(this.timer);
						setTimeout(() => {
							db.collection('apps-data').doc(this.props.match.params.teamName).update({
								seconds: '-',
								timer: false,
								round: snap.data().round + 1,
								letter: ''
							}).then(() => {
								db.collection('apps-data').doc(this.props.match.params.teamName).get().then(snap => {
									Object.values(snap.data().users).forEach((user, index) => {
										console.log(user.rounds.length, snap.data().round)
										if (user.rounds.length < snap.data().round) {
											console.log('ten: ', user);
											const uid = Object.keys(snap.data().users)[index];
											db.collection('apps-data').doc(this.props.match.params.teamName).update({
												[`users.${uid}.addData`]: true
											})
										}
									})
								})
							})
						}, 1000);
					}
				}
			})
		}, 300);
	}
	ready = () => {
		db.collection('apps-data').doc(this.props.match.params.teamName).get().then(snap => {
			db.collection('apps-data').doc(this.props.match.params.teamName).update({
				[`users.${this.state.userId}.rounds`]: [
					this.state.userRound,
					...snap.data().users[this.state.userId].rounds,
				]
			}).then(() => {
				console.log(snap.data().users[this.state.userId].addData);
				if (!snap.data().users[this.state.userId].addData) {
					if (this.state.rounds.length >= 3) {
						this.endGame()
						console.log('endgame');
					}
					else {
						this.setTimer()
						console.log('settimer');
					}
				}
			})
		})
		this.clear()
	}
	finishChoosing = (letter) => {
		db.collection('apps-data').doc(this.props.match.params.teamName).update({
			letter: letter
		})
	}
	setChoosing = (bool) => {
		db.collection('apps-data').doc(this.props.match.params.teamName).get().then(snap => {
			Object.keys(snap.data().users).forEach(uid => {
				if (uid !== snap.data().owner) {
					db.collection('apps-data').doc(this.props.match.params.teamName).update({
						[`users.${uid}.startChoosing`]: bool
					})
				}
			})
		})
	}
	render() {
		return (
			<GameSite>
				{!this.state.userId && !this.state.rounds ? '...' : <>
					<h1>{this.props.match.params.teamName}</h1>
						{!this.state.letter ? <>
							{this.state.owner !== this.state.userId ? 'Poczekaj na wylosowanie literki...' : <ChooseLetter back={this.finishChoosing} setChoosing={this.setChoosing} />}
						</> : <>
							{this.state.rounds.reverse().map(({country, city, plant, animal, item, name}, index) => <Cathegories key={`cathegory-${index}`}>
									<Cathegory>
										<Title>Państwo</Title>
										<Input value={country} readOnly />
									</Cathegory>
									<Cathegory>
										<Title>Miasto</Title>
										<Input value={city} readOnly />
									</Cathegory>
									<Cathegory>
										<Title>Roślina</Title>
										<Input value={plant} readOnly />
									</Cathegory>
									<Cathegory>
										<Title>Zwierzę</Title>
										<Input value={animal} readOnly />
									</Cathegory>
									<Cathegory>
										<Title>Rzecz</Title>
										<Input value={item} readOnly />
									</Cathegory>
									<Cathegory>
										<Title>Imię</Title>
										<Input value={name} readOnly />
									</Cathegory>
							</Cathegories>)}
							{this.state.rounds.length >= 3 ? '' : <>
								<Cathegories>
									<Cathegory>
										<Title>Państwo</Title>
										<Input id="country" className="input" onChange={this.updateData} placeholder="Wpisz Państwo" autoComplete="off" />
									</Cathegory>
									<Cathegory>
										<Title>Miasto</Title>
										<Input id="city" className="input" onChange={this.updateData} placeholder="Wpisz Miasto" autoComplete="off" />
									</Cathegory>
									<Cathegory>
										<Title>Roślina</Title>
										<Input id="plant" className="input" onChange={this.updateData} placeholder="Wpisz Roślinę" autoComplete="off" />
									</Cathegory>
									<Cathegory>
										<Title>Zwierzę</Title>
										<Input id="animal" className="input" onChange={this.updateData} placeholder="Wpisz Zwierzę" autoComplete="off" />
									</Cathegory>
									<Cathegory>
										<Title>Rzecz</Title>
										<Input id="item" className="input" onChange={this.updateData} placeholder="Wpisz Rzecz" autoComplete="off" />
									</Cathegory>
									<Cathegory>
										<Title>Imię</Title>
										<Input id="name" className="input" onChange={this.updateData} placeholder="Wpisz Imię" autoComplete="off" />
									</Cathegory>
								</Cathegories>
								{!this.state.timer && <Check onClick={this.ready} />}
								<Users>
									{this.state.userImages.map((url, index) => <Avatar src={url} alt={`user${index + 1}`} />)}
									{/* {this.state.userImages.map((url, index) => 'hmm')} */}
								</Users>
								<Letter>{this.state.letter}</Letter>
								<Timer>{this.state.seconds !== '-' ? `${this.state.seconds}s` : '-'}</Timer>
							</>}
						</>}
				</>}
			</GameSite>
		);
	}
}

export default Game