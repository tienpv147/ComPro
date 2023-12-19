interface CustomStyles {
    control: (styles: Record<string, any>) => Record<string, any>;
    option: (styles: Record<string, any>) => Record<string, any>;
    menu: (styles: Record<string, any>) => Record<string, any>;
    placeholder: (styles: Record<string, any>) => Record<string, any>;
}

export const customStyles: CustomStyles = {
    control: (styles) => ({
        ...styles,
        width: "100%",
        maxWidth: "14rem",
        minWidth: "12rem",
        borderRadius: "5px",
        color: "#000",
        fontSize: "0.8rem",
        lineHeight: "1.75rem",
        backgroundColor: "#FFFFFF",
        cursor: "pointer",
        border: "2px solid #000000",
        left: '5px', top: '2px', bottom: '2px',
        // position: "absolute",
        // boxShadow: "5px 5px 0px 0px rgba(0, 0, 0);",
        ":hover": {
            border: "2px solid #000000",
            boxShadow: "none",
        },
    }),
    option: (styles) => ({
        ...styles,
        color: "#000",
        fontSize: "0.8rem",
        lineHeight: "1.75rem",
        width: "100%",
        background: "#fff",
        left: '5px', top: '2px', bottom: '2px',
        ":hover": {
            backgroundColor: "rgb(243 244 246)",
            color: "#000",
            cursor: "pointer",
        },
    }),
    menu: (styles) => ({
        ...styles,
        backgroundColor: "#fff",
        maxWidth: "14rem",
        border: "2px solid #000000",
        borderRadius: "5px",
        left: '5px',
        // boxShadow: "5px 5px 0px 0px rgba(0, 0, 0);",
    }),
    placeholder: (defaultStyles) => ({
        ...defaultStyles,
        color: "#000",
        fontSize: "0.8rem",
        lineHeight: "1.75rem",
    }),
};
