import { useState } from "react";
import "./visualBugs.scss";
import { VisualBugsVideos } from "../text/videos/VideoSections";
import { VisualBugsIntro } from "../text/Intros";
import { VisualBugsTestInfo } from "../text/WhyLearn";

const VisualBugs = () => {
  const [index, setIndex] = useState(0);
  const animals = ["zebra", "cheetah", "lion", "giraffe", "meerkat", "elephant", "leopard"];

  const images = animals.map((animal, i) => {
    const imgPath = {
      name: animal,
      image: require(`../../img/${animal}.jpg`),
    };
    return <img src={imgPath.image} key={i} alt={imgPath.name} />;
  });
  //before
  const animalImg = images[index];
  const animalLabel = animals[index];

  const handleClick = () => {
    //7 images: if index < 6 (0-5), add 1
    if (index < animals.length - 1) {
      setIndex((index) => index + 1);
    } else {
      setIndex(0);
    }
  };

  return (
    <div className="row justify-content-between">
      <div className="col-12 col-md-6 col-xl-5">
        <section className="visual_bugs_section">
          <VisualBugsIntro />

          <div></div>
          <div className="aspect_ratio_box">
            <div className="aspect_ratio_inside">{animalImg}</div>
          </div>
          <div className="label_wrapper">
            <p>{animalLabel}</p>
          </div>
          <button className="form_btn add" onClick={handleClick}>
            Next image
          </button>
        </section>
      </div>
      <div className="col-12 col-md-6">
        <VisualBugsTestInfo />
        <VisualBugsVideos />
      </div>
    </div>
  );
};

export default VisualBugs;
