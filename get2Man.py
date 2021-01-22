import requests
from bs4 import BeautifulSoup, Comment
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


for i in data:
	url = 'https://www.basketball-reference.com/' +i
	response = requests.get(url, headers=headers)
	html = response.text
	# print(html)
	soup = BeautifulSoup(html, 'html.parser')
	for comments in soup.findAll(text=lambda text:isinstance(text, Comment)):
	    comments.extract()
	    if "div_lineups-2-man" in comments:
	    	# print(comments)
	    	newSoup = BeautifulSoup(comments, 'html.parser')
	    	two_man = newSoup.find(id="div_lineups-2-man")
	    	dataStatLineup = two_man.select('td[data-stat="lineup"]')
	    	for x in dataStatLineup:
	    		print(x['csk'])
	    		if x['csk'] != "Player Average":
	    			players = x['csk'].split(":")
	    			player1 = players[0]
	    			player2 = players[1] 
	    			if player1 > player2:
	    				playerString =  player2 + "|" + player1
	    			else:
	    				playerString =  player1 + "|" + player2
	    			findObj = { 'players': playerString }
	    			updateObj = { '$set': {'players': playerString}}
	    			result = db.connections.find_one_and_update(findObj, updateObj, upsert=True, return_document=ReturnDocument.AFTER)
	    			print(result)
	    			players = result['players'].split('|')
	    			findObj = {"_id": players[0]}
	    			updateObj = { "$addToSet":{"connections":result['_id']}}
	    			db.players.find_one_and_update(findObj, updateObj, return_document = ReturnDocument.AFTER)
	    			findObj = {"_id": players[1]}
	    			db.players.find_one_and_update(findObj, updateObj, return_document = ReturnDocument.AFTER)


    	# print(comments.find(id="div_lineups-2-man"))

# two_man = soup.find(id="div_lineups-2-man")
# print(two_man)
# dataStatLineup = two_man.select('td[data-stat="lineup"]')
# for x in dataStatLineup:
# 	print(x['csk'])


# # for i in data:
# 	url = "https://www.basketball-reference.com" + i
# 	response = requests.get(url, headers=headers)
# 	html = response.text
# 	soup = BeautifulSoup(html, 'html.parser')

# 	teams = []
# 	teamLinks = soup.select(".in_list a")
# 	for teamLink in teamLinks[:2]:
# 		teamcode = teamLink['href'].replace("/teams/", "")[:3].lower()
# 		teams.append(teamcode)
# 	team1 = getPlayers(soup, teams[0])
# 	team2 = getPlayers(soup, teams[0])
# 	addToDB(team1)
# 	addToDB(team2)
