import { createProgram } from '../cli';

describe('CLI Program', () => {
	let program: ReturnType<typeof createProgram>;

	beforeEach(() => {
		program = createProgram();
	});

	it('should create program with correct name', () => {
		expect(program.name()).toBe('vidcap');
	});

	it('should have version option', () => {
		const versionOption = program.options.find((opt) => opt.short === '-v');
		expect(versionOption).toBeDefined();
	});

	it('should register youtube command', () => {
		const youtubeCmd = program.commands.find((cmd) => cmd.name() === 'youtube');
		expect(youtubeCmd).toBeDefined();
	});

	it('should register video command', () => {
		const videoCmd = program.commands.find((cmd) => cmd.name() === 'video');
		expect(videoCmd).toBeDefined();
	});

	it('should register ai command', () => {
		const aiCmd = program.commands.find((cmd) => cmd.name() === 'ai');
		expect(aiCmd).toBeDefined();
	});

	it('should register config command', () => {
		const configCmd = program.commands.find((cmd) => cmd.name() === 'config');
		expect(configCmd).toBeDefined();
	});

	it('should register update command', () => {
		const updateCmd = program.commands.find((cmd) => cmd.name() === 'update');
		expect(updateCmd).toBeDefined();
	});

	describe('YouTube subcommands', () => {
		it('should have all YouTube subcommands', () => {
			const youtubeCmd = program.commands.find((cmd) => cmd.name() === 'youtube');
			expect(youtubeCmd).toBeDefined();

			const subcommandNames = youtubeCmd!.commands.map((cmd) => cmd.name());

			expect(subcommandNames).toContain('info');
			expect(subcommandNames).toContain('caption');
			expect(subcommandNames).toContain('summary');
			expect(subcommandNames).toContain('summary-custom');
			expect(subcommandNames).toContain('screenshot');
			expect(subcommandNames).toContain('screenshots');
			expect(subcommandNames).toContain('comments');
			expect(subcommandNames).toContain('search');
			expect(subcommandNames).toContain('media');
			expect(subcommandNames).toContain('download');
		});
	});

	describe('Config subcommands', () => {
		it('should have all config subcommands', () => {
			const configCmd = program.commands.find((cmd) => cmd.name() === 'config');
			expect(configCmd).toBeDefined();

			const subcommandNames = configCmd!.commands.map((cmd) => cmd.name());

			expect(subcommandNames).toContain('set');
			expect(subcommandNames).toContain('get');
			expect(subcommandNames).toContain('list');
		});
	});
});
