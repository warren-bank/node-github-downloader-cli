#! /usr/bin/env node

const argv_vals      = require('./ghdl/process_argv')

const {request}      = require('@warren-bank/node-request')

const parse_url      = require('url').parse
const path           = require('path')
const fs             = require('fs')

let urls = []
let rootpath, rootpath_pattern

// -----------------------------------------------------------------------------
// download URLs sequentially

const process_download_error = function(error, url='unavailable'){
  console.log('ERROR: occured when downloading file from GitHub repo')
  console.log('URL:', (error.url ? error.url : url))
  console.log('HTTP status code:', (error.statusCode ? error.statusCode : 'unavailable'))
  console.log('message:', error.message)
  process.exit(0)
}

const process_download_queue = async function(){
  const config = {
    followRedirect: true,
    maxRedirects:   10,
    binary:         true,
    stream:         true
  }

  while(urls.length){
    let urldata = urls.shift()

    // sanity check
    if (!Array.isArray(urldata)) continue

    let url = urldata[0]

    await request(
      url,
      '',
      {...config}
    )
    .then(({url, redirects, response}) => {
      let output_filepath

      {
        let output_dir  = argv_vals["--directory-prefix"] || process.cwd()
        output_filepath = path.resolve(output_dir, urldata[1])
      }

      if (fs.existsSync(output_filepath)) {
        if (argv_vals["--no-clobber"]) {
          return
        }
        else {
          // "--continue" is not supported
          fs.unlinkSync(output_filepath)
        }
      }

      {
        let output_dirpath = path.dirname(output_filepath)

        if (!fs.existsSync(output_dirpath)) {
          fs.mkdirSync(output_dirpath, {recursive: true})  // "recursive" option requires Node v10.12.0+
        }
      }

      return new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(output_filepath)

        response
        .pipe(stream)
        .on('finish', () => {
          resolve()
        })
        .on('error', (error) => {
          response.destroy()
          reject(error)
        })
      })
    })
    .catch((error) => process_download_error(error, url))
  }
}

// -----------------------------------------------------------------------------
// obtain download URLs in directory, add to queue

const parse_remote_repo_url = function(url){
  const repo_url_pattern = new RegExp('https://github\.com/([^/]+)/([^/]+)/tree/([^/]+)[/]+(.*?)[/]*(?:[\?#]|$)', 'i')
  const matches          = repo_url_pattern.exec(url)

  return Array.isArray(matches)
    ? [
        matches[1],
        matches[2],
        matches[3],
        matches[4]
      ]
    : null
}

const format_remote_repo_url = function(user, repo, commit, path){
  return `https://github.com/${user}/${repo}/tree/${commit}/${path}`
}

const format_remote_api_url = function(user, repo, commit, path){
  return `https://api.github.com/repos/${user}/${repo}/contents/${path}?ref=${commit}`
}

const resolve_relative_path = function(path){
  return path.replace(rootpath_pattern, '')
}

// GitHub API returns 403 when certain headers are not sent in request:
//   https://developer.github.com/v3/#user-agent-required
const remote_api_options = {
  headers: {
    "User-Agent": "@warren-bank/node-github-downloader-cli"
  }
}

const get_remote_api_options = function(url) {
  return Object.assign({}, remote_api_options, parse_url(url))
}

const process_remote_api_error = function(error, url='unavailable'){
  console.log('ERROR: occured when retrieving directory metadata from GitHub API v3')
  console.log('URL:', (error.url ? error.url : url))
  console.log('HTTP status code:', (error.statusCode ? error.statusCode : 'unavailable'))
  console.log('message:', error.message)
  process.exit(0)
}

const process_remote_directory = async function(user, repo, commit, path){
  const url = format_remote_api_url(user, repo, commit, path)

  await request(
    get_remote_api_options(url)
  )
  .then(({response}) => {
    return JSON.parse(response)
  })
  .then((dir_nodes) => {
    if (Array.isArray(dir_nodes)) {
      dir_nodes.forEach(async (node) => {
        try {
          const {path:fullpath, type, download_url} = node

          if ((type === 'file') && download_url) {
            const relpath = resolve_relative_path(fullpath)
            const urldata = [download_url, relpath]
            urls.push(urldata)
          }
          else if (type === 'dir') {
            await process_remote_directory(user, repo, commit, fullpath)
          }
        }
        catch(error) {
          process_remote_api_error(error, url)
        }
      })
    }
  })
  .then(() => {
    if (argv_vals["--output-file"]) {
      let output_filepath = argv_vals["--output-file"]
      let output_text     = urls.map(urldata => urldata.join("\t")).join("\n")

      fs.writeFileSync(output_filepath, output_text)

      // wipe the data so download does not occur
      urls = []
    }
  })
  .then(() => {
    return process_download_queue()
  })
  .catch((error) => process_remote_api_error(error, url))
}

// -----------------------------------------------------------------------------
// bootstrap

const process_root_directory = async function(){
  const data = parse_remote_repo_url( argv_vals["--url"] )

  if (!data) {
    console.log('ERROR: URL is not formatted correctly')
    process.exit(0)
  }

  rootpath         = path.dirname( data[3] ) + '/'
  rootpath_pattern = new RegExp(`^${rootpath}`, 'i')

  await process_remote_directory(...data)
}

// -----------------------------------------------------------------------------

process_root_directory()
.catch(process_remote_api_error)
