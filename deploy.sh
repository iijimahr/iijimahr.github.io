#!/usr/bin/env bash
cd src
./compile_all.py
cd -
./compress_html.sh
./update.sh
