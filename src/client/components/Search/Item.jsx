import { Link } from "react-router-dom";
import { $Wrapper } from "./Item.styled";

const Item = ({ imgSrc, title, link, onClick = () => {} }) => {
  const item = (
    <>
      {imgSrc && <img src={imgSrc} alt={title} className="pic" />}
      <span className="title">{title}</span>
    </>
  );

  return (
    <$Wrapper>
      {link ? (
        <Link to={link} className="searchLink" {...{ onClick }}>
          {item}
        </Link>
      ) : (
        item
      )}
    </$Wrapper>
  );
};

export default Item;
