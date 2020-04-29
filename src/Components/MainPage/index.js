// BASIC
import React, { Component } from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {db, au} from '../../Config/firebase'
import { paramCase } from "param-case";
import latinize from 'latinize'
// import { Link as Linkk, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
// COMPONENTS
import Preloader from '../Preloader'
import Welcome from './components/Welcome'
// IMAGES
import logo from '../Images/logo/logo.png'

const AppComponent = styled.div`
	width: 100vw;
	height: 100vh;
	height: calc(var(--vh, 1vh) * 100);
	overflow-y: scroll;
	::-webkit-scrollbar {
		width: 0;
	}
`
const List = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

`
const ChoiseTitle = styled.h2`
	font-size: 30px;
	margin: 0;
	padding: 20px;
`
const Choise = styled.div`
	display: flex;
`
const Go = styled(Link)`
	text-decoration: none;
	color: var(--color-primary);
	display: flex;
	flex-direction: column;
	text-align: center;
	transition: all 0.2s ease;
	:hover {
		opacity: 0.5;
	}
`
const Icon = styled.img`
	width: 100px;
	height: 100px;
	margin: 10px 20px;
`
const Teams = styled.div`
	display: flex;
`
const Team = styled.div`
	width: 200px;
	height: 150px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	margin: 20px;
	padding: 20px;
	border: 1px solid var(--color-decorative);
	border-radius: 20px;
`
const TeamName = styled.h3`
	margin: 0;
	text-align: center;
`
class App extends Component {
	state = {
		userId: null,
		isAdmin: false,
		groups: [],
		stats: {
			views: "-",
			average: "-",
			users: "-"
		}
	}
	componentDidMount() {
		au.onAuthStateChanged(user => {
			if (user) {
				this.setState({userId: user.uid})
				user.getIdTokenResult().then(idTokenResult => {
					if (idTokenResult.claims.admin) {
						this.setState({isAdmin: true})
					}
					user.admin = idTokenResult.claims.admin
				})
			}
		})
		db.collection('apps-data').onSnapshot(snaps => {
			const groups = [];
			snaps.forEach(snap => groups.push({name: snap.id, owner: snap.data().owner}))
			this.setState({groups})
		})
		db.collection('apps').doc('epic-brain').get().then(snap => {
			db.collection('apps').doc('epic-brain').update({
				'stats.views': snap.data().stats.views + 1
			})
		})
		db.collection('apps').doc('epic-brain').onSnapshot(snap => {
			let allStars = 0;
			let allOpinions = 0;
			snap.data().stats.opinions.forEach(({stars}) => {
				allStars += stars
				allOpinions += 1
			})
			const average = allStars / allOpinions
			this.setState(prevState => ({
				stats: {
					...prevState.stats,
					average: average.toFixed(1),
					views: snap.data().stats.views.toString()
				}
			}));
		})
		db.collection('users').onSnapshot(snaps => {
			let users = 0;
			snaps.forEach(() => users += 1)
			this.setState(prevState => ({
				stats: {
					...prevState.stats,
					users: users.toString()
				}
			}));
		})
	}
	scrollDown = () => {
		document.getElementById('list').scrollIntoView({behavior: 'smooth', block: 'start'})
	}
	create = () => {
		db.collection('apps-data').get().then(snaps => {
			const name = prompt("Wpisz nazwę grupy:")
			if (name) {
				if (!this.state.groups.includes(name)) {
					db.collection('apps-data').doc(name).set({
						owner: this.state.userId,
						users: {
							[this.state.userId]: {
								userId: this.state.userId,
								points: 0,
								rounds: []
							}
						}
					})
					db.collection('users').doc(this.state.userId).update({
						'groups.country-and-cities': [
							{
								name: name,
								owner: true
							}
						]
					})
				}
				else {
					alert("Ta nazwa jest juz zajęta!")
				}
			}
		})
	}
	delete = (group, e) => {
		const name = e.target.parentElement.children[1].innerHTML;
			if (group.owner === this.state.userId) {
				console.log(name);
				db.collection('apps-data').doc(name).delete()
			}
	}
	join = (group) => {
		// db.collection('users')
		this.props.history.push(`/panstwa-miasta/${group.owner}/${paramCase(latinize(group.name))}`)
	}
	render() {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		window.addEventListener('resize', () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		});
		return (
			<>
				<Preloader />
				<AppComponent id="app">
					<Welcome logo={logo} scroll={this.scrollDown} stats={this.state.stats} />
					<List id="list">
						<ChoiseTitle>W co chcesz zagrać?</ChoiseTitle>
						<Choise>
							<Go to="/panstwa-miasta">
								Państwa miasta
							</Go>
						</Choise>
						{/* <Teams>
							{this.state.groups.map(group => <Team>
								{(this.state.isAdmin || group.owner === this.state.userId) && <button onClick={(e) => this.delete(group, e)}>x</button>}
								<TeamName>{group.name}</TeamName>
								<button onClick={() => this.join(group)}>Dołącz</button>
							</Team>)}
						</Teams>
						{!this.state.userId ? "Zaloguj się, aby móc korzystać z aplikacji!" : <button onClick={this.create}>Create</button>} */}
					</List>
				</AppComponent>
			</>
		);
	}
}

export default App