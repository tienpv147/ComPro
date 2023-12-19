type StatusResponse =
    "Accepted"
    | "Wrong Answer"
    | "Compilation Error"
    | "Out Of Memory"
    | "Time Limit Exceeded"
    | "Runtime Error";

const StatusResponseCodes = {
    "Accepted": 100,
    "Wrong Answer": 200,
    "Compilation Error": 300,
    "Out Of Memory": 400,
    "Time Limit Exceeded": 500,
    "Runtime Error": 600,
};

export {StatusResponseCodes};
export type {StatusResponse};

