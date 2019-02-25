const help = `
usage:
======
ghdl <options>

options:
========
"-h"
"--help"
    Print a help message describing all "Github Downloader" command-line options.

"-V"
"--version"
    Display the version of "Github Downloader".

"-u <URL>"
"--url <URL>"
    Specify the URL to download.
    example:
      --url "https://github.com/torvalds/linux/tree/5908e6b738e3357af42c10e1183753c70a0117a9/Documentation/filesystems"
    where:
      * "torvalds"
          - is the name of the github user
      * "linux"
          - is the name of the repo
      * "5908e6b738e3357af42c10e1183753c70a0117a9"
          - is the commit SHA
      * "/Documentation/filesystems"
          - is the path to a directory within the repo (at the given commit)

"-P <dirpath>"
"--directory-prefix <dirpath>"
    Specifies the directory where all file downloads will be saved to.
    The default is "." (the current directory).

"-nc"
"--no-clobber"
    Indicates that a file download should not occur when the filepath to where it would be saved already exists.
    The default behavior is to delete the existing file and download the new file in its place.

"-o <filepath>"
"--output-file <filepath>"
    Specifies where to save a text file containing the list of all download file URLs,
    and corresponding relative output directory paths.
    The file format is compatible with "node-request-cli" (github.com/warren-bank/node-request-cli).
    Downloading of the file URLs does not occur.
`

module.exports = help
