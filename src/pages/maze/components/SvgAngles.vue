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
			dx: 11,
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
		getD: function () {
			let x = 25;
			let y = 29;
			let y2 = 19;
			let xTolerance = 5;
			let yTolerance = 2;
			let pathString =
				"M " + //M
				(x - this.angle['dx'] * this.dx - xTolerance).toString() +
				"," +
				(y - this.angle['dy'] * this.dy - yTolerance).toString() +
				"L " + //L
				(x + this.angle['dx'] * this.dx + xTolerance).toString() +
				"," +
				(y + this.angle['dy'] * this.dy + yTolerance).toString() +
				"L " + //L
				(x + this.angle['dx'] * this.dx + xTolerance).toString() +
				"," +
				(y2 + this.angle['dy'] * this.dy + yTolerance).toString() +
				"L " + //L
				(x - this.angle['dx'] * this.dx - xTolerance).toString() +
				"," +
				(y2 - this.angle['dy'] * this.dy - yTolerance).toString() +
				"Z";
			return pathString;
		},
	},
	computed: {
		getIsSet: {
			get() {
				return this.angle === null
					? null
					: //  true
					this.angle["isSet"];
			},
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
				return [0, 0, 0];
			}
		},
		getImg: {
      get() {
        return 'src/assets/maze/mirror-' + "000" +'-'
          + this.angle['dx'].toString() + '-' + this.angle['dy'] + '.jpg'
      }
    }
	},
};
</script>

<template>
  <img :src="getImg" alt="鏡子" width="60"  v-if="angle['isSet']" />

	<!-- 取消 -->
	<div v-else class="text-h5 q-pa-md" >
		X
	</div>

</template>
