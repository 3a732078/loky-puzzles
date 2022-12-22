export default function (level, boardData, createTerminal) {
  const terminals = [
    [], // 0
    [
      // 1
      [1, 0],
      [0, 2],
      [4, 3]
    ],
    [
      // 2
      [0, 3],
      [0, 4],
      [4, 4]
    ],
    [
      [0, 0],
      [1, 0],
      [4, 0]
    ]
  ];
  // 重設終點
  let newBoardData = boardData;

  // 設定終點
  const terminalXY =
    createTerminal !== null ? createTerminal : terminals[level];
  for (const tXY of terminalXY) {
    newBoardData["areas"][tXY[1]][tXY[0]]["type"] = "terminal";
  }

  return newBoardData;
}
