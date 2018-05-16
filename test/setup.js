/*
 * LiskHQ/lisky
 * Copyright © 2017 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
import os from 'os';
import chai, { Assertion } from 'chai';
import 'chai/register-expect';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

process.env.NODE_ENV = 'test';
process.env.LISKY_CONFIG_DIR =
	process.env.LISKY_CONFIG_DIR || `${os.homedir()}/.lisky`;

/* eslint-disable no-underscore-dangle */
Assertion.addMethod('matchAny', function handleAssert(matcher) {
	const obj = this._obj;

	new Assertion(obj).to.be.an('array');
	const result = obj.some(val => matcher(val));
	this.assert(
		result,
		'expected #{this} to match at least once',
		'expected #{this} not to match',
	);
});

Assertion.addMethod('customError', function handleAssert(error) {
	const obj = this._obj;
	new Assertion(obj).to.be.instanceOf(Error);
	new Assertion(obj.name).to.equal(error.name);
	new Assertion(obj.message).to.equal(error.message);
});
/* eslint-enable no-underscore-dangle */

[sinonChai, chaiAsPromised].forEach(chai.use);

global.sinon = sinon;
global.sandbox = sinon.sandbox.create();
