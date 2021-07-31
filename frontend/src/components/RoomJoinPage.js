import { ThemeProvider } from '@material-ui/styles'
import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

const theme = {
	main: 'center'
}

const DIV = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: ${props => props.theme.main};
	align-items: ${props => props.theme.main};
`

export default function RoomJoinPage(props) {
    const [roomCode, setRoomCode] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleTextFieldChange = e => {
	setRoomCode(e.target.value)
    }

    const handleRoomButtonPressed = () => {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			code: roomCode
		})
	}

	fetch('/api/join-room', requestOptions)
		.then(response => {
			if (response.ok)
				props.history.push(`/room/${roomCode}`)
			else
				setErrorMsg('Room not found')
		})
		.catch(console.log)
    }

    return (
	<DIV theme={theme}>
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
				<Typography variant="h4" component="h4">
					Join a Room
				</Typography>   
			</Grid>
			<Grid item xs={12} align="center">
				<TextField
					error={errorMsg}
					label="Code"
					placeholder="Enter A Room Code"
					value={roomCode}
					helperText={errorMsg}
					variant="outlined"
					onChange={handleTextFieldChange}
				/>
			</Grid>
			<Grid item xs={12} align="center">
				<Button variant="contained" color="primary" onClick={handleRoomButtonPressed}>
					Enter Room
				</Button>
			</Grid>
			<Grid item xs={12} align="center">
				<Button variant="contained" color="secondary" to="/" component={Link}>
					Back
				</Button>
			</Grid>
		</Grid>
	</DIV>
    )
}