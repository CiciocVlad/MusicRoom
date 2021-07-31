import React, { useState } from 'react'
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel } from '@material-ui/core'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Collapse } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export default function CreateRoomPage(props) {
    const [votes, setVotes] = useState(props.votes ?? 2)
    const [guestsCanPause, setGuestsCanPause] = useState(props.guestsCanPause ?? false)
    const [update, setUpdate] = useState(props.update ?? false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const DIV = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
    `

    const handleVotesChange = e => {
	setVotes(e.target.value)
    }

    const handleGuestsCanPauseChange = e => {
	setGuestsCanPause(e.target.value === 'true')
    }

    const handleRoomButtonPressed = () => {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			votes_to_skip: votes,
			guest_can_pause: guestsCanPause
		})
	}
	fetch('/api/create-room', requestOptions).then(response => response.json())
		.then(data => props.history.push('/room/' + data.code))
    }

    const handleUpdateButtonPressed = () => {
	const requestOptions = {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			votes_to_skip: votes,
			guest_can_pause: guestsCanPause,
			code: props.roomCode
		})
	}
	fetch('/api/update-room', requestOptions)
		.then(response => {
			if (response.ok)
				setSuccessMsg('Room updated successfully')
			else
				setErrorMsg('Could not update room')
		})
    }

    const renderBackButton = () => {
	    return (
		<Grid item xs={12} align='center'>
			<Button color='secondary' variant='contained' to='/' component={Link}>
				Back
			</Button>
		</Grid>
	    )
    }

    const title = update ? 'Update A Room' : 'Create A Room'

    const renderForm = () => {
	    return (
		<Grid container spacing={1}>
		<Grid item xs={12} align="center">
			<Collapse in={successMsg != '' || errorMsg != ''}>
				{successMsg != '' ? <Alert severity="success" onClose={() => setSuccessMsg('')}>
							{successMsg}
						    </Alert>
						   : <Alert severity="error" onClose={() => setErrorMsg('')}>
							{errorMsg}
						     </Alert>}
			</Collapse>
		</Grid>
		<Grid item xs={12} align='center'>
			<Typography component='h4' variant='h4'>
				{title}
			</Typography>
		</Grid>
		<Grid item xs={12} align='center'>
			<FormControl component='fieldset'>
			<FormHelperText>
				<div align='center'>
				Guest Control of Playback State
				</div>
			</FormHelperText>
			<RadioGroup row defaultValue={guestsCanPause.toString()} onChange={handleGuestsCanPauseChange}>
				<FormControlLabel value='true' control={<Radio color='primary' />} label='Play/Pause' labelPlacement='bottom' />
				<FormControlLabel value='false' control={<Radio color='secondary' />} label='No Control' labelPlacement='bottom' />
			</RadioGroup>
			</FormControl>
		</Grid>
		<Grid item xs={12} align='center'>
			<FormControl>
			<TextField required={true} type='number' onChange={handleVotesChange} defaultValue={votes} inputProps={{
				min: 1,
				style: { textAlign: 'center' }
			}} />
			<FormHelperText>
				<div align='center'>
				Votes Required to Skip Song
				</div>
			</FormHelperText>
			</FormControl>
		</Grid>
		<Grid item xs={12} align='center'>
			<Button color='primary' variant='contained' onClick={update ? handleUpdateButtonPressed : handleRoomButtonPressed}>
				{title}
			</Button>
		</Grid>
		{!update ? renderBackButton() : null}
		</Grid>
	    )
    }

    if (update)
    	return renderForm()
    return (
	    <DIV>
		    {renderForm()}
	    </DIV>
    )
}