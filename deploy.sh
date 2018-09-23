#!/usr/bin/env bash
echo ./compile_all.py
cd src; ./compile_all.py; cd -
./compress_html.sh
./update.sh
