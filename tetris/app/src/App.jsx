import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

var mapInit = [];
for (var i = 0; i < 30; i++) {
  var row = [];
  for (var j = 0; j < 20; j++) {
    row.push(0);
  }
  mapInit.push(row);
}
var initialPiceState = {
  topx: 4,
  topy: -2,
  matrix: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  color: null,
};
const allColors = ["red", "green", "blue"];
const allTypes = {
  p1: [
    [1, 1, 1],
    [0, 1, 0],
    [1, 1, 1],
  ],
  p2: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  p3: [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  p4: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],
};

function cratePiece() {
  var newPiece = initialPiceState;
  newPiece.matrix =allTypes[Object.keys(allTypes)[Math.floor(Math.random() * 4)]];
  newPiece.color = allColors[Math.floor(Math.random()*3)];
  return newPiece;
}

var loop;

function App() {
  const [gameboard, setGameBoard] = useState(mapInit);
  const [piece, setPiece] = useState(cratePiece());
  var [flag , setFlag] = useState(false)
  var [finish , setFinish] = useState(false)


  useEffect(()=>{
    loop =  setInterval(()=>{
      setFlag(true)
    }, 300);
    return     ()=>clearInterval(loop)
  },[])
  
  useEffect(() => {
    if(finish){
      console.log("girdi")
      document.removeEventListener('keydown' , keyPress)
      return
    }
    
    function down() {
      setPiece((prev) => {
        var deepcopy = JSON.parse(JSON.stringify(prev));
        deepcopy.topy++;
        return deepcopy;
      });
    }

    function left() {
      for(var i = 0 ; i < 3 ; i++){
        for(var j = 0 ; j< 3 ; j++){
          if(piece.matrix[i][j] != 0 && piece.topx + j - 1 < 0 ){
            return
          }
        }
      }

      setPiece((prev) => {
        var deepcopy = JSON.parse(JSON.stringify(prev));
        deepcopy.topx--;
        return deepcopy;
      });
    }

    function right() {
      for(var i = 0 ; i < 3 ; i++){
        for(var j = 0 ; j< 3 ; j++){
          if(piece.matrix[i][j] != 0 && piece.topx + j + 1 >= 20){
            return
          }
        }
      }
  
      setPiece((prev) => {
        var deepcopy = JSON.parse(JSON.stringify(prev));
        deepcopy.topx++;
        return deepcopy;
      });
    }

    function keyPress({key , code}){
      if(key == "ArrowDown"){
        down()
      }
      else if(key == "ArrowLeft"){
        left()
      }
      else if(key == "ArrowRight"){
        right()
      }
    }
    if(flag){
      down()
      setFlag(false)
    }
    document.addEventListener('keydown',keyPress) 
    return () =>{
      document.removeEventListener('keydown' , keyPress)
    };
  },[piece , gameboard , flag , finish]);

  useEffect(()=>{
    if(finish) return
    for(let i = 0 ; i <3 ; i++){
      for(let j = 0 ; j <3 ; j++){
        let p1 = piece.topy + i  + 1
        let p2 = piece.topx + j 
        if(p1 < 0) continue
        else if(p1 >= 30){
          setPiece(cratePiece())
        }
        else if(gameboard[p1][p2] != 0){
          setPiece(cratePiece())
        }
      }
    }
    var flag = false
    for(let i = 0 ; i < 3 ; i++){
      if(flag) break
      for(let j = 0 ; j< 3 ; j++){
        if(flag) break
        if(piece.matrix[i][j] != 0 && piece.topy+i+1 >= 0&&  gameboard[piece.topy+i+1]?.[piece.topx+j] != 0){
          flag = true
          for(let x = 0 ; x < 3 ; x++){
            for(let y = 0 ; y< 3 ; y++){
              if(piece.matrix[x][y] != 0) {
                setGameBoard(prev =>{ 
                  var copy = prev.map(row => row.slice());
                  if(piece.topy+x < 0){
                    setFinish(true)
                  }else{
                    if(copy[piece.topy+x]?.[piece.topx+y] != undefined) copy[piece.topy+x][piece.topx+y] = piece.color
                    return copy
                  }
                  return prev
                })
              }
            }
          }
        
        }
      }
    }

  },[piece , gameboard , finish])

  useEffect(()=>{
    if(finish){
      clearInterval(loop)
      setFlag(false)
    }
  },[finish])

  return (
    <>
      <div className="layout">
        <div className="board">
          {gameboard.map((row, i) =>
            row.map((col, j) => {
             if(piece.matrix[i-piece.topy]?.[j-piece.topx] == 1){
              return <div key={i * 20 + j} className="square" style={{backgroundColor:piece.color}}></div>;
             }
              return <div key={i * 20 + j} className="square" style={{backgroundColor:gameboard[i][j] == 0 ? 'white' :gameboard[i][j]}}></div>;
            })
          )}
        </div>
      </div>
    </>
  );
}

export default App;
