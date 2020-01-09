module.exports = {
	preset: 'ts-jest/presets/js-with-ts',
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'@shared/(.*)': '<rootDir>/src/shared/$1',
		'@client/(.*)': '<rootDir>/src/client/$1'
	},
	reporters: [
		'default',
		['jest-junit', {
			suiteName: 'Jest Unit Tests',
			outputName: 'unit-test-report.xml',
			classNameTemplate: '{classname}',
			titleTemplate: '{title}',
			suiteNameTemplate: '{filename}',
			includeConsoleOutput: 'true'
		}]
	]
};