import { useState, useEffect } from "react";
import Board from "./Board";
import GameOver from "./GameOver";
import GameState from "./GameState";
import Reset from "./Reset";
import gameOverSoundAsset from '../sounds/bomboclat.wav';
import clickSoundAsset from '../sounds/click.wav';

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 1;

const PLAYER_X = 'X';
const PLAYER_O = 'O';

const winningCombinations = [
    //rows
    { combo:[0, 1, 2], strikeClass: "strike-row-1" },
    { combo:[3, 4, 5], strikeClass: "strike-row-2" },
    { combo:[6, 7, 8], strikeClass: "strike-row-3" },

    //columns
    { combo:[0, 3, 6], strikeClass: "strike-column-1" },
    { combo:[1, 4, 7], strikeClass: "strike-column-2" },
    { combo:[2, 5, 8], strikeClass: "strike-column-3" },

    //diagonals
    { combo:[0, 4, 8], strikeClass: "strike-diagonal-1" },
    { combo:[2, 4, 6], strikeClass: "strike-diagonal-2" },

];

function checkWinner(tiles, setStrikeClass, setGameState){
    for(const {combo, strikeClass} of winningCombinations) {
        const tileValue1 = tiles[combo[0]];
        const tileValue2 = tiles[combo[1]];
        const tileValue3 = tiles[combo[2]];

        if(tileValue1 !== null &&
           tileValue1 === tileValue2 && 
           tileValue2 === tileValue3
        ) {
            setStrikeClass(strikeClass);

            if (tileValue1 === PLAYER_X) {
                setGameState(GameState.playerXWins);
            } else {
                setGameState(GameState.playerOWins);
            }
        }
    }

    const AllTilesFilledIn = tiles.every((tile) => tile !== null);
    if (AllTilesFilledIn) {
        setGameState(GameState.draw);
    }
}

function TicTacToe() {
    const [tiles, setTiles] = useState(Array(9).fill(null));
    const[playerTurn, setPlayerTurn] = useState(PLAYER_X);
    const [strikeClass, setStrikeClass] = useState();
    const [gameState, setGameState] = useState(GameState.inProgress);

    const handelTileClick = (index)=>{
        if(gameState !== GameState.inProgress) {
            return;
        }


        if(tiles[index] !== null) return;

        const newTiles = [...tiles];
        newTiles[index] = playerTurn
        setTiles(newTiles);

        if(playerTurn === PLAYER_X) {
            setPlayerTurn(PLAYER_O);
        } else {
            setPlayerTurn(PLAYER_X)
        }
    }

    const handleReset = ()=>{
        // Stop the game over sound
        gameOverSound.pause();
        gameOverSound.currentTime = 0;
        
        // Reset the game state
        setGameState(GameState.inProgress);
        setTiles(Array(9).fill(null));
        setPlayerTurn(PLAYER_X);
        setStrikeClass(null);
    }

    useEffect(
        ()=>{ checkWinner(tiles, setStrikeClass, setGameState); }, 
        [tiles]
    );

    const playClickSound = ()=> {
        const sound = new Audio(clickSoundAsset);
        sound.volume = 0.5;
        sound.play();
    };

    useEffect(
        ()=>{
            if(tiles.some((tile) => tile !== null)) {
                playClickSound();
            }
        }, [tiles]
    );

    useEffect(
        ()=> {
            if(gameState !== GameState.inProgress) {
                gameOverSound.play();
            }
        }, [gameState]
    );

    return (
        <div>
            <h1>Tic Tac Toe</h1>
            <Board 
                playerTurn={playerTurn} 
                tiles={tiles} 
                onTileClick={handelTileClick}
                strikeClass={strikeClass} 
            />
            <GameOver gameState={gameState} />
            <Reset gameState={gameState} onReset={handleReset}/>
        </div>
    );
}

export default TicTacToe

