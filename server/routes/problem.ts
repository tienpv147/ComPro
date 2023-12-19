import express from "express";
import ProblemModel, {DProblem} from "../models/problem";
import UserModel from "../models/user";
import {convertTestCasesResult, mapTestCases, sortByAcceptance, sortByDifficulty, sortByTitle,} from "../utils/utils";
import SpecProblemModel, {DSpecProblem} from "../models/spec_problem";
import axios from "axios";
import {StatusResponseCodes} from "../constants/StatusResponse";

const problem = express.Router();
const COMPILE_API_URI: string = process.env.COMPILE_API_URI || "";

problem.post("/all", async (req, res) => {
    const {id} = req.body;
    const search = req.query.search || "";
    const difficulty = req.query.difficulty || "";
    const acceptance = req.query.acceptance || "";
    const title = req.query.title || "";
    const topic = req.query.topic || "";

    try {
        const allProblems = await ProblemModel.find(
            {
                "main.name": {$regex: search, $options: "i"},
                "main.topic_tags": {$regex: topic, $options: "i"}
            },
            "main.id main.name main.name_slug main.acceptance_rate_count main.difficulty main.like_count main.dislike_count main.topic_tags"
        )
            .exec();

        const allProblemsSorted = sortByAcceptance(
            acceptance.toString() as Sort,
            sortByDifficulty(
                difficulty.toString() as Sort,
                sortByTitle(title.toString() as Sort, allProblems)
            )
        );

        const user = await UserModel.findById(id);
        const sOrA = {
            solved: user?.problems_solved,
            attempted: user?.problems_attempted,
        };

        let allProblemsArray: DProblem[] = JSON.parse(
            JSON.stringify(allProblemsSorted)
        );

        if (sOrA.attempted) {
            for (let i = 0; i < allProblemsArray.length; i++) {
                if (sOrA.attempted.includes(allProblemsArray[i].main.name_slug)) {
                    allProblemsArray[i].main.status = "attempted";
                }
            }
        }
        if (sOrA.solved) {
            for (let i = 0; i < allProblemsArray.length; i++) {
                if (sOrA.solved.includes(allProblemsArray[i].main.name_slug)) {
                    allProblemsArray[i].main.status = "solved";
                }
            }
        }

        res.json(allProblemsArray);
    } catch (e) {
        console.log(e);
        res.json({success: false, message: "Internal Server Error"});
    }
});

problem.post<{ name: string },
    Submission[],
    { code: string; id: string; problem_name: string; current_lang: string }>("/submit/:name", async (req, res) => {
    const {name} = req.params;
    const {code, id, problem_name} = req.body;
    const current_lang: string = req.body.current_lang.toUpperCase();

    try {
        const specProblem = await SpecProblemModel.findOne({
            "main.name_slug": name,
        });
        const user = await UserModel.findById(id);
        if (!user) {
            res.json([
                {
                    problem_name: problem_name,
                    status: "Runtime Error",
                    error: "user not found",
                    time: new Date(),
                    runtime: 0,
                    language: current_lang,
                    memory: Math.random() * 80,
                    code_body: undefined,
                },
            ]);
            return;
        }
        let history: Submission[] | null;
        if (user.submissions) {
            history = user.submissions;
        } else {
            history = null;
        }
        if (specProblem) {
            const specProblemJson = JSON.parse(JSON.stringify(specProblem));

            let payload: any = {
                sourcecode: code,
                language: current_lang,
                timeLimit: 10,
                memoryLimit: 1000,
            };
            payload = mapTestCases(specProblemJson.test || [], payload);

            await axios
                .post(COMPILE_API_URI, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(async (resp) => {
                    if (resp.status == 200) {
                        const respData = resp.data;
                        let submission: Submission[] = [];
                        let passed: boolean = true;

                        if (respData.testCasesResult) {
                            const testCases = convertTestCasesResult(respData.testCasesResult);

                            testCases.forEach((testCase, id) => {
                                if (testCase.verdictStatusCode !== StatusResponseCodes["Accepted"]) {
                                    submission.push({
                                        problem_name: problem_name,
                                        status: respData.verdict,
                                        error: respData.error,
                                        time: respData.dateTime,
                                        runtime: respData.executionDuration,
                                        language: current_lang,
                                        memory: Math.random() * 80,
                                        code_body: code,
                                        input: specProblemJson.test[id]?.input || "",
                                        expected_output: testCase.expectedOutput || "",
                                        user_output: testCase.output || "",
                                    });

                                    passed = false;
                                }
                            });
                        }

                        if (passed) {
                            submission.push({
                                problem_name: problem_name,
                                status: respData.verdict,
                                error: respData.error,
                                time: respData.dateTime,
                                runtime: respData.averageExecutionDuration.toFixed(1),
                                language: current_lang,
                                memory: Math.random() * 80,
                                code_body: code,
                                input: "",
                                expected_output: "",
                                user_output: "",
                            });

                            if (!user.problems_solved.includes(problem_name)) {
                                user.problems_solved.push(problem_name);
                                user.problems_solved_count += 1;

                                const problem = await ProblemModel.findOne({
                                    "main.name_slug": name,
                                });

                                if (problem) {
                                    const problemJson: DProblem = JSON.parse(JSON.stringify(problem));

                                    if (problemJson.main.difficulty == "easy") {
                                        user.rating += 100
                                    } else if (problemJson.main.difficulty == "medium") {
                                        user.rating += 200
                                    } else if (problemJson.main.difficulty == "hard") {
                                        user.rating += 300
                                    }
                                }
                            }
                        } else {
                            if (
                                !user.problems_attempted.includes(problem_name)
                            ) {
                                user.problems_attempted.push(problem_name);
                            }
                        }

                        if (history != null) {
                            submission.push(...history);
                        }
                        user.submissions = submission;

                        const subsByName = submission.filter(
                            (elem) => elem.problem_name === problem_name
                        );

                        await user.save();
                        res.json(subsByName);
                    }
                })
                .catch(async (e) => {
                    let submission: Submission[] = [
                        {
                            problem_name: problem_name,
                            status: "Runtime Error",
                            error: e,
                            time: new Date(),
                            runtime: 0,
                            language: current_lang,
                            memory: Math.random() * 80,
                            code_body: undefined,
                        },
                    ];
                    if (history) {
                        submission.push(...history);
                    }

                    if (!user.problems_attempted.includes(problem_name)) {
                        user.problems_attempted.push(problem_name);
                    }

                    user.submissions = submission;

                    const subsByName = submission.filter(
                        (elem) => elem.problem_name === problem_name
                    );

                    await user.save();
                    res.json(subsByName);
                });
        }
    } catch (e) {
        console.log(e);
    }
});

problem.post<{ name: string }, Submission[], { id: string }>(
    "/submissions/:name",

    async (req, res) => {
        const { name } = req.params;
        const { id } = req.body;
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                res.json([]);
                return;
            }
            if (!user.submissions) {
                res.json([]);
                return;
            }

            const subsByName = user.submissions.filter(
                (elem) => elem.problem_name === name
            );

            res.json(subsByName);
        } catch (e) {
            console.log(e);
            res.json([]);
        }
    }
);

problem.post("/:name", async (req, res) => {
    const { name } = req.params;
    const { id } = req.body;
    try {
        const problem = await ProblemModel.findOne({
            "main.name_slug": name,
        });

        const specProblem = await SpecProblemModel.findOne({
            "main.name_slug": name,
        });

        if (!problem || !specProblem) {
            res.json({ error: "problem not found" });
            return;
        }

        const user = await UserModel.findById(id);
        const problemJson: DProblem = JSON.parse(JSON.stringify(problem));
        const specProblemJson: DSpecProblem = JSON.parse(JSON.stringify(specProblem));

        const combinedRes = {
            main: {
                ...problemJson.main,
                ...specProblemJson.main,
            },
            hints: specProblemJson.hints,
            test: specProblemJson.test,
        };

        if (user?.problems_attempted.includes(name)) {
            combinedRes.main.status = "attempted";
        }
        if (user?.problems_solved.includes(name)) {
            combinedRes.main.status = "solved";
        }

        res.json(combinedRes);
    } catch (e) {
        console.log(e);
    }
});

problem.get("/:name/hints", async (req, res) => {
    const name = req.params.name;
    try {
        const specProblem = await SpecProblemModel.findOne({
            "main.name_slug": name,
        });
        if (specProblem) {
            const response = specProblem.hints;

            const resp: string[] = JSON.parse(response);

            res.json(resp);
        }
    } catch (e) {
        console.log(e);
    }
});

problem.get("/:name/related-problems", async (req, res) => {
    const name = req.params.name;
    try {
        const problem = await ProblemModel.findOne({
            "main.name_slug": name,
        }).select({"main.topic_tags": 1, _id: 0});
        const specProblem = await SpecProblemModel.findOne({
            "main.name_slug": name,
        }).select({"main.similar_questions": 1,_id: 0});

        if (problem && specProblem) {
            const problemTags = JSON.parse(problem.main.topic_tags);
            const similarQuestions = JSON.parse(specProblem.main.similar_questions);

            const result = {
                topic_tags: problemTags.map((tag: { name: string; }) => tag.name),
                similar_questions: similarQuestions.map((question: { titleSlug: string; }) => question.titleSlug),
            };

            res.json(result);
        } else {
            res.json({
                topic_tags: [],
                similar_questions: []
            });
        }
    } catch (e) {
        console.log(e);
    }
});

export default problem;
