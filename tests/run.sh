#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
workspace="${DIR}/workspace"

[ -d "$workspace" ] && rm -rf "$workspace"
mkdir "$workspace"
cd "$workspace"

npm init -y
npm install --save "${DIR}/.."
clear

PATH="${workspace}/node_modules/.bin:${PATH}"

mkdir "${workspace}/1"
mkdir "${workspace}/1/5908e6"
mkdir "${workspace}/2"
mkdir "${workspace}/2/master"
mkdir "${workspace}/2/6bdabd"
mkdir "${workspace}/3"
mkdir "${workspace}/3/master"
mkdir "${workspace}/3/6bdabd"

ghdl --help >'help.txt'

ghdl --directory-prefix "${workspace}/1/5908e6"                 --url "https://github.com/torvalds/linux/tree/5908e6b738e3357af42c10e1183753c70a0117a9/Documentation/filesystems"

ghdl --directory-prefix "${workspace}/2/master"                 --url "https://github.com/expo/expo/tree/master/docs/static/images"
ghdl --directory-prefix "${workspace}/2/master"                 --url "https://github.com/expo/expo/tree/master/docs/pages/versions/v32.0.0"

ghdl --directory-prefix "${workspace}/2/6bdabd"                 --url "https://github.com/expo/expo/tree/6bdabd4301c12c902d3c85f410a96464e8d8fe9f/docs/static/images"
ghdl --directory-prefix "${workspace}/2/6bdabd"                 --url "https://github.com/expo/expo/tree/6bdabd4301c12c902d3c85f410a96464e8d8fe9f/docs/pages/versions/v32.0.0"

ghdl --output-file      "${workspace}/3/master/images.txt"      --url "https://github.com/expo/expo/tree/master/docs/static/images"
ghdl --output-file      "${workspace}/3/master/v32.0.0.txt"     --url "https://github.com/expo/expo/tree/master/docs/pages/versions/v32.0.0"

ghdl --output-file      "${workspace}/3/6bdabd/images.txt"      --url "https://github.com/expo/expo/tree/6bdabd4301c12c902d3c85f410a96464e8d8fe9f/docs/static/images"
ghdl --output-file      "${workspace}/3/6bdabd/v32.0.0.txt"     --url "https://github.com/expo/expo/tree/6bdabd4301c12c902d3c85f410a96464e8d8fe9f/docs/pages/versions/v32.0.0"
