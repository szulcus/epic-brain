// BASIC
import React, { Component } from 'react'
import styled, { css, keyframes } from 'styled-components'
// IMAGES
import line from '../Images/logo/vector-logo-line.svg'
import triangle from '../Images/logo/vector-logo-triangle.svg'

const hide = keyframes`
	0% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
`
const PreloaderElement = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	width: 100vw;
	height: 100vh;
	background-color: black;
	z-index: 100;
	${props =>
		props.hide &&
		css`
			animation: ${hide} 0.3s both;
		`
	}
	${props =>
		props.delete &&
		css`
			display: none;
		`
	}
`

const Animation = styled.div`
	display: none;
	position: relative;
	width: 500px;
	height: 500px;
	${props =>
		props.isLoaded &&
		css`
			display: flex;
		`
	}
`
const triangleAnimation = keyframes`
	0% {
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.5);
	}
	30% {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1.1);
	}
	50% {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
	100% {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}
`
const lineAnimation = keyframes`
	0% {
		transform: translate(-100%, -50%);
	}
	40% {
		transform: translate(-100%, -50%);
	}
	60% {
		transform: translate(-50%, -50%);
	}
	100% {
		transform: translate(-50%, -50%);
	}
`
const Logo = styled.img`
	width: 100vw;
	max-width: 512px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	/* animation: ${lineAnimation} 1.5s both; */
	:first-child{
		animation: ${triangleAnimation} 1s both;
	}
	:last-child {
		animation: ${lineAnimation} 1s both;
	}
	
`

class Preloader extends Component {
	state = {
		isLoaded: false,
		isLoading: true,
		hide: false,
		delete: false
	}
	componentDidMount() {
		this.setState({isLoaded: true, isLoading: false})
		setTimeout(() => {this.setState({hide: true})}, 1000);
		setTimeout(() => {this.setState({delete: true})}, 1300);
	}
	componentWillUnmount() {
		this.setState({
			isLoaded: false,
			isLoading: true,
			hide: false,
			delete: false
		})
	}
	render() {
		return (
			<PreloaderElement hide={this.state.hide} delete={this.state.delete}>
				<Animation isLoaded={this.state.isLoaded}>
					<Logo src={triangle} />
					<Logo src={line} />
					{/* <HideLine /> */}
				</Animation>
			</PreloaderElement>
		);
	}
}

export default Preloader