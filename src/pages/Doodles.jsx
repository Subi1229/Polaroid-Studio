import fav from "../assets/fav.png";
import cherry from "../assets/cherry.png";
import lips from "../assets/lips.png";
import love from "../assets/love.png";
import bow from "../assets/bow.png";
import heartOutline from "../assets/heart-outline.png";

export default function Doodles() {
  return (
    <div className="doodle-canvas">

      <img src={fav} className="doodle fav" />
      <img src={cherry} className="doodle cherry" />
      <img src={heartOutline} className="doodle heart-outline-left" />
      <img src={heartOutline} className="doodle heart-outline-top" />
      <img src={lips} className="doodle lips" />
      <img src={bow} className="doodle bow-bg" />
      <img src={love} className="doodle love" />

    </div>
  );
}