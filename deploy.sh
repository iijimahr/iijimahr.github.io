#!/usr/bin/env bash
echo ./compile_all.py
cd src
./compile_all.py
cd -
echo ./compress_html.sh
./compress_html.sh
echo ./update.sh
./update.sh