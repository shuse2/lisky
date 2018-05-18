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
import readline from 'readline';
import { Command, flags as flager } from '@oclif/command';

const getStdin = async () => {
	const rl = readline.createInterface({ input: process.stdin });
	const lines = [];
	return new Promise(resolve => {
		rl.on('line', line => lines.push(line)).on('close', () => {
			resolve(lines);
		});
	});
};

export default class Hello extends Command {
	async run() {
		const { args, flags } = this.parse(Hello);

		const stdin = await getStdin();

		const name = flags.name || 'world';
		this.log(`hello ${name} from ./src/commands/hello.js ${args.piped} ${stdin}`);
	}
}

Hello.description = `
Describe the command here
...
Extra documentation goes here
`;

Hello.flags = {
	name: flager.string({ char: 'n', description: 'name to print' }),
};

Hello.args = [
	{
		name: 'piped',
		default: 'non-piped',
	},
];
