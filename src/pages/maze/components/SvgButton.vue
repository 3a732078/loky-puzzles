<script>
export default {
  props: ["propsArea", 'propsAngle'],
  inject: [
    "provideBoardData",
    "provideAreas",
    "provideEmits",
    "provideMirrors",
    "provideStartType",
  ],
  data() {
    return {
      boardData: this.provideBoardData,
      areas: this.provideAreas,
      emits: this.provideEmits,
      mirrors: this.provideMirrors,
      dy: 20,
      dx: 14,
      startType: this.provideStartType,
      terminalColor: [
        [
          [169, 0, 0],
          [0, 169, 0],
          [0, 0, 169],
        ],
        [
          [0, 169, 0],
          [0, 0, 169],
          [169, 0, 0],
        ],
        [
          [0, 0, 169],
          [169, 0, 0],
          [0, 169, 0],
        ],
      ],
      terminalCount: 0,
      area: null,
      angle: null,
    };
  },
  watch: {
    propsArea: {
      handler(newValue) {
        // console.log('isHandle',newValue);
        this.area = newValue;
      },
      deep: true,
      immediate: true,
    },
    propsAngle: {
      handler(newValue) {
        this.angle = newValue;
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    getColor: function (line) {
      return line[0]["color"];
    },
    getD: function (mirror) {
      // console.log("svg Button mirror:", mirror);
      let x = 25;
      let y = 27;
      let y2 = 22;
      let xTolerance = 5;
      let yTolerance = 2;
      let pathString =
        "M " + //M
        (x - this.getDx * this.dx - xTolerance).toString() +
        "," +
        (y - this.getDy * this.dy - yTolerance).toString() +
        "L " + //L
        (x + this.getDx * this.dx + xTolerance).toString() +
        "," +
        (y + this.getDy * this.dy + yTolerance).toString() +
        "L " + //L
        (x + this.getDx * this.dx + xTolerance).toString() +
        "," +
        (y2 + this.getDy * this.dy + yTolerance).toString() +
        "L " + //L
        (x - this.getDx * this.dx - xTolerance).toString() +
        "," +
        (y2 - this.getDy * this.dy - yTolerance).toString() +
        "Z";
      return pathString;
    },
  },
  computed: {
    getIsSet: {
      get() {
        return this.area === null
          ? this.angle['isSet']
          : //  true
          this.area["mirror"]["isSet"];
      },
    },
    getAreaType: {
      get() {
        return this.area === null
          ? null
          : // 'area'
          this.area["type"];
      },
    },
    getDx: {
      get() {
        return this.area !== null ? this.area['mirror']['dx'] : this.angle['dx'];
      }
    },
    getDy: {
      get() {
        return this.area !== null ? this.area['mirror']['dy'] : this.angle['dy'];
      }
    },
    getTerminalColor: {
      get() {
        const { coordinate } = this.area === null ? null : this.area;
        const { x, y } = coordinate === null ? null : coordinate;
        let count = this.terminalCount;
        for (const rowAreas of this.areas) {
          for (const a of rowAreas) {
            if (
              a["type"] === "terminal" &&
              a["coordinate"]["x"] === x &&
              a["coordinate"]["y"] === y
            ) {
              return this.terminalColor[this.startType][count];
            } else if (a["type"] === "terminal") count += 1;
          }
        }
        return [0, 0, 0];
      },
    },
    getResultColor: {
      get() {
        return this.area['resultColor'];
      }
    }
  },
};
</script>

<template>
  <!-- AREA (有顏色) -->
  <svg width="52" height="52" style="border: 2px dashed orange" view-box="0 0 52 52"
    v-if="getIsSet && getAreaType !== 'terminal' && JSON.stringify([0, 0, 0]) !== JSON.stringify(area['mirror']['color'])">
    <path :d="getD(area['mirror'])" :fill="'rgb(' + area['mirror']['color'] + ')'" />
  </svg>
  <!-- AREA (透鏡) -->
  <svg width="52" height="52" style="border: 2px dashed orange" view-box="0 0 52 52"
    v-else-if="getIsSet && getAreaType !== 'terminal'">
    <path :d="getD(area['mirror'])" stroke="rgb(169,169,169)" fill="none" />
  </svg>

  <!-- 空位 -->
  <svg width="52" height="52" style="border: 2px dashed orange" view-box="0 0 52 52"
    v-if="!getIsSet && getAreaType !== 'terminal'"></svg>

  <!-- 終點 -->
  <svg width="52" height="52" view-box="0 0 52 52" v-if="getIsSet && getAreaType === 'terminal'">
    <rect x="2" y="2" width="48" height="48" rx="4" :fill="'rgb(' + getTerminalColor + ')'" />

    <rect x="12" y="12" width="28" height="28" rx="14" :fill="'rgb(' + getResultColor + ')'" />

  </svg>
</template>
