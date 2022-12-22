<script>

export default {
  inject: [
    "provideEmits",
    "provideBoundary",
  ],
  data() {
    return {
      boardEmits: this.provideEmits,
      boundary: this.provideBoundary,
    };
  },
  computed: {
    getWidth: {
      get() {
        return Number(this.boundary) * 60;
      },
    },
    getViewBox: {
      get() {
        return "0 0" + this.getWidth.toString() + this.getWidth.toString();
      },
    },
  },
  methods: {
    getD: function (line) {
      return 'M' + line['s'][0] + ',' + line['s'][1] + 'L' + line['e'][0] + ',' + line['e'][1] + 'Z';
    }
  },
};
</script>

<template>
  <svg   :width="getWidth" v-for="(line, lineIndex) in boardEmits" :key="lineIndex" :height="getWidth"
    :view-box="getviewBox" style="border: 2px solid orange;position:absolute;left: 10%;top:65%">
    <path :d="getD(line)" :stroke="'rgb(' + line['color'] + ')'" fill="none">
    </path>
  </svg>
</template>
