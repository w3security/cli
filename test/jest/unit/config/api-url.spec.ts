import {
  getBaseApiUrl,
  getV1ApiUrl,
  getRestApiUrl,
  getRootUrl,
} from '../../../../src/lib/config/api-url';

const urls = [
  {
    userInput: 'https://w3security.io/api/v1',
    expectedBase: 'https://w3security.io/api/',
    expectedV1: 'https://w3security.io/api/v1',
    expectedRest: 'https://api.w3security.io/rest',
    expectedRoot: 'https://w3security.io',
  },
  {
    userInput: 'https://w3security.io/api',
    expectedBase: 'https://w3security.io/api',
    expectedV1: 'https://w3security.io/api/v1',
    expectedRest: 'https://api.w3security.io/rest',
    expectedRoot: 'https://w3security.io',
  },
  {
    userInput: 'https://app.w3security.io/api',
    expectedBase: 'https://app.w3security.io/api',
    expectedV1: 'https://app.w3security.io/api/v1',
    expectedRest: 'https://api.w3security.io/rest',
    expectedRoot: 'https://app.w3security.io',
  },
  {
    userInput: 'https://app.w3security.io/api/v1',
    expectedBase: 'https://app.w3security.io/api/',
    expectedV1: 'https://app.w3security.io/api/v1',
    expectedRest: 'https://api.w3security.io/rest',
    expectedRoot: 'https://app.w3security.io',
  },
  {
    userInput: 'https://api.w3security.io/v1',
    expectedBase: 'https://api.w3security.io/',
    expectedV1: 'https://api.w3security.io/v1',
    expectedRest: 'https://api.w3security.io/rest',
    expectedRoot: 'https://w3security.io',
  },
  {
    userInput: 'https://api.w3security.io',
    expectedBase: 'https://api.w3security.io',
    expectedV1: 'https://api.w3security.io/v1',
    expectedRest: 'https://api.w3security.io/rest',
    expectedRoot: 'https://w3security.io',
  },
  {
    userInput: 'https://api.w3security.io/',
    expectedBase: 'https://api.w3security.io/',
    expectedV1: 'https://api.w3security.io/v1',
    expectedRest: 'https://api.w3security.io/rest',
    expectedRoot: 'https://w3security.io',
  },
  {
    userInput: 'https://api.custom.w3security.io',
    expectedBase: 'https://api.custom.w3security.io',
    expectedV1: 'https://api.custom.w3security.io/v1',
    expectedRest: 'https://api.custom.w3security.io/rest',
    expectedRoot: 'https://custom.w3security.io',
  },
  {
    userInput: 'http://localhost:9000/',
    expectedBase: 'http://localhost:9000/',
    expectedV1: 'http://localhost:9000/v1',
    expectedRest: 'http://localhost:9000/rest',
    expectedRoot: 'http://localhost:9000',
  },
  {
    userInput: 'http://localhost:9000/api/v1',
    expectedBase: 'http://localhost:9000/api/',
    expectedV1: 'http://localhost:9000/api/v1',
    expectedRest: 'http://localhost:9000/rest',
    expectedRoot: 'http://localhost:9000',
  },
  {
    userInput: 'http://alpha:omega@localhost:9000',
    expectedBase: 'http://alpha:omega@localhost:9000',
    expectedV1: 'http://alpha:omega@localhost:9000/v1',
    expectedRest: 'http://alpha:omega@localhost:9000/rest',
    expectedRoot: 'http://localhost:9000',
  },
  {
    userInput: 'https://app.dev.w3security.io/api/v1',
    expectedBase: 'https://app.dev.w3security.io/api/',
    expectedV1: 'https://app.dev.w3security.io/api/v1',
    expectedRest: 'https://api.dev.w3security.io/rest',
    expectedRoot: 'https://app.dev.w3security.io',
  },
];

describe('CLI config - API URL', () => {
  // TODO: check that console.error was called for error states?
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  describe('getBaseApiUrl', () => {
    describe('when only default URL is defined', () => {
      urls.forEach((url) => {
        it(`returns default API URL ${url.userInput} without the v1 suffix`, () => {
          expect(getBaseApiUrl(url.userInput)).toEqual(url.expectedBase);
        });
      });
    });

    it('returns envvar API if it is defined and valid', () => {
      expect(
        getBaseApiUrl('https://api.w3security.io/', 'http://localhost:9000/'),
      ).toEqual('http://localhost:9000/');
      expect(
        getBaseApiUrl(
          'https://api.w3security.io/',
          'http://alpha:omega@localhost:9000/',
          'https://endpoint-api.w3security.io/',
        ),
      ).toEqual('http://alpha:omega@localhost:9000/');
    });

    it('returns default API if envvar is defined but not valid', () => {
      expect(getBaseApiUrl('https://api.w3security.io/', 'localhost:10')).toEqual(
        'https://api.w3security.io/',
      );
    });

    it('returns config API if it is defined and valid', () => {
      expect(
        getBaseApiUrl(
          'https://api.w3security.io/',
          undefined,
          'http://localhost:9000/',
        ),
      ).toEqual('http://localhost:9000/');
      expect(
        getBaseApiUrl(
          'https://api.w3security.io/',
          undefined,
          'http://alpha:omega@localhost:9000/',
        ),
      ).toEqual('http://alpha:omega@localhost:9000/');
    });

    it('returns default API if config endpoint is defined but not valid', () => {
      expect(
        getBaseApiUrl('https://api.w3security.io/', undefined, 'localhost:10'),
      ).toEqual('https://api.w3security.io/');
    });
  });

  describe('getV1ApiUrl', () => {
    urls.forEach((url) => {
      it(`returns V1 API URL ${url.expectedBase} with v1 path`, () => {
        expect(getV1ApiUrl(url.expectedBase)).toEqual(url.expectedV1);
      });
    });
  });

  describe('getRestApiUrl', () => {
    urls.forEach((url) => {
      it(`returns REST API URL ${url.expectedBase}`, () => {
        expect(getRestApiUrl(url.expectedBase)).toEqual(url.expectedRest);
      });
    });
  });

  describe('getRootUrl', () => {
    urls.forEach((url) => {
      it(`returns ROOT URL ${url.userInput}`, () => {
        expect(getRootUrl(url.userInput)).toEqual(url.expectedRoot);
      });
    });
  });
});
