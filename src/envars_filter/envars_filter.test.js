const { expect } = require('chai');
const { EnvarsFilter } = require('./envars_filter');

describe('envars_filter', () => {
  let filter = null;

  beforeEach(() => {
    filter = new EnvarsFilter({
      DB_PASSWORD: 'password',
      DB_HOST: 'mysql',
      DB_USER: 'mysql user',
      USERNAME: 'richard nienaber',
      LOG_LEVEL: 'debug',
      SHLVL: '1',
      CREDENTIAL_FILTER_WHITELIST: 'OTHER1,LOG_LEVEL,OTHER2',
    }, () => {});
  });

  describe('non-sensitive', () => {
    it('one line strings are unchanged', () => {
      expect(filter.filter('hello world')).to.equal('hello world');
    });

    it('multi-line strings are unchanged', () => {
      expect(filter.filter('hello\nworld')).to.equal('hello\nworld');
    });

    it('large multi line strings are unchanged', () => {
      const repeatedData = 'abcdefghijklmnopqrstuvwxyz'.repeat(10083);
      expect(filter.filter(repeatedData)).to.equal(repeatedData);
    });

    it('env vars in white list are not redacted', () => {
      expect(filter.filter('DB_HOST: mysql\nDB_PASSWORD: password\nLOG_LEVEL: debug'))
        .to.equal('DB_HOST: [redacted]\nDB_PASSWORD: [redacted]\nLOG_LEVEL: debug');
    });

    it('ignore env vars that are empty', () => {
      const emptyFilter = new EnvarsFilter({ NVM_CD_FLAGS: '' }, () => {});
      expect(emptyFilter.filter('hello \npassword\n, world')).to.equal('hello \npassword\n, world');
    });

    it('ignore env vars that have pipes', () => {
      const emptyFilter = new EnvarsFilter({ LESSOPEN: '| /usr/bin/lesspipe %s' }, () => {});
      expect(emptyFilter.filter('hello \npassword\n, world')).to.equal('hello \npassword\n, world');
    });

    it('ignore env vars that are single digits', () => {
      expect(filter.filter('hello world1')).to.equal('hello world1');
    });

    it('escape complex regex', () => {
      const PS1 = '\\u@\\h \\W\\[\\033[32m\\]$(parse_git_branch)\\[\\033[00m\\]$ ';
      new EnvarsFilter({ PS1 }, () => {});
    });

    it('accepts buffers or strings', () => {
      expect(filter.filter(Buffer.from('hello world'))).to.equal('hello world');
    })
  });

  describe('sensitive', () => {
    it('one line strings are redacted', () => {
      expect(filter.filter('hello password')).to.equal('hello [redacted]');
    });

    it('environment variables with spaces are redacted', () => {
      expect(filter.filter('hello richard nienaber')).to.equal('hello [redacted]');
    });

    it('multi line strings are redacted', () => {
      expect(filter.filter('hello \npassword\n, world')).to.equal('hello \n[redacted]\n, world');
    });

    it('multiple secrets are redacted', () => {
      expect(filter.filter('DB_HOST: mysql\nDB_PASSWORD: password'))
        .to.equal('DB_HOST: [redacted]\nDB_PASSWORD: [redacted]');
    });

    it('large multi line strings are redacted', () => {
      const repeatedData = 'abcdefghijklmnopqrstuvwxyz'.repeat(5041);
      const data = `${repeatedData}aapasswordaa${repeatedData}`;
      const expected = `${repeatedData}aa[redacted]aa${repeatedData}`;
      expect(filter.filter(data)).to.equal(expected);
    });

    it('applies longest redaction first', () => {
      expect(filter.filter('My mysql user is confidential')).to.equal('My [redacted] is confidential');
    });
  });
});
