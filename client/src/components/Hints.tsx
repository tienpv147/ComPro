const Hints = ({data}: { data: string[] }) => {

    if (!data || data.length === 0) {
        return (
            <div className="text-[14px] text-text_2 mx-auto text-center mt-[50px]">
                No hints found
            </div>
        );
    }

    return (
        <div>
            {
                data.map((html, index) => (
                    <div
                        key={index} // Use a unique key for each element when mapping over an array
                        id={`description-body-${index}`}
                        className="mt-[36px] ml-[26px] text-[14px]"
                        dangerouslySetInnerHTML={{__html: html}}
                    ></div>
                ))}
        </div>
    );
};

export default Hints;
