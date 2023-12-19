import {useState} from "react";
import CustomNavbar from "../components/CustomNavbar";
import ProblemList from "../components/ProblemList";
import MainHeading from "../components/MainHeading";
import { useEffect } from "react";
import axios, { AxiosError } from "axios";
import {useNavigate, useParams} from "react-router-dom";
import { API_URL } from "../App";
import {createTheme, Pagination, ThemeProvider} from "@mui/material";

const ITEMS_PER_PAGE = 10;
const theme = createTheme({
    palette: {
        background: {
            paper: '#fff',
        },
        text: {
            primary: '#ffffff',
            secondary: '#46505A',
        },
        action: {
            active: '#001E3C',
        },
    },
});

const ProblemSet = ({
    token,
    id,
}: {
    token: string | null;
    id: string | null;
}) => {
    const [username, setUsername] = useState<string>("");
    const [verified, setVerified] = useState<boolean>(false);
    const navigate = useNavigate();
    const [problemListData, setProblemListData] = useState([]);
    const [totalProblemListData, setTotalProblemListData] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    let { topic } = useParams();
    topic = topic === undefined ? "" : topic;

    const customNavData: Navbar = {
        items: [
            { text: "All Topics", link_path: "/problemset" },
            { text: "Array", link_path: "/problemset/array" },
            { text: "String", link_path: "/problemset/string" },
            { text: "Sorting", link_path: "/problemset/sorting" },
            { text: "Stack", link_path: "/problemset/stack" },
            { text: "Queue", link_path: "/problemset/queue" },
            { text: "Math", link_path: "/problemset/math" },
            { text: "Dynamic Progamming", link_path: "/problemset/dynamic" },
        ],
    };

    const [searchQ, setSearchQ] = useState<string>("");

    const handleSearch = async (
        searchQuery: string,
        options: SortOptions = {
            acceptance_rate_count: "",
            difficulty: "",
            title: "",
        }
    ) => {
        const { acceptance_rate_count, difficulty, title } = options;
        try {
            const { data } = await axios.post(
                `${API_URL}/api/problem/all?search=${searchQuery}&topic=${topic}&acceptance=${acceptance_rate_count}&difficulty=${difficulty}&title=${title}`,
                { id }
            );
            setTotalProblemListData(data);
            setPageCount(Math.ceil(data.length / ITEMS_PER_PAGE));
            initProblemListData(1);
        } catch (error) {
            console.error("Error searching:", error);
        }
    };

    const initProblemListData = (page: number) => {
        const startOffset = page * ITEMS_PER_PAGE - ITEMS_PER_PAGE;
        const endOffset = startOffset + ITEMS_PER_PAGE;
        const currentData = totalProblemListData.slice(startOffset, endOffset);
        setProblemListData(currentData);
    }

    const handlePageChange = (event: any, page: number) => {
        initProblemListData(page);
    }

    useEffect(() => {
        axios
            .get(`${API_URL}/api/accounts/id/${id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then(({ data }) => {
                setUsername(data.username);
                setVerified(true);
            })
            .catch((e: AxiosError) => {
                console.log(e);
                navigate("/sorry");
                setVerified(false);
            });

        axios
            .post(`${API_URL}/api/problem/all?&topic=${topic}`, { id: id })
            .then(({ data }) => {
                setTotalProblemListData(data);
                setPageCount(Math.ceil(data.length / ITEMS_PER_PAGE));
            });
    }, [id, token, navigate, topic]);

    useEffect(() => {
        initProblemListData(1);
    }, [totalProblemListData]);

    return (
        <>
            {verified ? (
                <MainHeading data={{
                    items: [
                        { text: "Problem List", link_path: "/problemset" },
                        { text: "Ratings", link_path: "/ratings" },
                    ],
                    username: username
                }}
                />
            ) : (
                <MainHeading data={{ status: "none" }} />
            )}

            <div className="h-[calc(100vh-60px)] overflow-hidden bg-black">
                <div
                    id="cont"
                    className="relative flex flex-row h-[calc(100vh-60px)] w-full mt-[8px] "
                >
                    <div
                        id="explanation"
                        className="h-[calc(100%-16px)] bg-black border border-borders ml-[8px] rounded-lg w-[calc(100%-16px)] overflow-scroll"
                    >
                        <div className="w-full bg-black border-b border-borders ">
                            <div className="ml-[9px]">
                                <CustomNavbar data={customNavData} />
                            </div>
                        </div>
                        <div className="w-full bg-black h-[40px] relative border-b border-borders">
                            <input
                                type="text"
                                placeholder="Search questions..."
                                onChange={(e) => {
                                    handleSearch(e.target.value);
                                    setSearchQ(e.target.value);
                                }}
                                className="bg-black outline-none border-none relative -translate-y-1/2 top-1/2 left-[9px] px-[20px] text-[14px] h-[calc(100%-2px)] placeholder:text-[14px] placeholder:text-text_2 w-[calc(100%-100px)]"
                            />
                        </div>
                        <div>
                            <ProblemList
                                searchFn={handleSearch}
                                searchQuery={searchQ}
                                data={problemListData as any}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '20px' }}>
                            <ThemeProvider theme={theme}>
                                <Pagination
                                    count={pageCount}
                                    variant="outlined"
                                    shape="rounded"
                                    color="primary"
                                    onChange={handlePageChange}
                                    sx={{
                                        color: 'text.primary',
                                        borderBlockEndColor: 'white',
                                        justifyContent: 'flex-end',
                                        marginRight: '20px'
                                    }}
                                />
                            </ThemeProvider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProblemSet;
