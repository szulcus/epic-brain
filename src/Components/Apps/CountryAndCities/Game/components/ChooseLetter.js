// BASIC
import React, { Component } from 'react'
import styled from 'styled-components'
// ICONS
import {FaPlayCircle} from 'react-icons/fa'

const ChooseLetterComponent = styled.div`
	width: 150px;
	height: 150px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--color-main);
	font-size: 70px;
	font-weight: bold;
	color: var(--color-bg);
	text-transform: uppercase;
	border-radius: 100%;
	overflow: hidden;
	:hover {
		cursor: pointer;
	}
`
const Play = styled(FaPlayCircle)`
	font-size: 140px;
`

class ChooseLetter extends Component {
	state = {
		index: 'nope',
		running: false,
		alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'ł', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'w', 'z', 'ź', 'ż']
	}
	componentDidMount() {
		
	}
	run = () => {
		this.setState(prevState => ({
			index: prevState.index + 1 <= this.state.alphabet.length ? prevState.index + 1 : 0
		}));
	}
	start = () => {
		this.props.setChoosing(true);
		this.choose = setInterval(this.run, 50);
		this.setState({running: true})
	}
	stop = () => {
		this.props.setChoosing(false);
		clearInterval(this.choose);
		setTimeout(() => this.props.back(this.state.alphabet[this.state.index]), 500);
	}
	render() {
		return (
			<ChooseLetterComponent>
				{this.state.index === 'nope' ? <Play onClick={this.start} /> : <span onClick={this.stop}>{this.state.alphabet[this.state.index]}</span>}
			</ChooseLetterComponent>
		);
	}
}

export default ChooseLetter