import { useState } from "react";
import "./scramble.scss";
import { MultiScrambleIntro } from "../text/Intros";
import { MultiScrambleTestInfo } from "../text/WhyLearn";
import { MultiScrambleVideos } from "../text/videos/VideoSections";

const MultiScramble = () => {
  const [contentAdd, setContentAdd] = useState("Add");
  const [contentDelete, setContentDelete] = useState("Delete");
  return (
    <div className="row justify-content-between">
      <div className="col-12 col-md-6 col-xl-5">
        <section className="scramble_section">
          <MultiScrambleIntro />
          <form className="list_form" data-testid="multiscramble-form">
            <label htmlFor="">Change wording for Add:</label>
            <br />
            <input type="text" required value={contentAdd} data-testid="add-input" onChange={(e) => setContentAdd(e.target.value)} />
            <label htmlFor="">Change wording for Delete:</label>
            <br />
            <input type="text" required value={contentDelete} data-testid="delete-input" onChange={(e) => setContentDelete(e.target.value)} />
          </form>

          <div className="multiscramble_btn_section" data-testid="btn-section">
            <div className="row justify-content-between">
              <div className="col">
                <input type="button" value={`${contentAdd} Koala`} className="form_btn add blue" data-testid="add-koala" />
                <input type="button" value={`${contentAdd} Kangaroo`} className="form_btn add purple" data-testid="add-kangaroo" />
                <input type="button" value={`${contentAdd} Dolphin`} className="form_btn add pink" data-testid="add-dolphin" />
              </div>
              <div className="col">
                <input type="button" value={`${contentDelete} Koala`} className="form_btn add blue" data-testid="delete-koala" />
                <input type="button" value={`${contentDelete} Kangaroo`} className="form_btn add purple" data-testid="delete-kangaroo" />
                <input type="button" value={`${contentDelete} Dolphin`} className="form_btn add pink" data-testid="delete-dolphin" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="col-12 col-md-5">
        <MultiScrambleTestInfo />
        <MultiScrambleVideos />
      </div>
    </div>
  );
};

export default MultiScramble;
