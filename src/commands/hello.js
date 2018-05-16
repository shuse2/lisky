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
import { Command, flags as flager } from '@oclif/command';

export default class Hello extends Command {
	async run() {
		const { flags } = this.parse(Hello);

		const name = flags.name || 'world';
		this.log(`hello ${name} from ./src/commands/hello.js`);
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
