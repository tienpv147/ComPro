// type ProblemData = CodeData & DescriptionData;
// type Problem = ProblemData & DescriptionData;

// interface Problem {
//     main: ProblemData;
//     editorial: EditorialData;
//     test: any[][];
// }

// interface Problem {
//     main: ProblemData & DescriptionData;
//     hints: string
//     test: any[][];
// }

interface ProblemData {
    id: number;
    name: string;
    name_slug: string;
    difficulty: "hard" | "medium" | "easy";
    status: "solved" | "none" | "attempted";
    like_count: number;
    dislike_count: number;
    acceptance_rate_count: number;
    topic_tags: string;
}

// interface CodeData {
//     code_default_language: string;
//     code_body: Record<string, string>;
//     testcases?: TestCase[];
// }

interface DescriptionData {
    id: number;
    name_slug: string;
    description_body: string;
    similar_questions: string;
}

interface UPstatus {
    username: string;
    problem_name_slug: string
    status: "solved" | "none" | "attempted";
}

// interface DescriptionData {
//     id: number;
//     name: string;
//     difficulty: "hard" | "medium" | "easy";
//     like_count: number;
//     dislike_count: number;
//     status: "solved" | "none" | "attempted";
//     is_starred: boolean;
//     like_status: "liked" | "disliked" | "none";
//     description_body: string;
//     accept_count: number;
//     submission_count: number;
//     acceptance_rate_count: number;
//     discussion_count: number;
//     related_topics: string[];
//     similar_questions: string[];
//     solution_count: number;
// }

interface EditorialData {
    editorial_body: string;
}

interface Json {
    main: ProblemData;
    editorial: EditorialData;
    test: any[][];
    function_name: string;
}

// interface TestCase {
//     inputs: Record<string, string>;
//     expected_output_name: string;
//     expected_output: string;
// }

interface Submission {
    problem_name: string;
    status:
        | "Accepted"
        | "Runtime Error"
        | "Wrong Answer"
        | "Time Limit Exceeded"
        | "Compilation Error"
        | "Out of memory";
    error?: string;
    runtime: number;
    memory: number;
    language: string;
    time: Date;
    code_body?: string;
    input?: string;
    expected_output?: string;
    user_output?: string;
}

type TestCase = {
    verdict: string;
    verdictStatusCode: number;
    output: string;
    error: string;
    expectedOutput: string;
    executionDuration: number;
};

type Sort = "asc" | "des" | "";
