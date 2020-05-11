#! /bin/sh -ex

mkdir -p public
cp -r static public/
minify main.css > public/static/main.min.css
minify main.js > public/static/main.min.js
minify data.js > public/static/data.min.js
cd public
awk -F\" '/HASH/ { "openssl dgst -sha512 -binary < " $2 " | openssl enc -base64 -A" | getline hash; sub(/HASH/, hash) } { print }' < ../index.html > index.html
