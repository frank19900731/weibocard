#coding: UTF-8
from snspy import APIClient
from snspy import SinaWeiboMixin
import pymongo
from pymongo import Connection
import datetime
import cStringIO, urllib2
try:
    from PIL import Image
except ImportError:
    import Image
import re
import string
import time
import jieba

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

# fetch your favorite statuses 
# http://open.weibo.com/wiki/2/statuses/show
# http://open.weibo.com/wiki/2/favorites
# for detailed key-value pairs, refer to example/weibo.txt 
def grabFavorites(client, collection, start_page=1, total_page=1, count_per_page=50, time_sleep=5, query_mid_type=1):
    while (total_page > 0):
        r = client.favorites.get(page=start_page,count=count_per_page) # call favorites api
        if len(r.favorites) == 0:
            break
        for st in r.favorites:
            # http://open.weibo.com/wiki/2/statuses/querymid
            mid = client.statuses.querymid.get(id=st.status.id,type=query_mid_type) # call statuses/querymid api
            insertStatus(collection, st, mid)

        print str(start_page) + " # completed!"
        time.sleep(time_sleep) # sleep for time_sleep seconds, default 5s
        total_page -= 1
        start_page += 1

# http://api.mongodb.org/python/2.0.1/tutorial.html
# insert status into db
def insertStatus(collection, st, mid):
    st['_id'] = st.status.id # mongodb key
    st['yamid'] = mid['mid'] # message id
    st['pytime'] = convertTime(st.status.created_at)

    if st['status'].has_key('original_pic'):
        size = getSize(st['status']['original_pic'])
        st['status']['original_img_size'] = size

    if st['status'].has_key('retweeted_status'):
        if st['status']['retweeted_status'].has_key('original_pic'):
            size = getSize(st['status']['retweeted_status']['original_pic'])
            st['status']['retweeted_status']['original_img_size'] = size

    if st.status.has_key('user') & mid.has_key('mid'): # original link of thep post
        st['original_weibo_link'] = "http://weibo.com/" + str(st.status.user.id) + "/" + mid['mid']
    collection.insert(st)

# extract from a status key-value pairs for visualization
def process(st):
    # search context, namely tags, text, poster_name, retweet_text, retweet_poster_name
    raw_content = ""
    # store poster_name, retweet_poster_name, tags if exists
    fixed_content = ""

    dic = {}
    dic['post_time'] = st['pytime'].strftime('%Y-%m-%d') # format the python datetime object
    dic['original_link'] = st['original_weibo_link'] # the original weibo link
    if len(st['tags']) != 0:
        dic['tags'] = extractTags(st['tags'])
        raw_content += dic['tags']

    r = st['status'] # status
    raw_content += r['text']
    dic['text'] = convertUrl(r['text'])

    if r.has_key('original_pic'):
        dic['img_url'] = r['original_pic']
        dic['img_size'] = size2Str(r['original_img_size'])
    if r.has_key('user'):
        dic['poster_name'] = '@' + r['user']['screen_name']
        raw_content += dic['poster_name'][1:]
        fixed_content += dic['poster_name'][1:]
        dic['poster_link'] = 'http://weibo.com/' + str(r['user']['id'])
        dic['profile_photo'] = r['user']['profile_image_url']

    if r.has_key('retweeted_status'):
        r = r['retweeted_status']
        raw_content += r['text']
        dic['retweet_text'] = convertUrl(r['text'])
        if r.has_key('original_pic'):
            dic['retweet_img_url'] = r['original_pic']
            dic['retweet_img_size'] = size2Str(r['original_img_size'])
        if r.has_key('user'):
            dic['retweet_poster_name'] = '@' + r['user']['screen_name']
            raw_content += dic['retweet_poster_name'][1:]
            fixed_content += " " + dic['retweet_poster_name'][1:]
            dic['retweet_poster_link'] = 'http://weibo.com/' + str(r['user']['id'])

    dic['search_field'] = fixed_content + " " + wordParse(raw_content)

    return dic

# size to str
def size2Str(size):
    return str(size[0]) + "," + str(size[1])

# convert time string to python datetime
def convertTime(timeStr):
    # 'Mon Feb 21 23:19:07 +0800 2011'
    return datetime.datetime.strptime(timeStr[0:20] + timeStr[-4:],'%a %b %d %H:%M:%S %Y')

# fetch the size of a remote image 
def getSize(url):
    im = Image.open(cStringIO.StringIO(urllib2.urlopen(url).read()))
    return im.size

# convert url to link in status text
def convertUrl(text):
    urls = re.findall(r'http[s]?\://[a-zA-Z0-9\.\?/&\=\:]+', text)
    urlset = set()
    for url in urls:
        if url in urlset:
            continue
        urlset.add(url)
        text = text.replace(url, '<a href="' + url + '" target="_blank">' + url + '</a>')
    return text

# delete the url link in status text
def deleteUrl(text):
    urls = re.findall(r'http[s]?\://[a-zA-Z0-9\.\?/&\=\:]+', text)
    urlset = set()
    for url in urls:
        if url in urlset:
            continue
        urlset.add(url)
        text = text.replace(url, '')
    return text

# extract tag string from tags list
def extractTags(tags):
    list = ""
    for tag in tags:
        list += ", " + tag['tag']
    return list[2:]

# eliminate pure number
NUMERIC_MATCHER = re.compile("[0-9]+")
# English and Chinese Punctuations
PUNCTUATIONS = string.punctuation + string.whitespace + '...，。、《》：；（）-￥？！——……【】“”‘’'

# filter out item that is punctuation or pure number
def punctuationFilter(x):
    return (PUNCTUATIONS.find(x) < 0) and (NUMERIC_MATCHER.match(x) == None)

# word segmentation of status text
def wordParse(str):
    seg_list = jieba.cut_for_search(deleteUrl(str))
    return " ".join(filter(punctuationFilter, seg_list))