import { useState } from "react";
import "./timing.scss";
import { WaitGameVideos } from "../text/videos/VideoSections";
import { WaitGameIntro } from "../text/Intros";
import { WaitGameTestInfo } from "../text/WhyLearn";
import { WaitGameWhatToTest } from "../text/WhatToTest";
import ResultMessages from "../compMessages/ResultMessages";

const WaitGame = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [offsetTime, setOffsetTime] = useState(0);
  const [messageData, setMessageData] = useState({
    isOpenWrapper: false,
    resultMessage: "",
    subMessage: "",
    isSuccess: true,
  });
  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      //timestamp for start
      setOffsetTime(Date.now());
      setMessageData({
        ...messageData,
        isOpenWrapper: false,
        resultMessage: "",
        subMessage: "",
      });
    }
  };
  //time difference between stop and start
  const delta = () => {
    //timestamp for stop
    let now = Date.now();
    let elapsedTime = now - offsetTime;
    setOffsetTime(now); //new start point?
    return elapsedTime;
  };

  //check if it's more than 5s and by how much
  const compare = () => {
    const limit = 5000;
    const difference = delta();
    if (difference >= limit) {
      let overflow = difference - limit;
      setMessageData({
        isOpenWrapper: true,
        resultMessage: "Success!",
        subMessage: `${overflow} ms above 5 seconds.`,
        isSuccess: true,
      });
    } else {
      setMessageData({
        ...messageData,
        isOpenWrapper: true,
        resultMessage: "Try again!",
        isSuccess: false,
      });
    }
  };
  const handleStop = () => {
    setIsRunning(false);
    compare();
  };

  return (
    <div className="row justify-content-between">
      <div className="col-12 col-md-6 col-xl-5">
        <section className="timing_section">
          <WaitGameIntro />
          <div className="game_space">
            <button onClick={handleStart} className="form_btn add" data-testid="startBtn">
              Start Game
            </button>

            {isRunning && (
              <button className="form_btn delete" onClick={handleStop} data-testid="endBtn">
                End Game
              </button>
            )}
            <ResultMessages messageData={messageData} />
          </div>
        </section>
      </div>
      <div className="col-12 col-md-6">
        <WaitGameTestInfo />
        <WaitGameWhatToTest />
        <WaitGameVideos />
      </div>
    </div>
  );
};

export default WaitGame;
