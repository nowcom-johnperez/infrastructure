export const getConfig = () => {
  let config = {
    NETWORK_URL_V2: 'https://packetlifter.hankeyinvestments.com/',
    RANCHER_DIRECT_URL: 'https://forge.tridentcloud.dev/',
    BEARERTOKEN: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InpyWEF3LUJhZnRvOEtURmVQNkF0Q292NVBFX2VDeGFFMVdVeWoyRlphT3MifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6InBhY2tldGxpZnRlci10b2tlbiIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJwYWNrZXRsaWZ0ZXItYWNjb3VudCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjgwYmI5NzVjLWY2ZTUtNDVjMi05MjlmLTlkOGJiYTRiOTljYyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpkZWZhdWx0OnBhY2tldGxpZnRlci1hY2NvdW50In0.k2f4uOUR-jIZbyKKcFfFsZGjwk6BnQGylgUnBbp-FcjNFKyXWe1zUggBWPCqB8w7J-jddNFdQAOIRYg62lmKtsLfp_Ig-HdvRS5R0MzMwFFrtC9c3-WtGdHsSY61ZW4OyaHTS5y_JULPhdXh3Hb9Qc9mhy2WSqWUFNvR9mKmJNEd1n-z5szzqNOhF333GvAsPMTl4hmp6pN2LRounc6tFkzXRNDVEetPKe-lykNeCflNDfPBI_bYP3aSVLLzCi8wtOaVnz3VbSy7r80t1_sr037HzW6r95lh0WsAnrBEyzfnv7RwD7UtN6hpFEoSHxV2H-XUZaqcJr3bQabXbgrNLw',
    RANCHER_BEARERTOKEN: 'token-h4jxw:28pj8hqdcc77ldmbrn9sj79vzf2jmvrtndx5fwnsrm4g24t5s2h8dm',
    CLUSTER: 'c-m-sdtmhjdg',
    ENVIRONMENT_CLUSTER: 'c-m-mw54xzmw',
    API_VERSION: 'v1',
    API: 'packetlifter.tridentcloud.dev',
    TRIDENT_API: 'trident.nowcom.io',
    VANGUARD_API: 'vanguard.tridentcloud.dev/v1alpha1',
    BREACHER_API: 'breacher.tridentcloud.dev',
    STACK: 'stacks',
    GITLAB_URL: 'https://gitlab.com/api/v4/',
    GITLAB_SOURCE_URL: 'https://gitlab.com/groups/nowcom/trident/-/wikis/',
    GITLAB_GROUP_ID: '90144365',
    GITLAB_IMAGES_PROJECT_ID: '60607760',
    GITLAB_PROJECT_TOKEN: 'glpat-5t8tWuTYdHTnhSszGZyp',
    GITLAB_TOKEN: 'glpat-3fpYpWvshVzaSjxUyyzt',
    AZURE_CLIENT_ID: '',
    AZURE_CLIENT_VALUE: '',
    AZURE_TENANT_ID: '',
    isDev: false
  };

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    if (hostname.includes('surge')) {
      config.RANCHER_DIRECT_URL = 'https://surge.tridentcloud.dev/'
      config.RANCHER_BEARERTOKEN = 'token-56npt:5r6kjl4c56k65m6jjjbvkzcjvhd9kjkgk79lsbsqcnbjt8gwtfx76w'
      config.CLUSTER = 'c-m-wvplbwls'
      config.ENVIRONMENT_CLUSTER = 'c-m-xsj4tkvq'
      config.isDev = false
    } else {
      // config.RANCHER_DIRECT_URL = 'https://els-clouddev.hankeyinvestments.com/'
      // config.RANCHER_BEARERTOKEN = 'token-gz2gq:2j67frvc7bt8p4ztm7vz52t44j6rqhkpls7lg44s7n7vjhkjnd98cq'
      config.RANCHER_DIRECT_URL = 'https://forge.tridentcloud.dev/'
      config.RANCHER_BEARERTOKEN = 'token-h4jxw:28pj8hqdcc77ldmbrn9sj79vzf2jmvrtndx5fwnsrm4g24t5s2h8dm' // no-scope - service account
      config.CLUSTER = 'c-m-hx52gvl6'
      config.ENVIRONMENT_CLUSTER = 'c-m-mw54xzmw'
    }
  }

  return config;
};