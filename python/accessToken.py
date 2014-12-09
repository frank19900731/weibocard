from snspy import APIClient
from snspy import SinaWeiboMixin
import ConfigParser

config = ConfigParser.ConfigParser()
config.read('config.ini')
APP_KEY = config.get("sinawb", 'APP_KEY')  # app key
APP_SECRET = config.get('sinawb', 'APP_SECRET')  # app secret
CALLBACK_URL = config.get('sinawb', 'CALLBACK_URL')  # callback url
client = APIClient(SinaWeiboMixin, app_key=APP_KEY, app_secret=APP_SECRET, redirect_uri=CALLBACK_URL)

print client.get_authorize_url()
code = raw_input('Enter code >')

r = client.request_access_token(code)
config.set('sinawb', 'code', code)
config.set('sinawb', 'access_token', r.access_token)
config.set('sinawb', 'expires', r.expires)
config.write(open("config.ini", "w"))