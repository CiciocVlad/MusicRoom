from datetime import timedelta
from spotify.credentials import CLIENT_ID, CLIENT_SECRET
from django.http import response
from .models import SpotifyToken
from django.utils import timezone
from requests import post, put, get


BASE_URL = 'https://api.spotify.com/v1/me/'


def get_user_tokens(session_key):
	user_tokens = SpotifyToken.objects.filter(user=session_key)
	if user_tokens.exists():
		return user_tokens[0]
	return None


def update_or_create_user_tokens(session_key, access_token, token_type, expires_in, refresh_token):
	tokens = get_user_tokens(session_key)
	expires_in = timezone.now() + timedelta(seconds=expires_in)

	if tokens:
		tokens.access_token = access_token
		tokens.refresh_token = refresh_token
		tokens.expires_in = expires_in
		tokens.token_type = token_type
		tokens.save(update_fields=['access_token', 'refresh_token', 'token_type', 'expires_in'])
	else:
		tokens = SpotifyToken(user=session_key, access_token=access_token, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
		tokens.save()


def is_spotify_authenticated(session_id):
	tokens = get_user_tokens(session_id)
	if tokens:
		expiry = tokens.expires_in
		if expiry <= timezone.now():
			refresh_spotify_token(session_id)
		return True
	return False


def refresh_spotify_token(session_id):
	refresh_token = get_user_tokens(session_id).refresh_token

	response = post('https://accounts.spotify.com/api/token', data={
		'grat_type': 'refresh_token',
		'refresh_token': refresh_token,
		'client_id': CLIENT_ID,
		'client_secret': CLIENT_SECRET
	}).json()

	access_token = response.get('access_token')
	token_type = response.get('token_type')
	expires_in = response.get('expires_in')

	update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
	tokens = get_user_tokens(session_id)
	header = {'Content-Type': 'application/json', 'Authorization': f'Bearer {tokens.access_token}'}

	if post_:
		post(BASE_URL + endpoint, headers=header)
	if put_:
		put(BASE_URL + endpoint, headers=header)
	
	response = get(BASE_URL + endpoint, {}, headers=header)
	try:
		return response.json()
	except:
		return {'Error': 'Issue with request'}


def play_song(session_id):
	return execute_spotify_api_request(session_id, 'player/play', put_=True)


def pause_song(session_id):
	return execute_spotify_api_request(session_id, 'player/pause', put_=True)


def skip_song(session_id):
	return execute_spotify_api_request(session_id, 'player/next', post_=True)
