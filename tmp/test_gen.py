#!/usr/bin/env python
from jinja2 import Template, Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader('.'))
tpl = env.get_template('sample.html')

data = {'name': 'Kuro', 'lang': 'Python'}
disp_text = tpl.render(data) # 辞書で指定する

# 標準出力
# print(disp_text)

# ファイルへの書き込み
tmpfile = open("generate.html", 'w')
tmpfile.write(disp_text)
tmpfile.close()
