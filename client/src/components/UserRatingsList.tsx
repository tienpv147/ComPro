import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Loading from "./Loading";
import {kebabToSpacedPascal} from "../ts/utils/string";

const UserRatingsList = ({
                             data,
                             searchFn,
                         }: {
    data: UserRating[];
    searchFn?: Function;
}) => {


    const [refReset, setRefReset] = useState<number>(0);
    const navigate = useNavigate();
    const statusRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const acceptanceRef = useRef<HTMLDivElement>(null);
    const difficultyRef = useRef<HTMLDivElement>(null);
    const likesRef = useRef<HTMLDivElement>(null);
    const dislikesRef = useRef<HTMLDivElement>(null);
    const starRef = useRef<HTMLDivElement>(null);

    const rankRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);
    const ratingRef = useRef<HTMLDivElement>(null);
    const problemSolvedRef = useRef<HTMLDivElement>(null);
    const recentProblemSolvedRef = useRef<HTMLDivElement>(null);

    const [searchQ, setSearchQ] = useState<string>("");

    const [SortOptions, setSortOptions] = useState<SortOptions>({
        acceptance_rate_count: "",
        difficulty: "",
        title: "",
    });

    const [isSortLoading, setIsSortLoading] = useState<boolean>(false);

    const rankWidth = rankRef.current?.clientWidth;
    const userWidth = userRef.current?.clientWidth;
    const ratingWidth = ratingRef.current?.clientWidth;
    const problemSolvedWidth = problemSolvedRef.current?.clientWidth;
    const recentProblemSolvedWidth = recentProblemSolvedRef.current?.clientWidth;

    useEffect(() => {
        setRefReset(1);
    }, []);

    return (
        <div>
            <div className="flex flex-col">
                <div
                    className="flex flex-row w-full text-[14px] h-[40px] items-center text-[#808080] border-b border-borders select-none">
                    <div
                        id="rank-label"
                        className="h-fit w-fit px-[20px] ml-[10px]"
                        ref={rankRef}
                    >
                        Rank
                    </div>
                    <div
                        id="user-label"
                        className="h-fit w-fit px-[50px] hover:text-white hover:cursor-pointer transition"
                        // className="h-fit w-fit px-[20px] ml-[10px]"
                        ref={userRef}
                    >
                        User
                    </div>
                    <div
                        id="rating-label"
                        // className="h-fit flex-grow px-[20px] hover:text-white hover:cursor-pointer transition"
                        className="h-fit w-fit px-[20px] ml-[10px]"
                        ref={ratingRef}
                    >
                        Rating
                    </div>
                    <div
                        id="problemssolved-label"
                        className="h-fit w-fit px-[20px] ml-[10px]"
                        ref={problemSolvedRef}
                    >
                        Problems Solved
                    </div>
                    <div
                        id="recentproblemsolved-label"
                        className="h-fit w-fit px-[20px] ml-[10px]"
                        ref={recentProblemSolvedRef}
                    >
                        Recent Problems Solved
                    </div>
                </div>
                {data != undefined &&
                data.length !== 0 &&
                ratingRef.current != null ? (
                    <>
                        {isSortLoading ? (
                            <div
                                className="sort-loading-backdrop w-[calc(100%-18px)] h-[calc(100%-126px)] z-[180] absolute top-[100px] ">
                                <div className="relative w-full h-full">
                                    <div className="absolute top-1/2 left-1/2">
                                        <Loading color="white"/>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        {data.map((userRating, index) => (
                            <div
                                className={`h-[40px] w-full text-[14px] hover:text-black duration-150 hover-rating-bg-color`}
                            >
                                <Link
                                    to={`/accounts/${userRating.username}`}
                                    className="w-full h-[40px] flex flex-row whitespace-nowrap "
                                >
                                    <div
                                        // className="flex-grow "
                                        style={{
                                            width: rankWidth,
                                            height: "40px",
                                            lineHeight: "40px",
                                            marginLeft: "10px"
                                        }}
                                    >
                                        <div className="ml-[20px]">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div
                                        // className="flex-grow "
                                        style={{
                                            width: userWidth,
                                            height: "40px",
                                            lineHeight: "40px",
                                        }}
                                    >
                                        <div className="ml-[50px]">
                                            {userRating.username}
                                        </div>
                                    </div>
                                    <div
                                        // className="flex-grow "
                                        style={{
                                            width: ratingWidth,
                                            height: "40px",
                                            lineHeight: "40px",
                                        }}
                                    >
                                        <div className="ml-[30px]">
                                            {userRating.rating}
                                        </div>
                                    </div>
                                    <div
                                        // className="flex-grow "
                                        style={{
                                            width: problemSolvedWidth,
                                            height: "40px",
                                            lineHeight: "40px",
                                        }}
                                    >
                                        <div className="ml-[40px]">
                                            {userRating.problems_solved_count}
                                        </div>
                                    </div>
                                    <div className="flex-grow" style={{ width: recentProblemSolvedWidth, height: "40px", lineHeight: "40px" }}>
                                        <div className="ml-[50px]">
                                            <Link
                                                to={`/problem/${userRating.problems_solved[userRating.problems_solved.length - 1]}`}
                                                className="hover:text-green-500 hover:bg-gray-200"
                                            >
                                                {kebabToSpacedPascal(userRating.problems_solved[userRating.problems_solved.length - 1])}
                                            </Link>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </>
                ) : data != undefined && data.length === 0 ? (
                    <div className="text-[14px] ml-[30px] text-red-600 h-[40px] leading-[40px]">
                        Ratings not found
                    </div>
                ) : (
                    <Loading For="pList"/>
                )}
            </div>
        </div>
    );
};

export default UserRatingsList;
