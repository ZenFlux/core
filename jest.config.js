/** @type {import('jest').Config} */
const config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRegex: '(/test/.*\\.spec\\.ts)$',
	coverageProvider: 'v8',
	transform: {
		'^.+\\.(ts|tsx)?$': ["ts-jest", { tsconfig: "./test/tsconfig.json" }],
		"^.+\\.(js|jsx)$": "babel-jest",
	},
	setupFilesAfterEnv: ["<rootDir>/test/__setup__.ts"]
}

module.exports = config;

