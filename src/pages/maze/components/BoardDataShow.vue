<script>
export default {
  inject: [
    "provideBoardData",
    "provideAreas",
    "provideEmits",
    "provideMirrors",
  ],
  data() {
    return {
      boardData: this.provideBoardData,
      areas: this.provideAreas,
      emits: this.provideEmits,
      mirrors: this.provideMirrors,
    };
  },
};
</script>

<template>
  <div class="q-ma-md q-pa-sm" style="border: 2px solid orange" v-if="boardData !== null">
    <q-list bordered class="rounded-borders">
      <!-- areas -->
      <q-expansion-item expand-separator label="Areas">
        <div v-for="(rowAreas, index) in areas" :key="index" class="q-pa-sm" style="border: 2px dashed orange">
          <div v-for="(area, index) in rowAreas" :key="index" class="q-pa-sm" style="border: 2px dashed black">
            <div>Coordinate:{{ area["coordinate"] }}</div>
            <q-separator />
            <div>mirror:{{ area["mirror"] }}</div>
            <q-separator />
            <div>type:{{ area["type"] }}</div>
            <q-separetor />
            <div>resultColor:{{ area['resultColor'] }}</div>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item expand-separator label="Mirrors">
        <div v-for="(mirror, index) in mirrors" :key="index" class="q-pa-sm" style="border: 2px dashed orange">
          <div>color: {{ mirror["color"] }}</div>
          <div>points:{{ mirror["points"] }}</div>
          <div>DX,DY:{{ mirror["dx"] }},{{ mirror["dy"] }}</div>
        </div>
      </q-expansion-item>

      <q-expansion-item expand-separator label="Emits">
        <!--  -->
        <div v-for="(line, index) in emits" :key="index" class="q-pa-sm" style="border: 2px dashed orange">
          <h6>line:</h6>
          <div>color:{{ line["color"] }}</div>
          <div>s:{{ line["s"] }}</div>
          <div>e:{{ line["e"] }}</div>
          <div>DX,DY:{{ line["dx"] }},{{ line["dy"] }}</div>
        </div>
      </q-expansion-item>
    </q-list>
  </div>
</template>
