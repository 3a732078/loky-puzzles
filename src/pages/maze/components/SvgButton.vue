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
          [255, 0, 0],
          [0, 255, 0],
          [0, 0, 255],
        ],
        [
          [0, 255, 0],
          [0, 0, 255],
          [255, 0, 0],
        ],
        [
          [0, 0, 255],
          [255, 0, 0],
          [0, 255, 0],
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
    },
    getImg: {
      get() {
        return 'src/assets/maze/mirror-' + this.area['mirror']['color'][0].toString()
          + this.area['mirror']['color'][1].toString() + this.area['mirror']['color'][2].toString() + '-'
          + this.area['mirror']['dx'].toString() + '-' + this.area['mirror']['dy'] + '.jpg'
      }
    }
  },
};
</script>

<template>
  <!-- 有設定鏡子 -->
  <img :src="getImg" alt="鏡子" width="60" v-if="getIsSet && getAreaType !== 'terminal' " />
  <!-- 空位 -->
  <svg width="60" height="60" style="background-color: rgb(20, 20, 20);" view-box="0 0 60 60"
    v-else-if="!getIsSet && getAreaType !== 'terminal'">
  </svg>

  <!-- 終點 -->
  <svg width="60" height="60" view-box="0 0 60 60" v-if="getIsSet && getAreaType === 'terminal'"
    style="background-color: rgb(20,20,20);">
    <rect x="5" y="5" width="50" height="50" rx="4" :fill="'rgb(' + getTerminalColor + ')'" />
    <rect x="10" y="10" width="40" height="40" rx="20" :fill="'rgb(' + getResultColor + ')'" />
  </svg>

</template>
