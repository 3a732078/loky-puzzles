<script>
export default {
	props: ["propsColor", 'propsAngle'],
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
			terminalCount: 0,
			color: null,
			angle: null,
		};
	},
	watch: {
		propsColor: {
			handler(newValue) {
				console.log('isHandle', newValue);
				this.color = newValue;
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
		getFill: {
			get() {
				return JSON.stringify(this.color) === JSON.stringify([0, 0, 0]) ? 'none' : 'color(' + this.color + ')'
			}
		}
	},
};
</script>

<template>
	<!-- AREA -->
	<!-- {{area}} -->
	<svg width="52" height="52" style="border: 2px dashed orange" view-box="0 0 52 52" v-if="JSON.stringify([0,0,0]) !== JSON.stringify(color)">
		<path :d="getD()" :fill="'rgb(' + color + ')'" />
	</svg>
	<svg width="52" height="52" style="border: 2px dashed orange" view-box="0 0 52 52" v-else>
		<path :d="getD()" stroke="rgb(169,169,169)" fill="none" />
	</svg>

	<!-- 外框 -->
	<svg width="52" height="52" view-box="0 0 52 52" v-if="getIsSet && getAreaType === 'terminal'">
		<rect x="2" y="2" width="48" height="48" rx="4" :fill="'rgb(' + getTerminalColor + ')'" />

		<rect x="12" y="12" width="28" height="28" rx="14" :fill="'rgb(' + getResultColor + ')'" />

	</svg>
</template>
