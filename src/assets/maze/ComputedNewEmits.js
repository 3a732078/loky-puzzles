export default function (boardEmits, mirrors, areas, speed) {
  // console.log("start compute new emits areas:", areas);

  let count = 0;
  let x, y;

  for (const line of boardEmits) {
    if (line["dx"] !== 0 || line["dy"] !== 0) {
      // 第一個線加入下一個emits
      let result = false; // 是否有光點與鏡子重疊
      let hold = null;
      let isTerminal = false;
      for (const rowAreas of areas) {
        for (const area of rowAreas) {
          // console.log("area:", area);
          const { mirror, coordinate, type } = area;

          if (mirror["isSet"]) {
            const xyCenter = [
              60 * coordinate["x"] + 30,
              60 * coordinate["y"] + 30
            ];
            const countOfPoint = 30;
            const direction = [-1, 1];
            for (let way = 0; way < 2; way++) {
              for (let countP = 0; countP < countOfPoint; countP++) {
                if (
                  JSON.stringify([
                    xyCenter[0] + direction[way] * countP * mirror["dx"],
                    xyCenter[1] + direction[way] * countP * mirror["dy"]
                  ]) === JSON.stringify(line["e"])
                ) {
                  // 光線撞到鏡子了
                  if (type === "terminal") {
                    isTerminal = true;
                    x = coordinate["x"];
                    y = coordinate["y"];
                  } else {
                    result = true;
                    hold = mirror;
                  }
                }
              }
            }
          }
        }
      }
      if (result === true) {
        // ##### 新增折射路線
        const refractionColor = [
          hold["color"][0] === 0 ? line["color"][0] : 0,
          hold["color"][1] === 0 ? line["color"][1] : 0,
          hold["color"][2] === 0 ? line["color"][2] : 0
        ];
        if (
          refractionColor[0] !== 0 ||
          refractionColor[1] !== 0 ||
          refractionColor[2] !== 0
        ) {
          const dx =
            hold["dy"] === 0
              ? 0
              : hold["dx"] === 0
              ? line["dx"]
              : line["dx"] !== 0
              ? line["dx"]
              : line["dy"] * hold['dy'] * -1;
          const dy =
            hold["dx"] === 0
              ? 0
              : hold["dy"] === 0
              ? line["dy"]
              : line["dy"] !== 0
              ? line["dy"]
              : line["dx"] * hold["dy"] * -1;
          const newline = {
            color: refractionColor,
            s: [line["e"][0], line["e"][1]],
            e: [line["e"][0] + dx, line["e"][1] + dy],
            dx,
            dy
          };
          console.log(
            "add new refraction line:",
            newline,
            "line:",
            line,
            "hold:",
            hold,
            "count",
            count
          );
          boardEmits.push(newline);
        }
        // #####  新增一的反射的line
        const newColor = [
          hold["color"][0] === 169 && 169 === line["color"][0]
            ? hold["color"][0]
            : 0,
          hold["color"][1] === 169 && 169 === line["color"][1]
            ? hold["color"][1]
            : 0,
          hold["color"][2] === 169 && 169 === line["color"][2]
            ? hold["color"][2]
            : 0
        ];
        if (newColor[0] !== 0 || newColor[1] !== 0 || newColor[2] !== 0) {
          const dx =
            hold["dx"] === 0
              ? -line["dx"]
              : hold["dy"] === 0
              ? line["dx"]
              : line["dy"] === 0
              ? 0
              : line["dx"] === 0
              ? line["dy"] * hold['dy']
              : -line["dx"];
          const dy =
            hold["dy"] === 0
              ? -line["dy"]
              : hold["dx"] === 0
              ? line["dy"]
              : line["dx"] === 0
              ? 0
              : line["dy"] === 0
              ? line["dx"] * hold['dy']
              : -line["dy"];
          const reflectionLine = {
            color: newColor,
            s: [line["e"][0], line["e"][1]],
            e: [line["e"][0] + dx, line["e"][1] + dy],
            dx,
            dy
          };
          boardEmits.push(reflectionLine);
        }

        // 停止這一個光
        // 1. 後退一步
        // 2. dy = 0 , dx =0
        boardEmits[count]["e"] = [
          boardEmits[count]["e"][0] - boardEmits[count]["dx"],
          boardEmits[count]["e"][1] - boardEmits[count]["dy"]
        ];
        boardEmits[count]["dy"] = 0;
        boardEmits[count]["dx"] = 0;

        //
      } else if (!isTerminal) {
        // console.log("continue,boardEmit:", boardEmits[count]);
        // 光沒有碰到鏡子
        // 新增往下一個點
        const dx = line["dx"] > 0 ? speed : line["dx"] < 0 ? -speed : 0;
        const dy = line["dy"] > 0 ? speed : line["dy"] < 0 ? -speed : 0;
        if (dx !== 0 || dy !== 0) {
          boardEmits[count]["dx"] = dx;
          boardEmits[count]["dy"] = dy;
          boardEmits[count]["e"] = [
            parseInt(boardEmits[count]["e"][0]) + parseInt(dx),
            parseInt(boardEmits[count]["e"][1]) + parseInt(dy)
          ];
        }
      } else {
        // 設定光的顏色到終點

        areas[y][x]["resultColor"] = line["color"];
      }
    }
    count++;
  }
}
