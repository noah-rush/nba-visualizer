
import requests
from bs4 import BeautifulSoup
import json
import pymongo

from pymongo import MongoClient
from pymongo import ReturnDocument
client = MongoClient()

db = client['basketball-reference']

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
    'Content-Type': 'text/html',
}
gameLinks =[]

players = db.players.find()
player = next(players)
while(player):
    url = 'https://www.basketball-reference.com/players/%s/%s.html' %(player['_id'][0], player['_id'])
    response = requests.get(url, headers=headers)
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
    allSeasons =  soup.select("#per_game tbody tr")
    playerId = player['_id']
    # for i in perGame:
    print(url)
    # print(lastSeason)
    # print(lastSeason['id'])
    active = False
    success = False
    i = -1
    lastSeason = allSeasons[i]
    while not success:
        try:
            if lastSeason['id'] == "per_game.2021":
                active = True
            team = lastSeason.select('td[data-stat="team_id"] a')[0].text.lower()
            print(team)
            print(lastSeason['id'])
            success = True
        except KeyError:
            i -= 1
            lastSeason = allSeasons[i] 

    findObj = {"_id": playerId
    }
    updateObj = { "$set":{"team":team, "active": active}}
    result = db.players.find_one_and_update(findObj, updateObj, return_document = ReturnDocument.AFTER)
    print(result)
    player = next(players, False)

