import { Ioptions } from './interface';
const fse = require('fs-extra');
const chalk = require('chalk');

const print = (msg: string, type: string) => {
	const error = chalk.red;
	const success = chalk.blue;
	const progress = chalk.green;
	const warning = chalk.keyword('orange');

	switch (type) {
		case 'E':
			console.log(error(`\u2715 ${msg}`));
			break;
		case 'S':
			console.log(success(`\u2713 ${msg}`));
			break;
		case 'W':
			console.log(warning(`\u0021 ${msg}`));
			break;
		case 'P':
			console.log(progress(`\u9000; ${msg}`));
			break;
		default:
			console.log(msg);
	}
};

export const inject = (options: Ioptions) => {

	if ( options.projectName === undefined){
		print('Process terminated early', 'W');
		process.exit(0);
	}
    const projectDir = options.projectName.trim();

    const tsconfigJson = {
        compilerOptions: {
            module: 'commonjs',
			target: 'es6',
			outDir: './dist',
			rootDir: './src',
            strict: true,
			moduleResolution: 'node',
			esModuleInterop: true,
			skipLibCheck: true,
            forceConsistentCasingInFileNames: true
        }
	};

	const tslintJson = {
		extends: 'tslint:recommended',
		rules: {
		  'max-line-length': {
			'options': [145]
		  },
		  'member-ordering': false,
		  'no-consecutive-blank-lines': false,
		  'object-literal-sort-keys': false,
		  'ordered-imports': false,
		  'quotemark': [true, 'single'],
		  'variable-name': [true, 'allow-leading-underscore']
		}
	}

    const packageJson = {
        name: options.projectName,
        version: '1.0.0',
        description: 'A minimal ts-express project structure',
        license: options.projectLicense,
        scripts: {
            'start': 'npm run build && node dist/app.js',
			'dev': 'nodemon src/app.ts',
			'build': 'tsc -p .',
          	'test': 'echo run some tests!'
        },
        author: options.projectAuthor,
        dependencies: {
            'express': '^4.17.1'
        },
        devDependencies: {
            '@types/express': '^4.17.6',
			'@types/node': '^14.0.14',
			'nodemon': '^2.0.4',
			'ts-node': '^8.10.2',
			'tslint': '^6.1.2',
			'typescript': '^3.9.6'
        },
    };

    const sampleMinimalServer: string = `import express, { Application, Request, Response, NextFunction} from 'express';

const app: Application = express();
const messagePayload: string = 'Hello ts-express';

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.send(messagePayload);
});

app.listen(5000, () => console.log(\`Server running on http://localhost:5000\`) );
	`;

	const gitignore: string = `node_modules/
dist/
	`;

    fse.ensureDir(projectDir, (error: any) => {
        if (error) {
            print(error, 'E');
            process.exit(1);
        }
        print('Project Directory created', 'S');

		// package.json
        fse.writeJson(`${projectDir}/package.json`, packageJson, { spaces: '\t' }, (err: any) => {
                if (err) {
                    print(err, 'E');
                    process.exit(1);
                }
                print('package.json created', 'S');
            }
        );
        // tsconfig.json
        fse.writeJson(`${projectDir}/tsconfig.json`, tsconfigJson, { spaces: '\t' }, (err: any) => {
                if (err) {
                    print(err, 'E');
                    process.exit(1);
                }
                print('tsconfig.json created', 'S');
            }
		);
		// tslint.json
        fse.writeJson(`${projectDir}/tslint.json`, tslintJson, { spaces: '\t' }, (err: any) => {
				if (err) {
					print(err, 'E');
					process.exit(1);
				}
				print('tslint.json created', 'S');
			}
		);

		//.gitignorec
		 fse.outputFile(`${projectDir}/.gitignore`, gitignore, (err: string) => {
            if(err) print(err, 'E')
            else print(`.gitignore created`, 'S');
		});

        // server app.ts
        fse.outputFile(`${projectDir}/src/app.ts`, sampleMinimalServer, (err: string) => {
            if(err) print(err, 'E')
            else print(`/src/app.ts created`, 'S');
		});
    });
};