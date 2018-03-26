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

export function itShouldReturnThePublicKeys() {
	const { returnValue, publicKeys } = this.test.ctx;
	return expect(returnValue).to.eql(publicKeys);
}

export function itShouldReturnTheBlock() {
	const { returnValue, block } = this.test.ctx;
	return expect(returnValue).to.equal(block);
}

export function itShouldReturnAnObjectWithTheAddress() {
	const { returnValue, address } = this.test.ctx;
	return expect(returnValue).to.eql({ address });
}

export function itShouldReturnTheAlias() {
	const { returnValue, alias } = this.test.ctx;
	return expect(returnValue).to.be.equal(alias);
}

export function itShouldReturnTheType() {
	const { returnValue, type } = this.test.ctx;
	return expect(returnValue).to.be.equal(type);
}
