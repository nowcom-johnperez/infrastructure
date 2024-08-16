<template>
  <div v-html="wikiContent">
  </div>
</template>

<script>
export default {
  name: 'Wiki',
  data() {
    return {
      wikiContent: ''
    }
  },
  methods: {
    async fetchWiki () {
      const response = await fetch('https://gitlab.com/api/v4/projects/YOUR_PROJECT_ID/wikis/YOUR_WIKI_SLUG', {
          headers: {
            'Authorization': 'Bearer YOUR_PERSONAL_ACCESS_TOKEN'
          }
        });
        const data = await response.json();
        this.wikiContent = data.content;
    }
  }
}
</script>