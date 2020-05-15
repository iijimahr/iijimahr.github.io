#!/usr/bin/env bash
echo ./gen_sheet_pickle.py
cd ../google_sheets
./gen_sheet_pickle.py
cp presentations.pickle publications.pickle ../work/src
cd -
echo ./compile_all.py
cd src
./compile_all.py
cd -
echo ./compress_html.sh
./compress_html.sh
echo ./update.sh
./update.sh
