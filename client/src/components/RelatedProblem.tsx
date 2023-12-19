import {Link} from "react-router-dom";
import {camelToKebab, kebabToSpacedPascal} from "../ts/utils/string";
import React from "react";

const popularTags = ['Array', 'String', 'Sorting', 'Stack', 'Queue', 'Math', 'Dynamic Programming']

const RelatedProblem = ({data}: {
    data: RelateProblemData
}) => {
    if (data.topic_tags.length === 0 && data.similar_questions.length === 0) {
        return (
            <div className="text-[14px] text-text_2 mx-auto text-center mt-[50px]">
                No related topics or problems found.
            </div>
        );
    }

    return (
        <div>
            {data.topic_tags?.length > 0 ?
                (<div>
                    <h1 className="font-bold mt-[36px] ml-[26px] text-[22px]">
                        Topic Tags:
                    </h1>
                    <ul className="mt-[10px] ml-[26px]">
                        {data.topic_tags.map((tag, index) => (
                            <span key={index}>
                            {popularTags.includes(tag) ? (
                                <Link to={`/problemset/${camelToKebab(tag)}`} className="clickable-link">
                                    {tag}
                                </Link>
                            ) : (
                                <span className="non-clickable-link">{tag}</span>
                            )}
                                {index < data.topic_tags.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </ul>
                </div>) : (<div/>)
            }

            {data.similar_questions?.length > 0 ?
                (<div>
                        <h1 className="font-bold mt-[36px] ml-[26px] text-[22px]">
                            Similar Problems:
                        </h1>
                        <ul className="mt-[10px] ml-[26px]">
                            {data.similar_questions.map((question, index) => (
                                <li key={index}>
                                    <Link to={`/problem/${question}`} className="clickable-link">
                                        {kebabToSpacedPascal(question)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (<div/>)
            }
        </div>
    );
};

export default RelatedProblem;