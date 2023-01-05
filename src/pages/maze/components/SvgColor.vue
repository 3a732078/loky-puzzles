<script>
export default {
	props: ["propsColor", 'propsAngle', 'propsParadigm'],
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
			paradigm: null,
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
		},
		propsParadigm: {
			handler(newValue) {
				this.paradigm = newValue;
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
		},
		getImg: {
			get() {
				return 'src/assets/maze/mirror-' + this.color[0].toString()
					+ this.color[1].toString() + this.color[2].toString()
					+ '-' + this.angle['dx'].toString() + '-' + this.angle['dy'] + '.jpg'
			}
		}
	},
};
</script>

<template>
	<!-- AREA -->
	<!-- {{area}} -->
	<img :src="getImg" alt="鏡子" width="60" />

</template>
