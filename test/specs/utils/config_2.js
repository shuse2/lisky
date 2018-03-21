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
// required for stubbing
const fs = require('fs');
const lockfile = require('lockfile');
const config = require('../../../src/utils/config');
const print = require('../../../src/utils/print');
const fsutil = require('../../../src/utils/fs');

describe.only('util config module', () => {
	const lockfileName = 'config.lock';
	const homedir = os.homedir();
	const configDirName = '.lisky';
	const configDirPath =
		process.env.LISKY_CONFIG_DIR || `${homedir}/${configDirName}`;
	const lockfilePath = `${configDirPath}/${lockfileName}`;
	let logWarningStub;
	let logErrorStub;
	let exitStub;
	let mkdirSyncStub;
	let accessSyncStub;
	let lockSyncStub;
	let readJSONSyncStub;
	let existsSyncStub;

	beforeEach(() => {
		logWarningStub = sandbox.stub(print, 'logWarning').returns(console.warn);
		logErrorStub = sandbox.stub(print, 'logError').returns(console.error);
		exitStub = sandbox.stub(process, 'exit');
		mkdirSyncStub = sandbox.stub(fs, 'mkdirSync');
		accessSyncStub = sandbox.stub(fs, 'accessSync');
		existsSyncStub = sandbox.stub(fs, 'existsSync');
		lockSyncStub = sandbox.stub(lockfile, 'lockSync');
		readJSONSyncStub = sandbox.stub(fsutil, 'readJSONSync');
		return Promise.resolve();
	});

	describe('#attemptCallWithWarning', () => {
		// eslint-disable-next-line no-underscore-dangle
		const attemptCallWithWarning = config.__get__('attemptCallWithWarning');

		it('should call supplied function and returns what supplied function return', () => {
			const returnValue = 'file path';
			const path = 'file path';
			const fn = () => returnValue;
			return expect(attemptCallWithWarning(fn, path)).to.equal(returnValue);
		});

		it('should call logWarning including path supplied', () => {
			const error = new Error('function error');
			const path = 'file path';
			const fn = () => {
				throw error;
			};
			const returnValue = attemptCallWithWarning(fn, path);
			expect(logWarningStub).to.be.calledWithExactly(`WARNING: Could not write to \`${path}\`. Your configuration will not be persisted.`);
			return expect(returnValue).to.be.an('function');
		});
	});

	describe('#attemptCallWithError', () => {
		// eslint-disable-next-line no-underscore-dangle
		const attemptCallWithError = config.__get__('attemptCallWithError');

		it('should call supplied function and returns what supplied function return', () => {
			const returnValue = 'file path';
			const errorCode = 'error_code';
			const errorMessage = 'error message';
			const fn = () => returnValue;
			return expect(attemptCallWithError(fn, errorCode, errorMessage)).to.equal(returnValue);
		});

		it('should call logWarning including path supplied', () => {
			const error = new Error('function error');
			const errorCode = 3;
			const errorMessage = 'error message';
			const fn = () => {
				throw error;
			};
			attemptCallWithError(fn, errorCode, errorMessage);
			expect(logErrorStub).to.be.calledWithExactly(errorMessage);
			return expect(exitStub).to.be.calledWithExactly(errorCode);
		});
	});

	describe('#attemptToCreateDir', () => {
		// eslint-disable-next-line no-underscore-dangle
		const attemptToCreateDir = config.__get__('attemptToCreateDir');

		it('should call mkdirSync with supplied path and returns what mkdirSync returns', () => {
			const path = './test_folder';
			mkdirSyncStub.returns(true);
			const returnValue = attemptToCreateDir(path);
			expect(mkdirSyncStub).to.be.calledWithExactly(path);
			return expect(returnValue).to.be.true;
		});

		it('should call logWarning when mkdirSync throws error and returns function', () => {
			const path = './test_folder';
			mkdirSyncStub.throws(new Error());
			attemptToCreateDir(path);
			return expect(logWarningStub).to.be.calledWithExactly(`WARNING: Could not write to \`${path}\`. Your configuration will not be persisted.`);
		});
	});

	describe('#checkReadAccess', () => {
		// eslint-disable-next-line no-underscore-dangle
		const checkReadAccess = config.__get__('checkReadAccess');

		it('should call accessSync with path supplied and "fs.constants.R_OK" and returns what accessSync returns', () => {
			const path = './test_folder';
			accessSyncStub.returns(true);
			const returnValue = checkReadAccess(path);
			expect(accessSyncStub).to.be.calledWithExactly(path, fs.constants.R_OK);
			return expect(returnValue).to.be.true;
		});

		it('should call logError when accessSync throws error', () => {
			const path = './test_folder';
			const readAccessErrorCode = 1;
			const readAccessErrorMessage = `Could not read config file. Please check permissions for ${path} or delete the file so we can create a new one from defaults.`;
			accessSyncStub.throws(new Error());
			checkReadAccess(path);
			expect(logErrorStub).to.be.calledWithExactly(readAccessErrorMessage);
			return expect(exitStub).to.be.calledWithExactly(readAccessErrorCode);
		});
	});

	describe('#checkLockfile', () => {
		// eslint-disable-next-line no-underscore-dangle
		const checkLockfile = config.__get__('checkLockfile');

		it('should call lockSync with path supplied and returns what lockSync returns', () => {
			const path = './test_folder';
			lockSyncStub.returns(true);
			const returnValue = checkLockfile(path);
			expect(lockSyncStub).to.be.calledWithExactly(path);
			return expect(returnValue).to.be.true;
		});

		it('should call logError when lockSync throws error', () => {
			const path = './test_folder';
			const lockFileErrorCode = 3;
			const lockFileErrorMessage = `Config lockfile at ${lockfilePath} found. Are you running Lisky in another process?`;
			lockSyncStub.throws(new Error());
			checkLockfile(path);
			expect(logErrorStub).to.be.calledWithExactly(lockFileErrorMessage);
			return expect(exitStub).to.be.calledWithExactly(lockFileErrorCode);
		});
	});

	describe('#attemptToReadJSONFile', () => {
		// eslint-disable-next-line no-underscore-dangle
		const attemptToReadJSONFile = config.__get__('attemptToReadJSONFile');

		it('should call lockSync with path supplied and returns what lockSync returns', () => {
			const path = './test_folder';
			const expectedValue = { some: 'value' };
			readJSONSyncStub.returns(expectedValue);
			const returnValue = attemptToReadJSONFile(path);
			expect(readJSONSyncStub).to.be.calledWithExactly(path);
			return expect(returnValue).to.be.equal(expectedValue);
		});

		it('should call logError when readJSONSync throws error', () => {
			const path = './test_folder';
			const readJSONErrorCode = 2;
			const readJSONErrorMessage = `Config file is not valid JSON. Please check ${path} or delete the file so we can create a new one from defaults.`;
			readJSONSyncStub.throws(new Error());
			attemptToReadJSONFile(path);
			expect(logErrorStub).to.be.calledWithExactly(readJSONErrorMessage);
			return expect(exitStub).to.be.calledWithExactly(readJSONErrorCode);
		});
	});

	describe('#getConfig', () => {
		// eslint-disable-next-line no-underscore-dangle
		const getConfig = config.__get__('getConfig');

		describe('when config directory does not exist', () => {
			beforeEach(() => {
				existsSyncStub.returns(true);
				return getConfig();
			});

			it('should check if folder path exists', () => {
				return expect(existsSyncStub).to.be.called;
			});

			it('should call attempToCreateDir with configDirPath', () => {
				return expect(mkdirSyncStub).to.be.called;
			});
		});

		describe('when config directory exists', () => {
			beforeEach(() => {

			});

			it('should check if folder path exists', () => {

			});

			it('should not call attempToCreateDir with configDirPath', () => {

			});
		});

		describe('when config file does not exist', () => {
			beforeEach(() => {

			});

			it('should check if file path exists', () => {

			});

			it('should call attempToCreateFile with configFilePath', () => {

			});

			it('should return defaultConfig', () => {

			});
		});

		describe('when config file exists', () => {
			beforeEach(() => {

			});

			it('should check if file path exists', () => {

			});

			it('should not call attempToCreateFile with configFilePath', () => {

			});

			describe('when process.env.EXEC_FILE_CHILD is set', () => {

			});

			describe('when process.env.EXEC_FILE_CHILD is not set', () => {

			});

			it('should check read access of configFilePath', () => {

			});

			it('should attempt to read JSON file', () => {

			});

			it('should return config', () => {

			});
		});
	});
});
