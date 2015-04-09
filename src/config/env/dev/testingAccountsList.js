'use strict';

module.exports = [

	// Equity =================================================================

	{
		_id: '54eeeffbc1db710c291be44b',
		name: 'Equity',
		description: '',
		code: '1',
		type: 'equity',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: null,
		level: 0,
		generalLedger: '54ef204e923c579c1967379a'
	},

	{
		_id: '54eef4ba4326bb0c13b2c112',
		name: 'Initial state',
		description: '',
		code: '12',
		type: 'equity',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eeeffbc1db710c291be44b',
		level: 1,
		generalLedger: '54ef204e923c579c1967379a'
	},

	// Assets =================================================================

	{
		_id: '54eef4ba4326bb0c13b2c113',
		name: 'Assets',
		description: '',
		code: '2',
		type: 'asset',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: null,
		level: 0,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c114',
		name: 'Currents',
		description: '',
		code: '21',
		type: 'asset',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c113',
		level: 1,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c115',
		name: 'Cash',
		description: '',
		code: '211',
		type: 'asset',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c114',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c116',
		name: 'Savings',
		description: '',
		code: '212',
		type: 'asset',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c114',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c117',
		name: 'Long-terms',
		description: '',
		code: '22',
		type: 'asset',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c113',
		level: 1,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c118',
		name: 'Real estate',
		description: '',
		code: '221',
		type: 'asset',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c117',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c119',
		name: 'Companies',
		description: '',
		code: '222',
		type: 'asset',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c117',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	},

	// Liabilities ============================================================

	{
		_id: '54eef4ba4326bb0c13b2c11a',
		name: 'Liabilities',
		description: '',
		code: '4',
		type: 'liability',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: null,
		level: 0,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c11b',
		name: 'Currents',
		description: '',
		code: '41',
		type: 'liability',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c11a',
		level: 1,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c11c',
		name: 'Credit cards',
		description: '',
		code: '411',
		type: 'liability',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c11b',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c11d',
		name: 'Invoices',
		description: '',
		code: '412',
		type: 'liability',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c11b',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c11e',
		name: 'Long-terms',
		description: '',
		code: '42',
		type: 'liability',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c11a',
		level: 1,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c11f',
		name: 'Loans',
		description: '',
		code: '421',
		type: 'liability',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c11e',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	},

	// Incomes ================================================================

	{
		_id: '54eef4ba4326bb0c13b2c120',
		name: 'Incomes',
		description: '',
		code: '7',
		type: 'income',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: null,
		level: 0,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c121',
		name: 'Recurring',
		description: '',
		code: '71',
		type: 'income',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c120',
		level: 1,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c122',
		name: 'Salaries',
		description: '',
		code: '711',
		type: 'income',
		commodity: 'EUR',
		balance: {
			child: 0,
			own: 300,
		},
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c121',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c123',
		name: 'Rents',
		description: '',
		code: '712',
		type: 'income',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c121',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c124',
		name: 'Exceptional',
		description: '',
		code: '72',
		type: 'income',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c120',
		level: 1,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c125',
		name: 'Salaries',
		description: '',
		code: '721',
		type: 'income',
		commodity: 'EUR',
		balance: {
			child: 0,
			own: 100,
		},
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c124',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	},

	// Expenses ===============================================================

	{
		_id: '54eef4ba4326bb0c13b2c126',
		name: 'Expenses',
		description: '',
		code: '6',
		type: 'expense',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: null,
		level: 0,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c127',
		name: 'Recurring',
		description: '',
		code: '61',
		type: 'expense',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c126',
		level: 1,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c128',
		name: 'House',
		description: '',
		code: '611',
		type: 'expense',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c127',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c129',
		name: 'Financial fees',
		description: '',
		code: '612',
		type: 'expense',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c127',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c12a',
		name: 'Real estate',
		description: '',
		code: '613',
		type: 'expense',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c127',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c12b',
		name: 'Exceptional',
		description: '',
		code: '62',
		type: 'expense',
		commodity: 'EUR',
		placeholder: true,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c126',
		level: 1,
		generalLedger: '54ef204e923c579c1967379a'
	}, {
		_id: '54eef4ba4326bb0c13b2c12c',
		name: 'Misc',
		description: '',
		code: '621',
		type: 'expense',
		commodity: 'EUR',
		placeholder: false,
		closed: false,
		parent: '54eef4ba4326bb0c13b2c12b',
		level: 2,
		generalLedger: '54ef204e923c579c1967379a'
	}

];