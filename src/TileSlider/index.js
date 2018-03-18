import React, { Component } from 'react';
import './styles.css';

/**
 * Generates an array of numbers starting at 1.
 *
 * @param  {Number} size
 * @return {Array}
 */
const generateNumbers = size =>
  Array.apply(null, { length: size }).map((_, index) => index + 1);

/**
 * Shuffles an array.
 *
 * @param  {Array}   array
 * @param  {Boolean} [shouldMutate=false]
 * @return {Array}
 */
const shuffleArray = (array = [], shouldMutate = false) => {
  const arr = shouldMutate ? array : array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

/**
 * Generates solution.
 *
 * @param  {Number} size
 * @return {Object}
 */
const generateSolution = size => {
  const numbers = generateNumbers(size ** 2 - 1);
  numbers.push(null);
  const solution = [];

  while (numbers.length) {
    solution.push(numbers.splice(0, size));
  }

  return {
    solution,
    solutionJSON: JSON.stringify(solution),
  };
};

/**
 * Generates puzzle.
 *
 * @param  {Number} size
 * @return {Object}
 */
const generatePuzzle = size => {
  if (size < 2) {
    throw Error('Puzzle size must be an integer greater than 1.');
  }

  const numbers = generateNumbers(size ** 2 - 1);
  const random = shuffleArray(generateNumbers(size ** 2 - 1));

  // make sure numbers are random
  if (JSON.stringify(random) === JSON.stringify(numbers)) {
    return generatePuzzle(size);
  }

  random.push(null);
  const puzzle = [];

  while (random.length) {
    puzzle.push(random.splice(0, size));
  }

  return { puzzle };
};

export default class TileSlider extends Component {
  state = {
    size: this.props.size,
    ...generatePuzzle(this.props.size),
    ...generateSolution(this.props.size),
  };

  /**
   * Swaps tile with empty one when clicked.
   *
   * @param {SyntheticEvent}
   */
  handleClick = ({ target }) => {
    const puzzle = this.state.puzzle.map(row => row.slice());
    let { value, x, y } = target.dataset;
    value = parseInt(value, 10);
    x = parseInt(x, 10);
    y = parseInt(y, 10);

    if (puzzle[y][x - 1] === null) {
      puzzle[y][x - 1] = value;
    } else if (puzzle[y][x + 1] === null) {
      puzzle[y][x + 1] = value;
    } else if (puzzle[y - 1] && puzzle[y - 1][x] === null) {
      puzzle[y - 1][x] = value;
    } else if (puzzle[y + 1] && puzzle[y + 1][x] === null) {
      puzzle[y + 1][x] = value;
    } else {
      return;
    }

    puzzle[y][x] = null;
    this.setState({ puzzle }, () => {
      // check win state
      if (JSON.stringify(puzzle) === this.state.solutionJSON) {
        setTimeout(() => alert('Puzzle solved!'), 100);
      }
    });
  };

  /**
   * Shuffles current puzzle.
   */
  shufflePuzzle = () => {
    this.setState(({ puzzle }) => generatePuzzle(puzzle.length));
  };

  /**
   * Generates new puzzle and solution.
   *
   * @param {SyntheticEvent} event
   */
  newPuzzle = event => {
    event.preventDefault();
    this.setState(({ size }) => ({
      ...generatePuzzle(size),
      ...generateSolution(size),
    }));
  };

  /**
   * Updates size (used when generating a new puzzle).
   *
   * @param {SyntheticEvent}
   */
  changeSize = ({ target }) => {
    this.setState({ size: parseInt(target.value, 10) });
  };

  render() {
    const { puzzle, size } = this.state;

    return (
      <div>
        <table>
          <tbody>
            {puzzle &&
              puzzle.map((rows, y) => (
                <tr>
                  {rows.map((value, x) => (
                    <td>
                      <button
                        data-value={value}
                        data-x={x}
                        data-y={y}
                        onClick={this.handleClick}
                      >
                        {value}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <br />

        <button onClick={this.shufflePuzzle}>Shuffle Puzzle</button>
        <br />
        <br />

        <form onSubmit={this.newPuzzle}>
          <label>
            Size (Row/Column):&nbsp;
            <input
              min={2}
              onChange={this.changeSize}
              type="number"
              value={size}
            />
            &nbsp;
            <input type="submit" value="New Puzzle" />
          </label>
        </form>
      </div>
    );
  }
}
