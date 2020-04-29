// BASIC
import React, { Component } from 'react'
import styled, {keyframes} from 'styled-components'
// ICONS
import {FaUsers, FaStar, FaEye} from 'react-icons/fa'
// IMAGES
import scrollImage from '../../Images/scroll.svg'

const WelcomeComponent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	width: 100%;
`
const Title = styled.h1`
	font-size: 50px;
	letter-spacing: 2px;
`
const TitleLetter = styled.span`
	font-size: 55px;
	color: var(--color-main);
`
const Logo = styled.img`
	width: 80vw;
	max-width: 300px;
	border-radius: 100%;
	box-shadow: 0 0 30px var(--color-secondary);
	@media (max-height: 600px) {
		height: calc(100vh - 320px);
		width: auto;
	}
	@media (max-height: 500px) {
		display: none;
	}
`
const Stats = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-evenly;
	margin: 30px 0;
`
const StatsElement = styled.div`
	display: flex;
	font-size: 25px;
`
const StatsNumber = styled.span`
	margin: 0 10px;
	font-weight: bold;
`
const StatsIcon = styled.span`
	color: var(--color-main);
	transform: translateY(2px);
`
const scrollAnimation = keyframes`
	0% {
		transform: translateY(0);
	}
	80% {
		transform: translateY(10px);
	}
	100% {
		transform: translateY(0);
	}
`
const ScrollDown = styled.img`
	width: 50px;
	height: 50px;
	margin-bottom: 50px;
	animation: ${scrollAnimation} 1s infinite ease-out;
	:hover {
		cursor: pointer;
	}
`

class Welcome extends Component {
	render() {
		return (
			<WelcomeComponent>
				<Title>
					<TitleLetter>E</TitleLetter>pic<TitleLetter>B</TitleLetter>rain
				</Title>
				<Logo src={this.props.logo} />
				<Stats>
					<StatsElement>
						<StatsNumber>{this.props.stats.views}</StatsNumber>
						<StatsIcon><FaEye /></StatsIcon>
					</StatsElement>
					<StatsElement>
						<StatsNumber>{this.props.stats.average}</StatsNumber>
						<StatsIcon><FaStar /></StatsIcon>
					</StatsElement>
					<StatsElement>
						<StatsNumber>{this.props.stats.users}</StatsNumber>
						<StatsIcon><FaUsers /></StatsIcon>
					</StatsElement>
				</Stats>
				<ScrollDown src={scrollImage} onClick={this.props.scroll} />
			</WelcomeComponent>
		);
	}
}

export default Welcome