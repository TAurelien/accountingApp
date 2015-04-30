Accounting App

# Development

## Pre-requisites

* node.js
* mongodb

## Installation

```bash
$ npm install
```

To launch using grunt, following packages are also required:
```bash
$ npm install -g nodemon
$ npm install -g jshint
$ npm install -g node-inspector
```

## Usage

With mongodb running

```bash
$ grunt
```

### Properties

A properties.json file is mandatory in the folder properties/.
Check the example properties/properties.example.json.

```json
{
	"server": {
		"host": "localhost",
		"port": 8081
	},

	"db": {
		"host": "your_production_host",
		"port": 27017,
		"database": "your_production_database_name",
		"url": "mongodb://your_production_host/your_production_database_name"
	}
}
```


# License

  [MIT](LICENSE)