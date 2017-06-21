#!/usr/bin/env python
from jinja2 import Template, Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader('.'), trim_blocks=False)
template = env.get_template('index_tpl.html')
disp_text = template.render()
print(disp_text)

# env = Environment(loader=FileSystemLoader('.'))
# # tpl = env.get_template('template.html')
# tpl = env.get_template('index_tpl.html')

# data = {'main_tpl': 'index.tpl.html'}
# # disp_text = tpl.render(data) # 辞書で指定する
# disp_text = tpl.render() # 辞書で指定する

# # 標準出力
# print(disp_text)

# # output file
# tmpfile = open("test.html", 'w')
# tmpfile.write(disp_text)
# tmpfile.close()
