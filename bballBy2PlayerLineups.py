import requests
from bs4 import BeautifulSoup
import json
# import json
import pymongo

from pymongo import MongoClient
from pymongo import ReturnDocument
client = MongoClient()

db = client['basketball-reference']

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
    'Content-Type': 'text/html',
}
lineupLinks = []


# with open('boxscoresLinks.txt') as f:
players = db.players.find()
player = next(players)
while(player):
	url = 'https://www.basketball-reference.com/players/%s/%s.html' %(player['_id'][0], player['_id'])
	response = requests.get(url, headers=headers)
	html = response.text
	soup = BeautifulSoup(html, 'html.parser')
	lineupMenu =  soup.find(text="Player lineups")
	if lineupMenu and player['name']:
		lineupMenu = lineupMenu.parent.findNext('ul')
		print(player['name'])
		links = lineupMenu.select("a")
		for i in links:
			lineupLinks.append(i['href'])
	player = next(players, False)

f = open("boxscoresLinks.txt", "a")
f.write(json.dumps(lineupLinks))
f.close()




