import requests
from bs4 import BeautifulSoup
import json
# import json
import pymongo

from pymongo import MongoClient
from pymongo import ReturnDocument
client = MongoClient()

db = client['basketball-reference']



with open('boxscoresLinks.txt') as f:
  data = json.load(f)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
    'Content-Type': 'text/html',
}

def getPlayers(souper, teamcode):
	team = {}
	team['code'] = teamcode
	team['players'] = []
	boxScore = souper.select('#box-' + teamcode.upper() + '-game-basic tbody tr')
	for i in boxScore:
		player = {"name":"", "_id":""}
		nameLink = i.select('a')
		
		if len(nameLink)> 0:
			player['name'] = nameLink[0].text
		th = i.select('th.left')

		if len(th)> 0:
			player['_id'] = th[0]['data-append-csv']

		minutes = i.select('td[data-stat="mp"]')
		if len(minutes)>0 and player['name'] != "":
			team['players'].append(player)

	return team


def addToDB(team):
	for index, player1 in enumerate(team['players']):
		for player2 in team['players'][index+1:]:
			if player1['_id'] > player2['_id']:
				playerString =  player2['_id'] + "|" + player1['_id']
			else:
				playerString =  player1['_id'] + "|" + player2['_id']
			findObj = { 'players': playerString }
			updateObj = { '$set': {'players': playerString, 'team': team['code']}}
			# opt =  { 'upsert': True, 'new': True }
			result = db.connections.find_one_and_update(findObj, updateObj, upsert=True, return_document=ReturnDocument.AFTER)
			print(result)            
			players = result['players'].split('|')
			findObj = {"_id": players[0]}
			updateObj = {"$set":{"team":result['team']}, "$addToSet":{"connections":result['_id']}}
			db.players.find_one_and_update(findObj, updateObj, return_document = ReturnDocument.AFTER)
			findObj = {"_id": players[1]}
			db.players.find_one_and_update(findObj, updateObj, return_document = ReturnDocument.AFTER)














for i in data:
	url = "https://www.basketball-reference.com" + i
	response = requests.get(url, headers=headers)
	html = response.text
	soup = BeautifulSoup(html, 'html.parser')

	teams = []
	teamLinks = soup.select(".in_list a")
	for teamLink in teamLinks[:2]:
		teamcode = teamLink['href'].replace("/teams/", "")[:3].lower()
		teams.append(teamcode)
	team1 = getPlayers(soup, teams[0])
	team2 = getPlayers(soup, teams[0])
	addToDB(team1)
	addToDB(team2)








