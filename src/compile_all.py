#!/usr/bin/env python
from jinja2 import Template, Environment, FileSystemLoader

fname_main = 'index'

env = Environment(loader=FileSystemLoader('.'), trim_blocks=False)
template = env.get_template(fname_main+'_tpl.html')
disp_text = template.render()

# # stdout
# print(disp_text)

# output file
f = open('../'+fname_main+'.html', 'w')
f.write(disp_text)
f.close()
