const process_argv = require('@warren-bank/node-process-argv')

const path = require('path')
const fs   = require('fs')

const argv_flags = {
  "--help":                                 {bool: true},
  "--version":                              {bool: true},

  "--url":                                  {},
  "--directory-prefix":                     {},
  "--no-clobber":                           {bool: true},
  "--output-file":                          {}
}

const argv_flag_aliases = {
  "--help":                                 ["-h"],
  "--version":                              ["-V"],
  "--url":                                  ["-u"],
  "--directory-prefix":                     ["-P"],
  "--no-clobber":                           ["-nc"],
  "--output-file":                          ["-o"]
}

let argv_vals = {}

try {
  argv_vals = process_argv(argv_flags, argv_flag_aliases)
}
catch(e) {
  console.log('ERROR: ' + e.message)
  process.exit(1)
}

if (argv_vals["--help"]) {
  const help = require('./help')
  console.log(help)
  process.exit(0)
}

if (argv_vals["--version"]) {
  const data = require('../../package.json')
  console.log(data.version)
  process.exit(0)
}

if (!argv_vals["--url"]) {
  console.log('ERROR: URL is required')
  process.exit(0)
}

if (argv_vals["--directory-prefix"]) {
  argv_vals["--directory-prefix"] = path.resolve(argv_vals["--directory-prefix"])

  if (! fs.existsSync(argv_vals["--directory-prefix"])) {
    console.log('ERROR: Output directory does not exist')
    process.exit(0)
  }
}

if (argv_vals["--output-file"]) {
  argv_vals["--output-file"] = path.resolve(argv_vals["--output-file"])

  let output_dir = path.dirname(argv_vals["--output-file"])

  if (! fs.existsSync(output_dir)) {
    console.log('ERROR: Output directory does not exist')
    process.exit(0)
  }

  if (fs.existsSync(argv_vals["--output-file"])) {
    if (argv_vals["--no-clobber"]) {
      console.log('ERROR: Output file already exists')
      process.exit(0)
    }
    else {
      // "--continue" is not supported
      fs.unlinkSync(argv_vals["--output-file"])
    }
  }
}

module.exports = argv_vals
