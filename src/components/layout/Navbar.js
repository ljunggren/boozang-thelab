import { NavLink } from "react-router-dom";
import "./_layout.scss";

const Navbar = ({ toggleOpen, isBtnOpen }) => (
  <section className={isBtnOpen ? "navbar navbar_is_open" : "navbar"}>
    <div className="container">
      <div className="row">
        <div className="col">
          <ul className="links">
            <li>
              <h4>Getting started</h4>

              <ul className="sub_list">
                <li>
                  <NavLink to="/" exact={true} className="link" onClick={toggleOpen}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/introduction" className="link" onClick={toggleOpen}>
                    Introduction
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/overview" className="link" onClick={toggleOpen}>
                    Overview of the tool
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <h4>Timing</h4>

              <ul className="sub_list">
                <li>
                  <NavLink to="/speedGame" className="link" onClick={toggleOpen}>
                    {" "}
                    Speed Game
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/waitGame" className="link" onClick={toggleOpen}>
                    Wait Game
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <h4> Conditional logic</h4>

              <ul className="sub_list">
                <li>
                  <NavLink to="/yellowOrBlue" className="link" onClick={toggleOpen}>
                    Yellow or Blue
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/catOrDog" className="link" onClick={toggleOpen}>
                    Cat or dog
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <h4> Lists, Forms and Tables</h4>

              <ul className="sub_list">
                <li>
                  <NavLink to="/sortedList" className="link" onClick={toggleOpen}>
                    Sorted list
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/unsortedList" className="link" onClick={toggleOpen}>
                    Unsorted List
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/formFill" className="link" onClick={toggleOpen}>
                    Form Fill
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/catshelter" className="link" onClick={toggleOpen}>
                    Cat Shelter
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/tables" className="link" onClick={toggleOpen}>
                    Tables
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <h4> Bug reporting</h4>
              <ul className="sub_list">
                <li>
                  <NavLink to="/visualBugs" className="link" onClick={toggleOpen}>
                    Visual Bugs
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <h4> DOM changes</h4>

              <ul className="sub_list">
                <li>
                  <NavLink to="/scramble" className="link" onClick={toggleOpen}>
                    Scramble items
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/multiScramble" className="link" onClick={toggleOpen}>
                    Multi Scramble
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <h4> Using data</h4>

              <ul className="sub_list">
                <li>
                  <NavLink to="/concatStrings" className="link" onClick={toggleOpen}>
                    Concat strings
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="games">
              <h4> Games</h4>

              <ul className="sub_list">
                <li>
                  <NavLink to="/kittenCollect" className="link" onClick={toggleOpen}>
                    Collecting kittens
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/canvasGame" className="link" onClick={toggleOpen}>
                    Canvas Game
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);
export default Navbar;
