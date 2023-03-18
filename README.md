# deno-to-gas

This CLI is used to convert TypeScript modules to JavaScript files that can be used in Google Apps Script. It uses the Deno runtime.

## Installation

To use this CLI, you'll need the Deno runtime. If you don't have Deno installed, please follow the [installation instructions for Deno](https://deno.land/#installation).

Once Deno is installed, you can install this CLI using the following command:

```sh
deno install -qAn deno-to-gas  https://deno.land/x/deno_to_gas@v0.0.3/cli.ts
```

## Usage

You can use the following command to bundle and convert TypeScript modules to JavaScript files that can be used in Google Apps Script:

```sh
deno-to-gas <entry file> --outfile=[output file]
```

- entry file - The path to the entry file of your TypeScript module. 
- output file(optional) - The path to the output file where the converted JavaScript file will be saved. The default is .js file of same name as entry in same direstory.
  
### Options:

```sh
-h, --help           - Show this help.
-V, --version        - Show the version number for this program.
-o, --outfile        - path to output.
-e, --exposeExports  - wether expose exports in entry
                       (Default: true)
-n, --globalName     - Global name for iife.
```

```sh
deno-to-gas ./src/main.ts --outfile=./dist/script.js --globalName=AwesomeApp
```

This will generate a JavaScript file from the ./src/main.ts file and save it to ./dist/script.js. It will also hava globalName of iife as "AwesomeApp".

## Error Handling

This CLI detects compilation errors in your TypeScript modules and outputs error messages. If an error occurs, no output file will be generated.

## License

This project is licensed under the MIT License. For more information, please see the LICENSE file.

## Contributions
Bug reports and feature suggestions are welcome on the GitHub repository. Please feel free to open an issue.

## Author

ncukondo