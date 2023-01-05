<script>

export default {
	props: ['color'],
}

</script>

<template>
	<!-- {{area}} -->
	<svg width="10" height="10" view-box="0 0 10 10" v-if="JSON.stringify([0,0,0]) !== JSON.stringify(color)">
		<rect width="100" height="100" :fill="`rgb(${color})`"/>

	</svg>
	<!-- 透鏡 -->
	<svg width="10" height="10" view-box="0 0 10 10" v-else>
		<rect width="100" height="100" stroke="black" fill="none"/>
	</svg>
</template>