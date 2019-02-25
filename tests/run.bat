@echo off

set DIR=%~dp0.
set workspace=%DIR%\workspace

if exist "%workspace%" rmdir /Q /S "%workspace%"
mkdir "%workspace%"
cd "%workspace%"

call npm init -y
call npm install --save "%DIR%\.."
cls

set PATH=%workspace%\node_modules\.bin;%PATH%

mkdir "%workspace%\1"
mkdir "%workspace%\1\5908e6"
mkdir "%workspace%\2"
mkdir "%workspace%\2\master"
mkdir "%workspace%\2\6bdabd"
mkdir "%workspace%\3"
mkdir "%workspace%\3\master"
mkdir "%workspace%\3\6bdabd"

call ghdl --help >"help.txt"

call ghdl --directory-prefix "%workspace%\1\5908e6"                 --url "https://github.com/torvalds/linux/tree/5908e6b738e3357af42c10e1183753c70a0117a9/Documentation/filesystems"

call ghdl --directory-prefix "%workspace%\2\master"                 --url "https://github.com/expo/expo/tree/master/docs/static/images"
call ghdl --directory-prefix "%workspace%\2\master"                 --url "https://github.com/expo/expo/tree/master/docs/pages/versions/v32.0.0"

call ghdl --directory-prefix "%workspace%\2\6bdabd"                 --url "https://github.com/expo/expo/tree/6bdabd4301c12c902d3c85f410a96464e8d8fe9f/docs/static/images"
call ghdl --directory-prefix "%workspace%\2\6bdabd"                 --url "https://github.com/expo/expo/tree/6bdabd4301c12c902d3c85f410a96464e8d8fe9f/docs/pages/versions/v32.0.0"

call ghdl --output-file      "%workspace%\3\master\images.txt"      --url "https://github.com/expo/expo/tree/master/docs/static/images"
call ghdl --output-file      "%workspace%\3\master\v32.0.0.txt"     --url "https://github.com/expo/expo/tree/master/docs/pages/versions/v32.0.0"

call ghdl --output-file      "%workspace%\3\6bdabd\images.txt"      --url "https://github.com/expo/expo/tree/6bdabd4301c12c902d3c85f410a96464e8d8fe9f/docs/static/images"
call ghdl --output-file      "%workspace%\3\6bdabd\v32.0.0.txt"     --url "https://github.com/expo/expo/tree/6bdabd4301c12c902d3c85f410a96464e8d8fe9f/docs/pages/versions/v32.0.0"

cd ..
