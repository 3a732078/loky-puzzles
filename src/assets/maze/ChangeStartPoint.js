export default function (boardData, startPoint) {
  const newBoardData = boardData;
  const startPoint =
    startType === 1
      ? [
          {
            color: [69, 69, 69],
            xy: [(boundary * 60) / 2, boundary * 60],
            dx: 0,
            dy: -20,
          },
        ]
      : startType === 2
      ? [
          {
            color: [69, 69, 69],
            x1: [(boundary * 60) / 2, boundary * 60],
            dx: 20,
            dy: -20,
          },
        ]
      : [
          {
            color: [69, 69, 69],
            x1: [(boundary * 60) / 2, boundary * 60],
            dx: -20,
            dy: -20,
          },
        ];
  newBoardData["emits"] = newBoardData["emits"].concat(startPoint);

	return newBoardData
}
