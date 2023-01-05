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
import ParaDigmColor from "./components/ParaDigmColor.vue";

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
          [255, 255, 255],
          [255, 0, 0],
          [0, 255, 0],
          [0, 0, 255],
          [0, 255, 255],
          [255, 0, 255],
          [255, 255, 0],
          [0, 0, 0],
        ],
        value: null
      },
      emitTypes: {
        sOptions: [
          [20, 0], [40, 0], [60, 20], [60, 40], [20, 60], [40, 60], [0, 20], [0, 60],
        ],
        dxOptions: [
          1, 0, -1
        ],
        dyOptions: [
          1, 0, -1
        ],
      },
      angleValue: null,
      paradigm: {
        color: [0, 0, 0],
        s: [40, 60],
        dx: 0,
        dy: -1,
      },
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
      
      clearInterval(this.IntervalGame);

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
        this.visible['color'] = false
        this.boardData['areas'][this.click['y']][this.click['x']]['mirror']['isSet'] = false;
      }
    },
    handleSelectColor: function (color) {
      this.visible['color'] = false;
      this.boardData['areas'][this.click['y']][this.click['x']]['mirror']['color'] = color;
    },
    handleSelectParadigm: function (color) {
      this.paradigm.color = color;
    },
    handleParadigmColorClass: function (color) {
      return JSON.stringify(this.paradigm['color']) === JSON.stringify(color) && 'button-init'
    },
    handleParadigmEmitClass: function (s, dy, dx) {
      return this.paradigm['s'] === s && this.paradigm['dy'] === dy && this.paradigm['dx'] === dx ? 'orange' : 'none'
    },
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
  components: { BoardDataShow, SvgEmits, SvgButton, SvgAngles, SvgColor, ParaDigmColor },
};
</script>

<template>
  <q-card class="q-ma-md" style="height: 700px;">
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

    <!-- body -->
    <q-page-container>
      <div class="q-ml-xl">

        <!--  -->
        <q-page-sticky position="top" :offset="[0, 200]">
          <SvgEmits />
        </q-page-sticky>
        <!--  -->
        <q-page-sticky position="top" :offset="[0, 200]">
          <div v-for="(rowAreas, index) in getBoardAreas" :key="index">
            <q-btn no-wrap padding="0px" square unelevated>
              <SvgButton v-for="(area, index) in rowAreas" :key="index" :propsArea="area" />
            </q-btn>
          </div>
        </q-page-sticky>
        <!--  -->
        <SvgEmits  />
        <!-- button  -->
        <q-page-sticky position="top" :offset="[0, 200]">
          <div v-for="(rowAreas, index) in getBoardAreas" :key="index">
            <q-btn v-for="(area, index) in rowAreas" :key="index" no-wrap padding="0px" square unelevated
              style="background-color:transparent; width: 60; height: 60"
              :disabled="area['type'] !== 'area' || isStart" @click="handleClickArea(area) "
              dense>
              <svg width="60" height="60" style="border: 0.3px solid gray">

              </svg>
            </q-btn>
          </div>
        </q-page-sticky>
        <!-- woman -->
        <q-page-sticky expand position="top" :offset="[0, 100]">
          <!-- <q-img height="40%" src="./components/woman.gif" /> -->
        </q-page-sticky>

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
          no-wrap padding="0px" square :key="index">
          <SvgAngles :propsAngle="angle" />
        </q-btn>
      </q-card>

    </q-dialog>

    <q-dialog v-model="visible['color']" persistent>
      <q-card class="q-pa-md">
        <q-btn class="q-ml-md" @click="handleSelectColor(color)" dense v-for="(color, index) in colors['options']"
          :key="index">
          <SvgColor :propsAngle="angles['value']" :propsColor="color" :propsParadigm="paradigm" />
        </q-btn>
      </q-card>
      <!-- 範例放棄 -->
      <q-card class="q-pa-md" v-if="false">
        <div class="text-h6 text-orange">
          範例:
        </div>
        <q-card-section>
          顏色:
          <div>
            <q-btn :class="handleParadigmColorClass(color)" @click="handleSelectParadigm(color)" dense
              v-for="(color, index) in colors['options']" :key="index">
              <ParaDigmColor :color="color" />
            </q-btn>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          入射角:
          <div>
            <q-btn class="q-ml-md" @click="handleSelectParadigm(color)" dense
              v-for="(color, index) in colors['options']" :key="index">
              <SvgColor :propsAngle="angles['value']" :propsParadigm="paradigm" :propsColor="color" />
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>

</template>


<style>
.button-init {
  border: 2px solid orange
}

;
</style>
