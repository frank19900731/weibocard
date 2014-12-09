weibocard
=========

##简介

平时自己会有一些微博（新浪）收藏，不过基本上收藏了不再看，感觉微博收藏翻页比较麻烦。

后来在收藏的同时，自己会把微博内容、图片拷贝到笔记里。不过积累多了，查询起来麻烦，也缺乏可视化展示。

再后来产生了做一个瀑布流布局的微博卡片式展示页面的想法，就是本项目。

项目代码简单粗糙，效果可见 [Demo](http://frank19900731.github.io/weibocard-demo/) 。

更多复杂的页面定制和搜索查询功能还请自行实现。

##用法 

###申请新浪微博的 Key 与 Secret

在 [微博开放平台](http://open.weibo.com/) 创建应用，获得 Key、Secret，填写 callback_url，具体方法网上有 [介绍](http://www.baidu.com/s?wd=%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E8%8E%B7%E5%8F%96%E7%9A%84appkey&rsv_spt=1&issp=1&f=8&rsv_bp=0&rsv_idx=2&ie=utf-8&tn=16046049_dg&rsv_enter=1&rsv_sug3=1&rsv_sug2=0&inputT=142)。添加自己的微博账号作为测试用户，应用无需提交审核，保持测试授权即可，仅 [访问频次有影响](http://open.weibo.com/wiki/%E6%8E%A5%E5%8F%A3%E8%AE%BF%E9%97%AE%E9%A2%91%E6%AC%A1%E6%9D%83%E9%99%90)。

将 Key、Secret、callback_url 写入 config.ini 文件。

###安装mongodb 

For Ubuntu:

```
sudo apt-get install mongodb mongodb-clients
```

mongo 的简单用法

终端输入 mongo 进入数据库连接

```
# 显示所有数据库
show dbs
# 切换到数据库
use weibodb
# 显示数据库下所有 Collections
show collections
# 显示 favorites 这一 Collection 中数据条数
db.favorites.count()
# 在 favorites 这一 Collection 中进行查询
db.favorites.find({'_id': 3780707769508128})
```

用这几个命令行就差不多了……

更多平台安装方法和命令行请见 [官方文档](http://docs.mongodb.org/manual/)。

###安装相关的包

```
pip install pymongo
pip install PIL
```

or

```
easy_install pymongo
easy_install PIL
```

or

到 [pymongo官网](http://api.mongodb.org/python/current/)、[PIL官网](http://www.pythonware.com/products/pil/) 下载安装。

还用到了 [sinaweibopy](http://github.liaoxuefeng.com/sinaweibopy/)，只有两个 py 文件，直接包含在本项目中。

###运行

```
cd python
# 获取 Access Token
# 复制产生链接到浏览器，页面会重定向到 http://apps.weibo.com/appname?code=XXX
# appname 是你在创建新浪微博应用时设定的站内应用地址，把 XXX 拷贝下来作为程序输入，也就是 Enter code >XXX
# 一定要拷贝，虽然有的终端自动为你加链接，但可能是错误的
python accessToken.py

# 抓取收藏的微博
# （可）修改 config.ini 设置
# fav_start_page 从收藏的第几页开始抓
# fav_count_per_page 每页多少微博
# fav_total_page 共抓取多少页
python weiboGrabber.py

# 生成 json 文件供网页展示
# 修改 config.ini 设置
# start 微博发布的起始时间
# end 微博发布的截止时间
# json 文件输出路径，默认是 html/json/2014.json
python generateJson.py
```

将 html 文件夹拷贝到一个网页服务器（apache 等）上，访问可得结果。如果仅在本地文件系统访问，会因为加载 json 文件而出现跨域错误。
