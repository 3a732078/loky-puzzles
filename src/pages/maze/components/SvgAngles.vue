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
		}
	},
};
</script>

<template>
	<!-- AREA -->
	<!-- {{area}} -->
	<svg width="52" height="52" style="border: 2px dashed orange" view-box="0 0 52 52" v-if="angle['isSet']">
		<path :d="getD()" :fill="'rgb(' + [169, 169, 169] + ')'" />
	</svg>

	<!-- 取消 -->
	<svg width="52" height="52" style="border: 2px dashed orange" view-box="0 0 52 52" v-else>
		<path d="M2,2 L 12,2 L52,42 L42,42 Z" :fill="'rgb(' + [169, 0, 169] + ')'" />
		<path d="M52,2 L 42,2 L2,42 L12,42 Z" :fill="'rgb(' + [169, 0, 169] + ')'" />
	</svg>

	<!-- 外框 -->
	<svg width="52" height="52" view-box="0 0 52 52" v-if="getIsSet && getAreaType === 'terminal'">
		<rect x="2" y="2" width="48" height="48" rx="4" :fill="'rgb(' + getTerminalColor + ')'" />

		<rect x="12" y="12" width="28" height="28" rx="14" :fill="'rgb(' + getResultColor + ')'" />

	</svg>
</template>
