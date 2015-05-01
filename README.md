Accounting App

# Development

## Pre-requisites

* node.js
* mongodb

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
		"port": 8081
	},

	"db": {
		"host": "your_host",
		"port": 27017,
		"database": "your_database_name",
		"url": "mongodb://your_host/your_database_name"
	}
}
```


# License

  [MIT](LICENSE)