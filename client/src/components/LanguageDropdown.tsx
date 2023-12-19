import React from "react";
import Select from "react-select";
import {languageOptions} from "../constants/LanguageOptions";
import {customStyles} from "../constants/CustomStyles";

interface LanguagesDropdownProps {
    onSelectChange: (selectedOption: any) => void;
}

const LanguagesDropdown: React.FC<LanguagesDropdownProps> = ({onSelectChange}) => {
    return (
        <Select
            placeholder={`Filter By Category`}
            options={languageOptions}
            styles={customStyles}
            defaultValue={languageOptions[0]}
            onChange={(selectedOption) => onSelectChange(selectedOption)}
        />
    );
};

export default LanguagesDropdown;
