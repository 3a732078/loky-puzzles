<script>
export default {
  props: ["propsLine"],
  data() {
    return {
      line: null,
    };
  },
  watch: {
    propsLine: {
      handler(newValue) {
				// console.log('is watching path, newValue',newValue);
        this.line = newValue;
      },
			deep:true,
			immediate: true,
    },
  },
  computed: {
    getD: {
      get() {
        // console.log("svg emits this.line:", this.line);
        if (this.line === null) {
          return null;
        } else {
          let pointStrings =
            "M" +
            this.line[0]["xy"][0].toString() +
            "," +
            this.line[0]["xy"][1].toString();
          for (const emit of this.line) {
            pointStrings =
              pointStrings +
              "L" +
              (emit["xy"][0] + emit["dx"]).toString() +
              "," +
              (emit["xy"][1] + emit["dy"]).toString();
						// console.log('point string:',pointStrings)
          }
					return pointStrings ;

        }

        return null;
      },
    },
    getColor: {
      get() {
        return this.line === null ? [0, 0, 0] : this.line[0]["color"];
      },
    },
  },
};
</script>

<template>
  

</template>
