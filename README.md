### [Github Downloader](https://github.com/warren-bank/node-github-downloader-cli)

Command-line utility to recursively download a directory from a repo on GitHub without needing to clone the entire project.

#### Installation:

```bash
npm install --global @warren-bank/node-github-downloader-cli
```

#### Methodology:

* [GitHub REST API v3](https://developer.github.com/v3/repos/contents/) is used to obtain metadata about the repo contents beginning at the desired path within the tree belonging to the desired commit
  * the tree is walked
    * directories are queried for additional metadata about the nested contents
    * files are downloaded to a path relative to the desired output directory

#### Usage:

```bash
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
```

#### Example:

* [this test script](https://github.com/warren-bank/node-github-downloader-cli/blob/master/tests/run.sh) is a good introduction

#### Requirements:

* Node.js version: v8.6.0 (and higher)
  - transitive [dependency](https://github.com/warren-bank/node-github-downloader-cli/blob/master/package.json#L12) requirements:
    * v8.06.00+: [`@warren-bank/node-request`](https://github.com/warren-bank/node-request#requirements)

- - - -

#### Other Similar Tools:

* [github-files-fetcher](https://github.com/Gyumeijie/github-files-fetcher)
  * command-line
  * looks great
    * ..wish I found this tool before spending an evening writing my own
* [DownGit](https://github.com/minhaskamal/DownGit)
  * [single-page web app](https://minhaskamal.github.io/DownGit/#/home)
  * works great
* [GitZip](https://github.com/kinolien/gitzip/)
  * [single-page web app](http://kinolien.github.io/gitzip/)
* [GitHub Folder Downloader](https://github.com/VahidN/GitHubFolderDownloader)
  * GUI desktop app
  * requires .NET 4.0+
* `svn`
  * [GitHub still supports access to repos by subversion](https://help.github.com/articles/support-for-subversion-clients/)
  * ex:
    * directory in git repo:<br>`https://github.com/torvalds/linux/tree/master/Documentation/filesystems`
    * access via subversion:<br>`svn checkout https://github.com/torvalds/linux/trunk/Documentation/filesystems`
  * my humble opinion:
    * this seems like a massive amount of work for github's backend
    * support for this protocol is most likely going to eventually be removed
    * the day I go back to using `svn` (for any reason) will be the same day I reconnect a 56K modem to dialup

##### see:

* [discussion on Stack Overflow](https://stackoverflow.com/questions/7106012/download-a-single-folder-or-directory-from-a-github-repo)

- - - -

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
