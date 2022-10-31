import http.client
import xmltodict, json

conn = http.client.HTTPSConnection("api.sportradar.us")

conn.request("GET", "/nba/trial/v7/en/games/2022/01/22/schedule.xml?api_key=c8fjaz8ndx3x5t4b8n3n7dfz")

res = conn.getresponse()
data = res.read()

o = xmltodict.parse(data)

print(json.dumps(o))