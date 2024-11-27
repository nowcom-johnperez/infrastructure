<template>
  <div class="timeline">
    <div :class="['timeline-top-bar', 'dynamic-width-' + events.length]">
      <div class="circle circle-big"></div>
      <div class="vertical-line"></div>
      <div class="circle circle-big"></div>
    </div>
    
    <div class="timeline-cards-container">
      <div 
        v-for="(event, index) in events" 
        :key="index" 
        class="timeline-card" 
        :class="{ future: isFutureEvent(event.date) }"
      >
        <div class="small-circle"></div>
        <div class="horizontal-line"></div>
        <div class="box">
          <div class="top">
            {{ event.date }}
          </div>
          <div class="bottom">
            <ul class="description-list">
              <li v-for="(desc, idx) in event.descriptions" :key="idx" class="description-item">
                <div class="description-icon"></div>
                <div class="description-text">{{ desc }}</div>
              </li>
            </ul>
          </div>
        </div>
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
          descriptions: ['Beginnings of Platform team', 'Initiative to follow Nowcom\'s mantra "Driving Technology"']
        },
        {
          date: 'Janurary 2024',
          descriptions: ['Initial Platform stack picked and Presented to Executive team.', ' Trident Name Born.']
        },
        {
          date: 'May 2024',
          descriptions: ['Team expansion with new frontend engineer.', 'POC with Dev ongoing with great success.']
        },
        {
          date: 'August 2024',
          descriptions: ['Initiative to expand Trident to all application teams', 'New Backend engineer Hired.']
        },
        {
          date: 'October 2024',
          descriptions: [
            'New hardware ordered to accommodate Trident 1 release.',
            'New Senior Ops engineer Hired.',
          ]
        },
        {
          date: 'December 2024',
          descriptions: ['Trident 1 Release']
        },
        {
          date: '2025',
          descriptions: ['Trident 2']
        },
        {
          date: '2026',
          descriptions: ['Trident 3']
        },
      ],
    };
  },
  methods: {
    isFutureEvent(date) {
      const currentYear = new Date().getFullYear();
      const year = parseInt(date.match(/\d{4}/), 10);
      return year > currentYear;
    }
  }
};
</script>

<style scoped lang="scss">
.timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-top-bar {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  margin-bottom: -55px;
}

.circle {
  background: #0099cc;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #fff, 0 0 0 3px #0099cc;
  margin: 5px;
  z-index: 1;
}

.vertical-line {
  height: 4px;
  background: #0099cc;
  display: block;
  position: relative;
  flex-grow: 1;
}

.timeline-cards-container {
  display: flex;
  position: relative;
  overflow-x: auto;
  width: 100%;
  padding-bottom: 20px;
}

.timeline-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  position: relative;
}

.small-circle {
  background: #0099cc;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #fff, 0 0 0 3px #0099cc;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.horizontal-line {
  width: 2px;
  background: #0099cc;
  height: 100px;
  display: block;
  margin-bottom: 8px;
  margin-top: 15px;
}

.box {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.box .top {
  background: #297db4;
  width: 95%;
  height: 50px;
  box-shadow: 0 0 0 2px #fff, 0 0 0 5px #0099cc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #fff;
  border-radius: 8px 8px 0 0;
}

.box .bottom {
  background: #d0d0d0;
  min-height: 100px;
  width: 100%;
  margin-top: 3px;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 8px 8px;
}

.description-list {
  list-style: none; /* Remove default list styling */
  padding: 0;
  margin: 0;
}

.description-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}

.description-icon {
  width: 16px;
  height: 16px;
  background: #297db4;
  border-radius: 50%;
  margin-right: 8px;
  margin-top: 3px;
  flex-shrink: 0;
}

.description-text {
  color: #333;
  font-size: 14px;
  line-height: 1.4;
}

.future .small-circle {
  background: #ff8800; /* Orange for future */
  box-shadow: 0 0 0 2px #fff, 0 0 0 3px #ff8800;
}

.future .description-icon, .future .horizontal-line {
  background: #ff8800;
}

.future .box .top {
  background: #ff8800; /* Match the top box */
  box-shadow: 0 0 0 2px #fff, 0 0 0 5px #ff8800;
  color: #fff; /* Adjust text color for contrast */
}

.future .box .bottom {
  background: #ffe5d0; /* Softer background for contrast */
}


.dynamic-width-1 .vertical-line { width: 100px; }
.dynamic-width-2 .vertical-line { width: 200px; }
.dynamic-width-3 .vertical-line { width: 300px; }
.dynamic-width-4 .vertical-line { width: 400px; }
.dynamic-width-5 .vertical-line { width: 500px; }
.dynamic-width-6 .vertical-line { width: 600px; }
.dynamic-width-7 .vertical-line { width: 700px; }
.dynamic-width-8 .vertical-line { width: 800px; }
</style>
