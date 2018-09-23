#!/usr/bin/env bash
echo 'cd src; ./compile_all.py; cd -'
cd src; ./compile_all.py; cd -
./compress_html.sh
./update.sh
