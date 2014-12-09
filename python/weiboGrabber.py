from snspy import APIClient
from snspy import SinaWeiboMixin
import pymongo
from pymongo import Connection
import utils as UT
import ConfigParser

# read config file
config = ConfigParser.ConfigParser()
config.read('config.ini')

# connect to mongodb
hostname = config.get('mongodb', 'hostname')
port = int(config.get('mongodb', 'port'))
connection = Connection(hostname, port)
db = connection.weibodb # weibodb database
collection = db.favorites # favorites collection

# OAUTH
APP_KEY = config.get("sinawb", 'APP_KEY')  # app key
APP_SECRET = config.get('sinawb', 'APP_SECRET')  # app secret
CALLBACK_URL = config.get('sinawb', 'CALLBACK_URL')  # callback url
access_token = config.get('sinawb', 'access_token')
expires = (int)(config.get('sinawb', 'expires'))
client = APIClient(SinaWeiboMixin, app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL
        , access_token=access_token, expires=expires)

# grab your favorite weibo
start_page = int(config.get('sinawb', 'fav_start_page'))
total_page = int(config.get('sinawb', 'fav_total_page'))
fav_count_per_page = int(config.get('sinawb', 'fav_count_per_page'))
time_sleep = int(config.get('sinawb', 'time_sleep'))
query_mid_type = int(config.get('sinawb', 'query_mid_type'))
UT.grabFavorites(client, collection, start_page, total_page, fav_count_per_page, time_sleep, query_mid_type)