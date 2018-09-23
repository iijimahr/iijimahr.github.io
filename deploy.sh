#!/usr/bin/env bash
cd src
./compile_all.py
cd -
./compress_html.py
./update.sh
