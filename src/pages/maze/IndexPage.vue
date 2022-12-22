<script>
import SetDefaultBoard from "assets/maze/SetDefaultBoard";
import SetTerminal from "assets/maze/setTerminal";
import ComputeNewEmits from "assets/maze/ComputedNewEmits";
import { computed } from "vue";
import BoardDataShow from "./components/BoardDataShow.vue";
import SvgEmits from "./components/SvgEmits.vue";
import SvgButton from "./components/SvgButton.vue";
import SvgAngles from "./components/SvgAngles.vue";
import SvgColor from "./components/SvgColor.vue";

export default {
  data() {
    return {
      level: 1,
      boardData: null,
      createTerminal: null,
      startType: 0,
      isStart: false,
      isRightDrawer: false,
      IntervalGame: null,
      speed: 1,
      visible: {
        angle: false,
        color: false,
      },
      click: {
        x: null,
        y: null,
      },
      angles: {
        options: [
          {
            isSet: true,
            dx: 0,
            dy: 1,
          },
          {
            isSet: true,
            dx: 1,
            dy: -1,
          },
          {
            isSet: true,
            dx: 1,
            dy: 0,
          },
          {
            isSet: true,
            dx: 1,
            dy: 1,
          },
          {
            isSet: false,
          }
        ],
        value: null
      },
      colors: {
        options: [
          [169, 169, 169],
          [169, 0, 0],
          [0, 169, 0],
          [0, 0, 169],
          [0, 169, 169],
          [169, 0, 169],
          [169, 169, 0],
          [0, 0, 0],
        ],
        value: null
      },
      angleValue: null,
    };
  },
  methods: {
    handleComputeBoardData: function () {
      const boardData = { ...this.boardData };
      const { boardEmits, mirrors, areas } = boardData;
      ComputeNewEmits(boardEmits, mirrors, areas, this.speed);
      // this.computeBoardData = newBoardData;
    },
    handleStartGame: function () {
      if (this.isStart) {
        this.handleResetGame();
      } else {
        this.isStart = !this.isStart;
        this.IntervalGame = setInterval(this.handleComputeBoardData, 1);
      }
    },
    handleResetGame: function () {
      this.isStart = !this.isStart;
      this.startType = 0;
      clearInterval(this.IntervalGame);
      this.handleChooceLevel(this.level);
    },
    handleChooceLevel: function (level) {
      this.level = level;
      const boardData = SetDefaultBoard(this.getBoundary);
      const boardDataWithTerminal = SetTerminal(
        this.level,
        boardData,
        this.createTerminal
      );
      this.boardData = boardDataWithTerminal;
    },
    handleClickArea(area) {
      const { type } = area;
      if (type === 'startPoint') {
        // 當點擊起點時設定起點
        this.startType = this.startType === 0 ? 1 : this.startType === 1 ? 2 : 0;
        this.boardData['boardEmits'][0]['dx'] = this.startType === 0 ? 0 : this.startType === 1 ? 10 : -10
        this.boardData['boardEmits'][0]['e'] = [this.boardData['boardEmits'][0]['s'][0] + this.boardData['boardEmits'][0]['dx'], this.boardData['boardEmits'][0]['e'][1]]
      } else {
        // 點擊area時設定鏡子
        this.visible['angle'] = true;
        this.click['x'] = area['coordinate']['x'];
        this.click['y'] = area['coordinate']['y'];
      }
    },
    handleSelectAngle: function (angle) {
      this.visible['angle'] = false;
      this.visible['color'] = true;
      if (angle['isSet']) {
        this.boardData['areas'][this.click['y']][this.click['x']]['mirror']['isSet'] = true;
        this.boardData['areas'][this.click['y']][this.click['x']]['mirror']['dx'] = angle['dx'];
        this.boardData['areas'][this.click['y']][this.click['x']]['mirror']['dy'] = angle['dy'];
        this.angles['value'] = angle
      } else {
        this.boardData['areas'][this.click['y']][this.click['x']]['mirror']['isSet'] = false;
      }
    },
    handleSelectColor: function (color) {
      this.visible['color'] = false;
      this.boardData['areas'][this.click['y']][this.click['x']]['mirror']['color'] = color;
    }
  },
  computed: {
    getBoardAreas: {
      get() {
        return this.boardData === null ? null : this.boardData["areas"];
      },
    },
    getBoardEmits: {
      get() {
        return this.boardData === null ? null : this.boardData["boardEmits"];
      },
    },
    getBoardMirrors: {
      get() {
        return this.boardData === null ? null : this.boardData["mirrors"];
      },
    },
    getBoundary: {
      get() {
        return this.level === 1 ? 5 : this.level === 2 ? 5 : 5;
      },
    },
    getTextStartGameButton: {
      get() {
        return this.isStart ? "重設" : "開始";
      },
    },
  },
  provide() {
    return {
      provideBoardData: computed(() => this.boardData),
      provideAreas: computed(() => this.getBoardAreas),
      provideEmits: computed(() => this.getBoardEmits),
      provideMirrors: computed(() => this.getBoardMirrors),
      provideBoundary: computed(() => this.getBoundary),
      provideStartType: computed(() => this.startType),
    };
  },
  components: { BoardDataShow, SvgEmits, SvgButton, SvgAngles, SvgColor },
};
</script>

<template>
  <!-- title -->
  <q-page-sticky expand position="top" :offset="[20, 20]">

    <q-btn v-for="(forLevel, index) in 3" :key="index" @click="handleChooceLevel(forLevel)">
      關卡{{ forLevel }}
    </q-btn>
    <!-- right -->
    <q-space />
    <q-btn color="teal-10" glossy class="q-ml-md" rounded @click="handleStartGame">
      {{ getTextStartGameButton }}
    </q-btn>
    <q-btn dense flat rounded icon="menu" @click="() => (isRightDrawer = !isRightDrawer)" />
  </q-page-sticky>

  <q-page-container>
    <!-- body -->
    <div class="q-ml-xl">
      <div style="position:absolute;left: 10%;top:65%">
        <SvgEmits />
      </div>
      <div style="position:absolute;left: 10%;top:65%" >
        <div v-for="(rowAreas, index) in getBoardAreas" :key="index">
          <q-btn v-for="(area, index) in rowAreas" :key="index"
            :disabled="area['type'] === 'boundary' || area['type'] === 'terminal'" @click="handleClickArea(area)" dense>
            <SvgButton :propsArea="area" />
          </q-btn>
        </div>
      </div>
      <!-- woman -->
      <q-img src="./components/woman.gif" style="position:absolute;left: 0%;top:30%"/>
    </div>

    <!-- <div class="testShow">boardData: {{ getBoardAreas }}</div> -->
  </q-page-container>

  <q-drawer show-if-above v-model="isRightDrawer" side="right" bordered width="600">
    <BoardDataShow />
  </q-drawer>

  <!-- dialog -->
  <q-dialog v-model="visible['angle']">
    <q-card class="q-pa-md">
      <q-btn class="q-ml-md" @click="handleSelectAngle(angle)" dense v-for="(angle, index) in angles['options']"
        :key="index">
        <SvgAngles :propsAngle="angle" />
      </q-btn>
    </q-card>

  </q-dialog>

  <q-dialog v-model="visible['color']">
    <q-card class="q-pa-md">
      <q-btn class="q-ml-md" @click="handleSelectColor(color)" dense v-for="(color, index) in colors['options']"
        :key="index">
        <SvgColor :propsAngle="angles['value']" :propsColor="color" />
      </q-btn>
    </q-card>

  </q-dialog>
</template>
