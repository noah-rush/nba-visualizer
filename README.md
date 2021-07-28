# Six Degrees of Kevin Durant

## About 
Six Degrees of Kevin Durant allows users to visualize connections between NBA players. Clicking on a player shows all of historical teammates. Users can also search or view by teams. Players are grouped by their last or most current team. At the top right, users can also visually multiple layers of connection.

![Screenshot from 2021-07-28 12-59-18](https://user-images.githubusercontent.com/7725659/127364974-d4f053ed-159d-4998-bcad-f3908e1a5312.png)



## Specs
Six Degrees is built using react and express, and is currently deployed to heroku. All data comes from https://www.basketball-reference.com/, and uses both 2 player stats as well as box-score investigations. The data is stored in a Mongo Database. The visualization was made with D3, specifically using its very useful pack layout (https://d3-wiki.readthedocs.io/zh_CN/master/Pack-Layout/). 

## Todo
The visualization is a little large and unwieldy, would like to add a feature that finds a path between two players within the large visualization a lot like this app (https://ginoreyes.me/nbasixdegrees/). (I swear I arrived at the name independently as well.) It would be cool to add 2 player, or even more player combined stats, and to replace the image not found placeholder with something that looks a little better. Also, the visualization is not responsive. 




