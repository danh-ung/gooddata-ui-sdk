// (C) 2022 GoodData Corporation
import React from "react";
import { Dropdown } from "@gooddata/sdk-ui-kit";
import { AttributeFilterDropdownBody } from "./AttributeFilterDropdownBody";
import { IAttributeDropdownBodyPropsNoCallbacks } from "./AttributeFilterDropdownContent";
import { IListItem } from "../types";
import { useAttributeFilterComponentsContext } from "../Context/AttributeFilterComponentsContext";

const ALIGN_POINTS = [
    { align: "bl tl" },
    { align: "tr tl" },
    { align: "br tr", offset: { x: -11 } },
    { align: "tr tl", offset: { x: 0, y: -100 } },
    { align: "tr tl", offset: { x: 0, y: -50 } },
];

export interface IAttributeFilterDropdownProps {
    isFiltering: boolean;
    isDropdownOpen: boolean;

    isElementsLoading: boolean; //TODO investigate this prop and move it or remove it
    isOriginalTotalCountLoading: boolean;

    title: string;

    subtitle: string;

    selectedFilterOptions: IListItem[];

    onDropdownOpenStateChanged: (isOpen: boolean) => void;
    onApplyButtonClicked: () => void;

    hasNoMatchingData: boolean; //TODO move to DropDown props
    hasNoData: boolean; //TODO move to DropDown props
    isApplyDisabled: boolean; //TODO move to DropDown props

    dropDownProps: IAttributeDropdownBodyPropsNoCallbacks;
}

export const AttributeFilterDropdown: React.FC<IAttributeFilterDropdownProps> = (props) => {
    const {
        isFiltering,
        isDropdownOpen,
        isOriginalTotalCountLoading,
        title,
        subtitle,
        selectedFilterOptions,
        onDropdownOpenStateChanged,
        hasNoMatchingData,
        hasNoData,
        isApplyDisabled,
        onApplyButtonClicked,
        dropDownProps,
    } = props;

    const { AttributeFilterButton } = useAttributeFilterComponentsContext();

    return (
        <Dropdown
            closeOnParentScroll={true}
            closeOnMouseDrag={true}
            closeOnOutsideClick={true}
            enableEventPropagation={true}
            alignPoints={ALIGN_POINTS}
            renderButton={({ toggleDropdown }) => (
                <AttributeFilterButton
                    isFiltering={isFiltering}
                    isOpen={isDropdownOpen}
                    title={title}
                    subtitleText={subtitle}
                    subtitleItemCount={selectedFilterOptions.length}
                    isLoaded={!isOriginalTotalCountLoading}
                    onClick={toggleDropdown}
                />
            )}
            onOpenStateChanged={onDropdownOpenStateChanged}
            renderBody={({ closeDropdown }) => (
                <AttributeFilterDropdownBody
                    isApplyDisabled={isApplyDisabled}
                    hasNoMatchingData={hasNoMatchingData}
                    onApplyButtonClicked={onApplyButtonClicked}
                    closeDropdown={closeDropdown}
                    hasNoData={hasNoData}
                    bodyProps={dropDownProps}
                />
            )}
        />
    );
};