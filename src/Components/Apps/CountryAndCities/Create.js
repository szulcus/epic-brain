// PACKAGES
import React, { Component } from 'react'
import styled from 'styled-components'
import {db, au} from '../../../Config/firebase'
import { paramCase } from "param-case";
import latinize from 'latinize'

const CountryAndCitiesComponent = styled.div`
	width: 100vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30px;
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

class CountryAndCities extends Component {
	state = {
		userId: null,
		isAdmin: false,
		groups: []
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
								rounds: [],
								letter: false
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
		// this.props.history.push(`/panstwa-miasta/${group.owner}/${paramCase(latinize(group.name))}`)
		this.props.history.push(`/panstwa-miasta/${group.name}`)
	}
	render() {
		return (
			<>
				{!this.state.userId ? "Zaloguj się, aby móc korzystać z aplikacji!" : <CountryAndCitiesComponent>
					<Teams>
						{this.state.groups.map((group, index) => <Team key={index}>
							{(this.state.isAdmin || group.owner === this.state.userId) && <button onClick={(e) => this.delete(group, e)}>x</button>}
							<TeamName>{group.name}</TeamName>
							<button onClick={() => this.join(group)}>Dołącz</button>
						</Team>)}
					</Teams>
					<button onClick={this.create}>Create</button>
				</CountryAndCitiesComponent>}
			</>
		);
	}
}

export default CountryAndCities