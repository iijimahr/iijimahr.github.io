#!/usr/bin/env bash
files=()
files+=('index.html')
files+=('publications.html')
files+=('presentations.html')
files+=('gallery.html')
tmp_file='tmp.html'
for file in "${files[@]}"
do
    echo compress ${file}
    rm -f ${tmp_file}
    html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true ${file} > ${tmp_file}
    mv ${tmp_file} ${file}
done
