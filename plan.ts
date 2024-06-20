// Вспомогательная функция для борьбы с проблемой плавающей точки в JS

const fixFloatingPoint = (num: number): number => Math.round(num * 1000) / 1000;

/**
 * В построении задачи присутствует неопределенность с системой координат:
 * 1. SVG и браузер использует направление оси абсцисс слева направо и оси ординат сверху вниз.
 * 2. Если строить фигуру по представленным в задании данным (длина и угол), то она не совпадет
 * с эскизом из задания - эскиз будет развернут на 180 градусов по часовой стрелке.
 *
 * Чтобы принять во внимание данный нюанс и найти координаты фигуры, на 100% соответсвующей
 * эскизу из задания, функция dataToPoints принимает как аргументы корректирующие коэффициенты 2 и 3:
 * 1. массив данных в виде [длина, угол],
 * 2. коэффициент направления оси абсцисс (по умолчанию 1, в нашем случае -1),
 * 3. коэффициент направления оси ординат (по умолчанию 1, в нашем случае -1),
 * 4. коэффициент масштаба (по умолчанию 1, в нашем случае для перевода данных из мм в см 0,1).
 */

const dataToPoints = (
  data: number[][],
  mult: number = 1,
  xDirCoeff: number = 1,
  yDirCoeff: number = 1,
): string => {
  const res = [0, 0];

  for (const [len, deg] of data) {
    const x: number = res[res.length - 2] + mult * xDirCoeff * len * Math.cos(deg * Math.PI / 180);
    const y: number = res[res.length - 1] + mult * yDirCoeff * len * Math.sin(deg * Math.PI / 180);

    res.push(fixFloatingPoint(x), fixFloatingPoint(y));
  }

  return res.join(' ');
};

console.log('Координаты без поправки на систему координат', dataToPoints([
  [1665, 0],
  [947, 90],
  [557, 0],
  [1300, 90],
  [2225, 180],
  [2239, 270],
], 0.1));

console.log('Координаты с поправкой на систему координат', dataToPoints([
  [1665, 0],
  [947, 90],
  [557, 0],
  [1300, 90],
  [2225, 180],
  [2239, 270],
], 0.1, -1, -1));

/**
 * Модернизированная версия функции, которая возвращает не простую строку, а SVG path. Который можно
 * вставить в редактор и проверить.
 * Например:
 * 1. Путь из задания без поправки на систему координат: https://yqnn.github.io/svg-path-editor/#P=M_0_0_L_166.5_0_L_166.5_94.7_L_222.2_94.7_L_222.2_224.7_L_-0.3_224.7_L_-0.3_0.8_Z
 * 2. Путь из задания с поправкой на систему координат: https://yqnn.github.io/svg-path-editor/#P=M_0_0_L_-166.5_0_L_-166.5_-94.7_L_-222.2_-94.7_L_-222.2_-224.7_L_0.3_-224.7_L_0.3_-0.8_Z
 */

const dataToPath = (
  data: number[][],
  mult: number = 0.1,
  xDirCoeff: number = 1,
  yDirCoeff: number = 1,
): string => {
  const startLetter = 'M';
  const lineLetter = 'L';
  const endLetter = 'Z';
  const store = [[0, 0]];

  for (const [len, deg] of data) {
    const x: number = store[store.length - 1][0] + mult * xDirCoeff * len * Math.cos(deg * Math.PI / 180);
    const y: number = store[store.length - 1][1] + mult * yDirCoeff * len * Math.sin(deg * Math.PI / 180);

    store.push([fixFloatingPoint(x), fixFloatingPoint(y)]);
  }

  const res: string[] = [];

  for (const item of store) {
    res.push(item.join(' '));
  }

  return `${startLetter} ${res.join(` ${lineLetter} `)} ${endLetter}`;
};

console.log('Путь без поправки на систему координат', dataToPath([
  [1665, 0],
  [947, 90],
  [557, 0],
  [1300, 90],
  [2225, 180],
  [2239, 270],
], 0.1));

console.log('Путь с поправкой на систему координат', dataToPath([
  [1665, 0],
  [947, 90],
  [557, 0],
  [1300, 90],
  [2225, 180],
  [2239, 270],
], 0.1, -1, -1));