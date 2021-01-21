from datetime import date
import datetime
cur_d = date(1976, 8, 1)
end_d = date(2021, 1, 19)
import requests
from bs4 import BeautifulSoup
import json
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
    'Content-Type': 'text/html',
}
gameLinks =[]
while cur_d != end_d:

    y, m, d = cur_d.timetuple()[:3]
    print(m)
    print(y)
    url = "https://www.basketball-reference.com/boxscores/?month=%d&day=%d&year=%d"% (m,d,y)

    response = requests.get(url, headers=headers)
    html = response.text
    # print(html)
    soup = BeautifulSoup(html, 'html.parser')
    links = soup.select("td.gamelink a")
    # print(gameLinks)
    for x in links:
        gameLinks.append(x['href'])
    cur_d += datetime.timedelta(days=1)
    # print(gameLinks)

print(gameLinks)

f = open("boxscoresLinks.txt", "a")
f.write(json.dumps(gameLinks))
f.close()
