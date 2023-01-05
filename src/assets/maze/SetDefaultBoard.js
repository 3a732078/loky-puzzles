export default function (boundary) {
  let arr = [];
  for (let i = 0; i < boundary; i++) {
    arr = [...arr, i];
  }

  const areas = arr.map((_, yIndex) => {
    const rowData = arr.map((_, xIndex) => {
      return {
        coordinate: {
          x: xIndex,
          y: yIndex
        },
        mirror: {
          isSet:
            yIndex === 0 ||
            yIndex === boundary - 1 ||
            xIndex === 0 ||
            xIndex === boundary - 1
              ? true
              : false,
          color: [255, 255, 255],
          dx:
            yIndex > 0 &&
            yIndex < boundary - 1 &&
            (xIndex === 0 || xIndex === boundary - 1)
              ? 0
              : 1,
          dy:
            (yIndex === 0 || yIndex === boundary - 1) &&
            xIndex > 0 &&
            xIndex < boundary - 1
              ? 0
              : (yIndex === 0 || yIndex === boundary - 1) && yIndex === xIndex
              ? -1
              : 1
        },
        type:
          yIndex === boundary - 1 && xIndex === (boundary - 1) / 2
            ? "startPoint"
            : xIndex === 0 ||
              xIndex === boundary - 1 ||
              yIndex === 0 ||
              yIndex === boundary - 1
            ? "boundary"
            : "area",
        resultColor: [0, 0, 0]
      };
    });

    return rowData;
  });

  // 加入起點 (emits)
  const dx = 10;
  const dy = -10; // 往上
  const s = [(boundary * 60) / 2 + 10, (boundary - 1) * 60];
  let emits = [
    {
      color: [255, 255, 255],
      s,
      dx,
      dy,
      e: [s[0] + dx, s[1] + dy]
    }
  ];

  // 設定邊界 (mirrors)
  const mirrorsTD = areas.map((rowData, yIndex) => {
    const rowMirros = rowData.map((area, xIndex) => {
      let points = [];
      const areaLength = 60;
      const d = 1;
      const areaCenterLength = areaLength / 2;
      const countPoints = areaLength / d + 2;
      const ways = 2;
      const wayPoints = countPoints / 2;
      const direction = [-1, 1];
      for (let i = 0; i < ways; i++) {
        for (let j = 0; j < wayPoints; j++) {
          const pointCenter = [
            xIndex * areaLength + areaCenterLength,
            yIndex * areaLength + areaCenterLength
          ];
          const newPoint = [
            pointCenter[0] + direction[i] * j * area["mirror"]["dx"],
            pointCenter[1] + direction[i] * j * area["mirror"]["dy"]
          ];
          points = [...points, newPoint];
        }
      }
      const color = area["mirror"]["color"];
      const dx = area["mirror"]["dx"];
      const dy = area["mirror"]["dy"];
      return {
        color,
        points,
        dx,
        dy
      };
    });
    return rowMirros;
  });

  let mirrors = [];
  for (let i = 0; i < boundary; i++) {
    for (let j = 0; j < boundary; j++) {
      mirrors.push(mirrorsTD[i][j]);
    }
  }

  return {
    areas,
    mirrors,
    boardEmits: emits
  };
}
