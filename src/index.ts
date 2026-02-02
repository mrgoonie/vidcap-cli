#!/usr/bin/env node

import { createProgram } from './cli';

const program = createProgram();

program.parseAsync(process.argv).catch((error) => {
	console.error('Fatal error:', error.message);
	process.exit(1);
});
