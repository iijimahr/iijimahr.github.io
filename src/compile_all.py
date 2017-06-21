#!/usr/bin/env python
from jinja2 import Template, Environment, FileSystemLoader

####
#### compile html by the template engine Jinja2
####
def compile_html(fname):
    env = Environment(loader=FileSystemLoader('.'), trim_blocks=False)
    template = env.get_template(fname+'_tpl.html')
    disp_text = template.render()

    # output file
    f = open('../'+fname+'.html', 'w')
    f.write(disp_text)
    f.close()

####
#### main
####
compile_html('index')
compile_html('presentations')
compile_html('publications')
