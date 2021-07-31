import React from 'react'
import { Grid, Typography, Card, IconButton, LinearProgress } from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import SkipNextIcon from '@material-ui/icons/SkipNext'

export default function MusicPlayer(props) {
	const songProgress = (props.time / props.duration) * 100

	const pauseSong = () => {
		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' }
		}
		fetch('/spotify/pause', requestOptions)
	}

	const playSong = () => {
		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' }
		}
		fetch('/spotify/play', requestOptions)
	}

	const skipSong = () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		}
		fetch('/spotify/skip', requestOptions)
	}

	return (
		<Card>
			<Grid container alignItems="center">
				<Grid item xs={4} align="center">
					<img src={props.image_url} height="100%" width="100%" />
				</Grid>
				<Grid item xs={8} align="center">
					<Typography component="h5" variant="h5">
						{props.title}
					</Typography>
					<Typography color="textSecondary" variant="subtitle1">
						{props.artist}
					</Typography>
					<div>
						<IconButton onClick={() => props.is_playing ? pauseSong() : playSong()}>
							{props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
						</IconButton>
						<IconButton onClick={() => skipSong()}>
							<SkipNextIcon />
						</IconButton>
						<Typography component="h5" variant="h5">
							{props.votes} / {props.votes_required}
						</Typography>
					</div>
				</Grid>
			</Grid>
			<LinearProgress variant="determinate" value={songProgress} />
		</Card>
	)
}