// BASIC
import React, {Component} from 'react';
import { HashRouter as Router, Switch, Route} from 'react-router-dom';
// SITES
import MainPage from '../Components/MainPage'
import CountryAndCitiesGame from '../Components/Apps/CountryAndCities/Game'
import CountryAndCitiesCreate from '../Components/Apps/CountryAndCities/Create'
import Login from '../Components/Login/LoginApp'
import Registration from '../Components/Login/Registration'
import UserProfile from '../Components/Login/UserProfile'

class Routes extends Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route path="/" exact component={MainPage}/>
					<Route path="/panstwa-miasta" exact component={CountryAndCitiesCreate}/>
					<Route path="/panstwa-miasta/:teamName" exact component={CountryAndCitiesGame}/>
					<Route path="/logowanie" exact component={Login}/>
					<Route path="/rejestracja" exact component={Registration}/>
					<Route path="/użytkownicy/:id" exact component={UserProfile}/>
				</Switch>
			</Router>
		)
	}
}
export default Routes