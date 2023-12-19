import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios, {AxiosError} from "axios";
import {API_URL} from "../App";
import MainHeading from "./MainHeading";
import CustomNavbar from "./CustomNavbar";
import UserRatingsList from "./UserRatingsList";

const UserRatings = ({
                         token,
                         id
                     }: {
    token: string | null;
    id: string | null;
}) => {

    const [username, setUsername] = useState<string>("");
    const [verified, setVerified] = useState<boolean>(false);
    const [refReset, setRefReset] = useState<number>(0);
    const navigate = useNavigate();

    const [searchQ, setSearchQ] = useState<string>("");

    const [SortOptions, setSortOptions] = useState<SortOptions>({
        acceptance_rate_count: "",
        difficulty: "",
        title: "",
    });

    const [userRatings, setUserRatings] = useState<UserRating[]>([]);

    const [customNavData, setCustomNavData] = useState<Navbar>({ items: [
            { text: "USER RATINGS", link_path: "/ratings" },
        ]});

    const handleCustomNavData = (customNavBar: Navbar) => {
        const navItems = [
            { text: "USER RATINGS", link_path: "/ratings" },
        ]

        if (userRatings.length >= 3) {
            const topThreeUsers = userRatings.slice(0, 3);
            topThreeUsers.forEach((userRating, index) => {
                navItems.push(
                    {
                        text: `Top ${index + 1}. ${userRating.username}`,
                        link_path: `/accounts/${userRating.username}`
                    }
                )
            });
        }

        customNavBar.items = navItems

        return customNavBar;
    }

    useEffect(() => {
        axios
            .get(`${API_URL}/api/accounts/id/${id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then(({data}) => {
                setUsername(data.username);
                setVerified(true);
            })
            .catch((e: AxiosError) => {
                console.log(e);
                navigate("/sorry");
                setVerified(false);
            });

        axios
            .get(`${API_URL}/api/ratings/all`)
            .then(({data}) => {
                setUserRatings(data);
            })
            .catch((e: AxiosError) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        handleCustomNavData(customNavData);
    }, []);

    const handleSearch = async (
        searchQuery: string,
    ) => {
        try {
            const { data } = await axios.get(
                `${API_URL}/api/ratings/all?search=${searchQuery}`
            );
            setUserRatings(data);
        } catch (error) {
            console.error("Error searching:", error);
        }
    };

    useEffect(() => {
        setRefReset(1);
    }, []);

    return (
        <>
            {verified ? (
                <MainHeading data={{
                    username: username,
                    items: [
                        {text: "Problem List", link_path: "/problemset"},
                        {text: "Ratings", link_path: "/ratings"},
                    ],
                }}/>
            ) : (
                <MainHeading data={{status: "none"}}/>
            )}

            <div className="h-[calc(100vh-60px)] overflow-hidden bg-black">
                <div
                    id="cont"
                    className="relative flex flex-row h-[calc(100vh-60px)] w-full mt-[8px] "
                >
                    <div
                        id="explanation"
                        className="h-[calc(100%-16px)] bg-black border border-borders ml-[8px] rounded-lg w-[calc(100%-16px)] overflow-hidden"
                    >
                        <div className="w-full bg-black border-b border-borders ">
                            <div className="ml-[9px]">
                                <CustomNavbar data={handleCustomNavData(customNavData)}/>
                            </div>
                        </div>
                        <div className="w-full bg-black h-[40px] relative border-b border-borders">
                            <input
                                type="text"
                                placeholder="Search users..."
                                onChange={(e) => {
                                    handleSearch(e.target.value);
                                    setSearchQ(e.target.value);
                                }}
                                className="bg-black outline-none border-none relative -translate-y-1/2 top-1/2 left-[9px] px-[20px] text-[14px] h-[calc(100%-2px)] placeholder:text-[14px] placeholder:text-text_2 w-[calc(100%-100px)]"
                            />
                        </div>
                        <div>
                            <UserRatingsList
                                searchFn={handleSearch}
                                data={userRatings as any}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default UserRatings;
