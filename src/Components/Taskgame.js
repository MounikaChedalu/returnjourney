import React, { useState, useEffect } from "react";
import "./Taskgame.css";

const difficulties = {
  Easy: 10,
  Medium: 15,
  Hard: 25
};

const App = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    difficulty: "Easy"
  });

  const [gameState, setGameState] = useState("registration");
  const [score, setScore] = useState(0);
  const [boxColor, setBoxColor] = useState("white");
  const [startTime, setStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeDuration, setTimeDuration] = useState(1500); // Initial duration in milliseconds (1.5 seconds)

  const toggleColor = () => {
    setBoxColor((prevColor) => (prevColor === "red" ? "green" : "red"));
  };

  useEffect(() => {
    let timerInterval;
    let colorChangeInterval;

    if (timerRunning) {
      timerInterval = setInterval(() => {
        const elapsedSeconds = (performance.now() - startTime) / 1000;
        const remainingSeconds = Math.max(0, 40 - elapsedSeconds);
        setTimeLeft(remainingSeconds.toFixed(0));

        if (remainingSeconds === 0) {
          setGameState("gameOver");
          setTimerRunning(false);
          clearInterval(timerInterval);
          console.log(setTimeDuration);
        }
      }, 1000);

      colorChangeInterval = setInterval(toggleColor, timeDuration);
    } else {
      clearInterval(timerInterval);
      clearInterval(colorChangeInterval);
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(colorChangeInterval);
    };
  }, [timerRunning, startTime, timeDuration]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    setGameState("game");
    startGame();
  };

  const startGame = () => {
    const initialScore = difficulties[user.difficulty] || difficulties["Easy"];
    setScore(0);
    setBoxColor("red");
    setStartTime(performance.now());
    setTimerRunning(true);
    console.log(initialScore);
  };

  const handleBoxClick = () => {
    if (boxColor === "green") {
      setScore(score + 1);
      if (score + 1 === getWinningScore()) {
        setGameState("win");
        setTimerRunning(false);
      }
    } else {
      setGameState("gameOver");
      setTimerRunning(false);
    }
  };

  const handleRestartClick = () => {
    setGameState("game");
    setScore(0);
    setBoxColor("red");
    setTimeLeft(40);
    startGame();
  };

  const getWinningScore = () => {
    return difficulties[user.difficulty] || difficulties["Easy"];
  };

  return (
    <div className="App">
      {gameState === "registration" && (
        <div>
          <form onSubmit={handleRegistrationSubmit} className="form-container">
            <div>
              <label htmlFor="name" className="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                className="name-feild"
                value={user.name}
                onChange={handleInputChange}
                required
                minLength={6} 
                maxLength={40} 
              />
            </div>
            <div>
              <label htmlFor="email" className="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="email-feild"
                value={user.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="mobile" className="mobile">Mobile Number:</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className="mobile-feild"
                value={user.mobile}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}" 
              />
            </div>
            <div>
              <label htmlFor="difficulty" className="level">Difficulty Level:</label>
              <select
                id="difficulty"
                name="difficulty"
                value={user.difficulty}
                className="selectlevel"
                onChange={handleInputChange}
                required
              >
                {Object.keys(difficulties).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="start-button">Start Game</button>
          </form>
        </div>
      )}

      {gameState === "game" && (
        <div className="game-container">
          <h1>Color Changing Game</h1>
          <div className={`box ${boxColor}`} onClick={handleBoxClick}></div>
          <p>Time Left: {timeLeft} seconds</p>
          <p>
            Score: {score}/{difficulties[user.difficulty]}
          </p>
        </div>
      )}

      {gameState === "win" && (
        <div className="game-container">
          <h1>You Win!</h1>
          <p>
            Your score: {score}/{difficulties[user.difficulty]}
          </p>
          <button onClick={handleRestartClick}>Restart</button>
        </div>
      )}

      {gameState === "gameOver" && (
        <div className="game-container">
          <h1>Game Over!</h1>
          <p>
            Your score: {score}/{difficulties[user.difficulty]}
          </p>
          <button onClick={handleRestartClick}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default App;






