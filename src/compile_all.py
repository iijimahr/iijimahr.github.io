#!/usr/bin/env python


####
#### read tabulated data
####
def read_table(fname):
    import pickle
    with open(fname, 'rb') as sheet:
        values = pickle.load(sheet)
        header = values[0]
        data = values[1:]
        dicts = []
        for row in data:
            dicts.append({
                hh:rr for hh,rr in zip(header,row)
            })
    return dicts


####
#### highlight my name
####
def highlight_me(names):
    return names.replace('H. Iijima','<b>H. Iijima</b>')
    

####
#### compile html by the template engine Jinja2
####
def compile_html(fname):
    from jinja2 import Template, Environment, FileSystemLoader

    # read tabulated data
    presentations = read_table('presentations.pickle')
    publications = read_table('publications.pickle')

    # render HTML text
    env = Environment(loader=FileSystemLoader('.'), trim_blocks=False)
    env.filters['highlight_me'] = highlight_me
    template = env.get_template(fname+'_tpl.html')
    disp_text = template.render(
        presentations=presentations,
        publications=publications
    )

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
compile_html('gallery')
