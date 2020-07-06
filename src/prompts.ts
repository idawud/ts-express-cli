import { inject } from './inject';

export const promptsFn = () => {
  const prompts = require('prompts');
  const properties = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      validate: (projectName: string) =>
        projectName.match(/^[a-zA-Z0-9\s\-_]+$/)
          ? true
          : 'Project name must only conaton letters, numbers or dashes',
    },
    {
      type: 'text',
      name: 'projectAuthor',
      message: 'Author name: ',
    },
    {
      type: 'text',
      name: 'projectLicense',
      message: 'License (MIT):',
    }
  ];

  (async () => {
    const result = await prompts(properties);
    inject(result);
  })();
};