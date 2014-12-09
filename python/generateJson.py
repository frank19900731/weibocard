import pymongo
from pymongo import Connection
import ConfigParser
import datetime
import json
import utils as UT

# read config file
config = ConfigParser.ConfigParser()
config.read('config.ini')

# connect to mongodb
hostname = config.get('mongodb', 'hostname')
port = int(config.get('mongodb', 'port'))
connection = Connection(hostname, port)
db = connection.weibodb # weibodb database
collection = db.favorites # favorites collection

# query from start time to end time
start = datetime.datetime.strptime(config.get('json', 'start'),'%Y-%m-%d')
end = datetime.datetime.strptime(config.get('json', 'end'),'%Y-%m-%d')
print start
print end
rs = collection.find({"pytime": {"$lt": end, "$gt": start}}).sort("pytime", pymongo.DESCENDING)
print "totally " + str(rs.count()) + " statuses"

# convert to json format
arr = [] # hold status
delCount = 0 # count the number of deleted status
for r in rs:
    if r['status'].has_key('deleted'):
        delCount += 1
        continue
    arr.append(UT.process(r)) # process status for dict

# output json file    
dataStr = json.dumps(arr) # convert to json format
f = open(config.get('json', 'filename'), 'w')
f.write(dataStr)
f.close()

if delCount > 0:
    print str(delCount) + " deleted"