import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Grid, Typography, Button } from '@material-ui/core'
import CreateRoomPage from './CreateRoomPage'
import MusicPlayer from './MusicPlayer'

const DIV = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
`

const MarginDIV = styled.div`
	margin: auto
`

export default function Room(props) {
	const [votes, setVotes] = useState(2)
	const [guestsCanPause, setGuestsCanPause] = useState(false)
	const [isHost, setIsHost] = useState(false)
	const [showSettings, setShowSettings] = useState(false)
	const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false)
	const [song, setSong] = useState({})

	let roomCode = props.match.params.roomCode

	const authenticateSpotify = () => {
		fetch('/spotify/is-authenticated')
			.then(response => response.json())
			.then(data => {
				setSpotifyAuthenticated(data.status)
				if (!data.status)
					fetch('/spotify/get-auth-url')
						.then(response => response.json())
						.then(data => {
							window.location.replace(data.url)
						})
			})
	}

	(function getRoomDetails() {
		fetch(`/api/get-room?code=${roomCode}`)
			.then(response => {
				if (!response.ok) {
					props.leaveRoomCallback()
					props.history.push('/')
				}
				return response.json()
			})
			.then(data => {
				setVotes(data.votes_to_skip)
				setGuestsCanPause(data.guest_can_pause)
				setIsHost(data.is_host)
			})
			if (isHost)
				authenticateSpotify()
	})()

	const getCurrentSong = () => {
		fetch('/spotify/current-song')
			.then(response => {
				if (!response.ok)
					return {}
				return response.json()
			})
			.then(data => setSong(data))
	}

	const handleLeaveButtonPressed = () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		}

		fetch('/api/leave-room', requestOptions)
			.then(_response => {
				props.leaveRoomCallback()
				props.history.push('/')
			})
	}

	useEffect(() => {
		let interval = setInterval(getCurrentSong, 1000)
		return () => {
			clearInterval(interval)
		}
	})

	const renderSettingsButton = () => {
		return (
			<Grid item xs={12} align="center">
				<Button variant="contained" color="primary" onClick={() => setShowSettings(true)}>
					Settings
				</Button>
			</Grid>
		)
	}

	const renderSettings = () => {
		return (
			<DIV>
				<Grid container spacing={1}>
					<Grid item xs={12} align="center">
						<CreateRoomPage
							update={true}
							votes={votes}
							guestsCanPause={guestsCanPause}
							roomCode={roomCode}
							updateCallback={null}
						/>
					</Grid>
					<Grid item xs={12} align="center">
						<Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>
							Close
						</Button>
					</Grid>
				</Grid>
			</DIV>
		)
	}
	if (showSettings)
		return renderSettings()
	return (
		<DIV>
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Typography variant="h4" component="h4">
						Code: {roomCode}
					</Typography>
				</Grid>
				<MarginDIV>
					<MusicPlayer {...song} />
				</MarginDIV>
				{isHost ? renderSettingsButton() : null}
				<Grid item xs={12} align="center">
					<Button variant="contained" color="secondary" onClick={handleLeaveButtonPressed}>
						Leave Room
					</Button>
				</Grid>
			</Grid>
		</DIV>
	)
}
