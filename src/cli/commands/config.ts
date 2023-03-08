import * as w3security from '../../lib';

const validMethods = ['set', 'get', 'unset', 'clear'];

export default async function config(
  method?: 'set' | 'get' | 'unset' | 'clear',
  ...args: string[]
): Promise<string> {
  if (method && !validMethods.includes(method)) {
    throw new Error(`Unknown config command "${method}"`);
  }

  const key = args[0];

  if (method === 'set') {
    let res = '';

    args.forEach((item) => {
      const [key, val] = item.split(/=(.+)/);
      w3security.config.set(key, val);
      res += key + ' updated\n';

      // ensure we update the live library
      if (key === 'api') {
        (w3security as any).api = val;
      }
    });

    return res;
  }

  if (method === 'get') {
    if (!key) {
      throw new Error('config:get requires an argument');
    }

    return w3security.config.get(key) || '';
  }

  if (method === 'unset') {
    if (!key) {
      throw new Error('config:unset requires an argument');
    }
    w3security.config.delete(key);

    if (key === 'api') {
      // ensure we update the live library
      (w3security as any).api = null;
    }

    return `${key} deleted`;
  }

  if (method === 'clear') {
    w3security.config.clear();
    // ensure we update the live library
    (w3security as any).api = null;
    return 'config cleared';
  }

  return Object.keys(w3security.config.all)
    .sort((a, b) => Number(a.toLowerCase() < b.toLowerCase()))
    .map((configKey) => `${configKey}: ${w3security.config.all[configKey]}`)
    .join('\n')
    .trim();
}
