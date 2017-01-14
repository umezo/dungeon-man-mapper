const React = require('react');
const ReactDOM = require('react-dom');
const classnames = require('classnames');


const MAX_SIZE = 6;
const MAP_SAFE_SIZE = (MAX_SIZE * 2 - 1) + (MAX_SIZE - 1) * 2;
const KEY_WAIT_TIME = 200;

class DungeonManMapper extends React.Component {
  constructor () {
    super();


    const map = [];
    for ( let y = 0 ; y < MAP_SAFE_SIZE ; y++ ) {
      let row = [];
      map.push(row);
      for ( let x = 0 ; x < MAP_SAFE_SIZE ; x++ ) {
        let type = 'none';

        if ( y % 2 == 0 ) {
          type = (x % 2) ? 'path' : 'room';
        } else {
          type = (x % 2) ? 'none' : 'path';
        }

        const isStartCell = (x === 10 && y === 10);
        
        row.push({
          type: type,
          isStartCell: isStartCell,
          isPassed: isStartCell,
          exists: false,
          up: false,
          right: false,
          down: false,
          left: false
        });
      }
    }

    this.state = {
      map: map,
      playerPosition: { x: 10, y: 10 }
    }
  }

  render () {
    const map = this.state.map;
    const playerPosition = this.state.playerPosition;
    return (
      <div className="dungeon-man-mapper" onKeyDown={this._onKeyPress.bind(this)} tabIndex="0">
        <div className="dungeon-man-mapper--map-container">
          {
            map.map( (row, index) => {
              const y = index;
              return (
                <div className="dungeon-man-mapper--map-row" key={index}>
                  {
                    row.map( (cell, index) => {
                      const x = index;
                      const withPlayer = playerPosition.x === x && playerPosition.y === y;

                      const className = classnames( {
                        "dungeon-man-mapper--map-cell": true,
                        [`dungeon-man-mapper--map-cell__type-${cell.type}`]: true,
                        "dungeon-man-mapper--map-cell__is-start-cell": cell.isStartCell,
                        "dungeon-man-mapper--map-cell__is-passed": cell.isPassed,
                        "dungeon-man-mapper--map-cell__with-player": withPlayer
                      });
                      return (<div className={className} key={index}>{withPlayer?"@":""}{cell.exists?"+":""}</div>);
                    })
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  _onKeyPress(event) {
    event.preventDefault();
    const key = event.key;

    console.log( this._timerId, this._prevKey, key );
    if (this._timerId && this._prevKey == key) {

      this._markByKey(this._prevKey, true);
      this._moveByKey( this._prevKey );
      window.clearTimeout(this._timerId);
      this._timerId = null;
    } else {

      this._timerId = window.setTimeout( ((key) => {
        this._markByKey(key);
        this._timerId = null;
      }).bind(this, key), KEY_WAIT_TIME); 
    }
    this._prevKey = key;
  }

  _markByKey(key, force) {
    let x = 0;
    let y = 0;
    switch( key ) {
      case "ArrowUp"   : y = -1; break;
      case "ArrowDown" : y =  1; break;
      case "ArrowLeft" : x = -1; break;
      case "ArrowRight": x =  1; break;
      default:
        return;
    }

    this._markAtCurrnetPosition({x, y}, force);
  }

  _moveByKey(key) {
    let x = 0;
    let y = 0;
    switch( key ) {
      case "ArrowUp"   : y = -1; break;
      case "ArrowDown" : y =  1; break;
      case "ArrowLeft" : x = -1; break;
      case "ArrowRight": x =  1; break;
      default:
        return;
    }

    this._movePlayer({x, y});
  }

  _markAtCurrnetPosition (diff, force) {
    let {x, y} = this.state.playerPosition;
    x += diff.x;
    y += diff.y;
    if ( x < 0 || MAP_SAFE_SIZE <= x ) {
      return;
    }
    if ( y < 0 || MAP_SAFE_SIZE <= y ) {
      return;
    }

    const map = this.state.map;
    map[y][x].exists = force == undefined ? !map[y][x].exists : !!force;

    this.setState({map});
  }

  _onKeyPressAtode (event) {
    event.preventDefault();

  }

  _movePlayer(diff){
    let {x, y} = this.state.playerPosition;
    x = Math.min(Math.max(x + diff.x*2, 0), MAP_SAFE_SIZE - 1),
    y = Math.min(Math.max(y + diff.y*2, 0), MAP_SAFE_SIZE - 1)
    this.state.map[y][x].isPassed = true;
    this.setState({
      map: this.state.map,
      playerPosition: {x, y}
    });
  }
}

window.document.addEventListener('DOMContentLoaded', () => {
  const appContainer = window.document.querySelector('.js-dungeon-man-mapper');
  ReactDOM.render( React.createElement(DungeonManMapper), appContainer );

});
