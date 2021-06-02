# Paint Shop solution

## Installation

Install dependencies & build package:

`npm install && npm run build`

## Usage

### Run from package root

> `npm run get-paint-batch -- <path-to-file>`

*Example command*

> npm run get-paint-batch -- ./src/fixtures/2color-2ppl.txt

### Run from bin

First, install package globally:
> `npm install -g .`

Then run command:

> `get-paint-batch <path-to-file>`

*Example command*

> get-paint-batch ./src/fixtures/2color-2ppl.txt

*Uninstall*

> npm uninstall -g paint-shop

## Testing

To run unit tests, run the below command.

> `npm run test`

