<template>
  <div class="timeline-container">
    <div class="timeline">
      <div class="event" v-for="event in events" :key="event.date">
        <div class="event-circle"></div>
        <div class="event-date">{{ event.date }}</div>
        <ul class="event-description">
          <li v-for="(desc, index) in event.descriptions" :key="index">{{ desc }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  data() {
    return {
      events: [
        {
          date: 'October 2023',
          descriptions: ['Initial Research begins. Multiple stacks tested.']
        },
        {
          date: 'December 2023',
          descriptions: ['Technology Stack chosen and Architecture design starts', 'API developed for automation.', 'Evaluation of network automation partner']
        },
        {
          date: 'January 2024',
          descriptions: ['Network automation foundation laid down using in house developed API.', 'Initial Demo given to Executive team.', 'Trident platform']
        },
        {
          date: 'February 2024',
          descriptions: ['New cluster setup for future dev onboarding.', 'API development redesign.', 'Moved to K8s backend.', 'Storage backend solution research begins.']
        },
        {
          date: 'March 2024',
          descriptions: [
            'Initial Dev discovery for value use case.',
            'NAT automation API development starts.',
            'Upgrade to latest software for new feature testing.',
            'Palo alto appliance installed to service platform'
          ]
        },
        {
          date: 'April 2024',
          descriptions: ['Initial talks with Dev team for Branch testing POC.', 'DHCP automation testing starts.', 'Platform Engineer hiring starts.', 'Fleet CD research for onboarding POC app.']
        },
        {
          date: 'May 2024',
          descriptions: [
            'Branch testing POC working.',
            'Dev feedback is great.',
            'Request for some adjustments.',
            'New Platform Engineer Frontend Hired',
            'Research more in to Fleet for advanced features.',
            'Dev Presentation on Trident platform to rest of dev leads.',
            'Custom UI clean up and polish.',
            'Secondary cluster configured for internal testing. POC cluster stop development.'
          ]
        },
        {
          date: 'June 2024',
          descriptions: [
            'Custom home page initial design talks.',
            'Custom roadmap and release notes page work started.',
            'Next steps meeting to add more dev usage.',
            'Technology stack POC resources re-config started.',
            'Add HA and configure for more stability to accommodate growth'
          ]
        }
      ],
    };
  },
};
</script>

<style scoped>
.timeline-container {
  overflow-x: auto;
  white-space: nowrap;
  padding: 20px 0;
}

.timeline {
  display: flex;
  align-items: flex-start;
  position: relative;
}

.event {
  display: inline-block;
  position: relative;
  text-align: center;
  padding: 0 40px;
  flex-shrink: 0;
}

.event:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 100%;
  width: 60px;
  height: 2px;
  background-color: #ccc;
}

.event-circle {
  width: 20px;
  height: 20px;
  background-color: #007BFF;
  border-radius: 50%;
  margin: 0 auto 10px;
}

.event-date {
  font-weight: bold;
  margin-bottom: 10px;
}

.event-description {
  max-width: 200px;
  white-space: normal;
  text-align: left; /* Align text to the left for better readability */
  padding-left: 20px; /* Add some padding for the bullets */
}

.event-description li {
  margin-bottom: 5px; /* Add some space between list items */
}
</style>
