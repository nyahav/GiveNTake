import { Rating } from "flowbite-react";

const MAX_STARS = 5;
const Stars = ({ grade }) => {
    const flooredGrade = Math.floor(grade);
    const starsJsx = Array.from({ length: MAX_STARS }).map((k,i) => 
        <Rating.Star filled={i < flooredGrade ? true : false} key={i} />
    );
    
    return <>
        <Rating className="mb-2">
            {starsJsx}
            {/*<p className="pt-4 ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{grade} out of {MAX_STARS}</p>*/}
        </Rating>
     </>;
};

export default Stars;