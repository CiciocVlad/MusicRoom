import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'
import Room from './Room'
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core'
import styled from 'styled-components'

const DIV = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
`

export default function HomePage(props) {
    const [roomCode, setRoomCode] = useState(null)

    useEffect(async () => {
	fetch('/api/user-in-room')
		.then(response => response.json())
		.then(data => {
			setRoomCode(data.code)
		})
    })

    const renderHomePage = () => {
	    return (
		<DIV>
			<Grid container spacing={3}>
				<Grid item xs={12} align="center">
					<Typography variant="h3" compact="h3">
						House Party
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<ButtonGroup disableElevation variant="contained" color="primary">
						<Button color="primary" to="/join" component={Link}>
							Join Room
						</Button>
						<Button color="secondary" to="/create" component={Link}>
							Create Room
						</Button>
					</ButtonGroup>
				</Grid>
			</Grid>
		</DIV>
	    )
    }

    const clearRoomCode = () => {
	    setRoomCode(null)
    }

    return (
        <Router>
            <Switch>
                <Route exact path='/' render={() => roomCode ? <Redirect to={`/room/${roomCode}`}/> : renderHomePage()} />
                <Route path='/join' component={RoomJoinPage} />
                <Route path='/create' component={CreateRoomPage} />
		<Route path='/room/:roomCode' render={props => <Room {...props} leaveRoomCallback={clearRoomCode} />} />
            </Switch>
        </Router>
    )
}
