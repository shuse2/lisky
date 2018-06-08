/*
 * LiskHQ/lisk-commander
 * Copyright © 2017–2018 Lisk Foundation
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
import getInputsFromSources from '../utils/input';
import { ValidationError } from '../utils/error';
import getAPIClient from '../utils/api';
import { createCommand } from '../utils/helpers';
import commonOptions from '../utils/options';
import cryptography from '../utils/cryptography';

const description = `Update forging status of the node

	Example:
		update forging status enable
		update forging status disable
`;

const ACTION_ENABLE = 'enable';
const ACTION_DISABLE = 'disable';

const updateForgingStatusIfForging = (client, publicKey, passphrase) =>
	client.node.getForgingStatus().then(res =>
		res.data.filter(d => d.forging).map(delegate => {
			return client.node.updateForgingStatus({
				password: passphrase,
				publicKey: delegate.publicKey,
			});
		}),
	);

const processInput = (client, action, publicKey, passphrase) =>
	client.node.getForgingStatus().then(res => {
		const delegate = res.data.find(delegate => delegate.publicKey === publicKey);
		if (action === ACTION_DISABLE && !delegate) {
			throw new Error('There is no delegate enabled');
		}
		if (action === ACTION_DISABLE && delegate.forging) {
			return client.node.updateForgingStatus({
				publicKey,
				password: passphrase,
			});
		}
		if (action === ACTION_ENABLE && delegate.forging) {
			return Promise.resolve();
		}

	});

export const actionCreator = vorpal => async ({ action, publicKey, options }) => {
	if (![ACTION_ENABLE, ACTION_DISABLE].includes(action)) {
		throw new ValidationError('Action must be either enable or disable');
	}
	if (!publicKey || publicKey === '') {
		throw new ValidationError('Public key must be specified');
	}

	const { passphrase: passphraseSource } = options;
	const client = getAPIClient();
	return getInputsFromSources(vorpal, {
		passphrase: {
			source: passphraseSource,
			repeatPrompt: true,
		},
	}).then(({ passphrase }) => processInput(client, action, publicKey, passphrase));
};

const updateForgingStatus = createCommand({
	command: 'update forging status [action] [publicKey]',
	description,
	actionCreator,
	options: [commonOptions.passphrase],
	errorPrefix: 'Could not update forging status',
});

export default updateForgingStatus;
