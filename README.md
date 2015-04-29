Accounting App

# Development

## Pre-requisites

* node.js
* mongodb

While launching with grunt, followings are required
* npm nodemon
* npm jshint
* (npm node-inspector)

## Installation

```bash
$ npm install
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
		"port": 8081 // Mandatory
	},

	"db": {
		"host": "your_production_host",
		"port": "27017",
		"database": "your_production_database_name",
		"url": "mongodb://your_production_host/your_production_database_name" // Mandatory
	}
}
```


# License

  [MIT](LICENSE)