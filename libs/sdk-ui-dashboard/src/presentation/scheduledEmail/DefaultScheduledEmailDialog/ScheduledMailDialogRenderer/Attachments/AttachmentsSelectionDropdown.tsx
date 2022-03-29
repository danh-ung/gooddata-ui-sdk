// (C) 2022 GoodData Corporation

import * as React from "react";
import { useCallback, useState } from "react";
import { injectIntl, WrappedComponentProps, FormattedMessage } from "react-intl";
import identity from "lodash/identity";

import { Icon, Typography } from "@gooddata/sdk-ui-kit";
import { withTheme } from "@gooddata/sdk-ui-theme-provider";
import { IInsightWidget, ITheme } from "@gooddata/sdk-backend-spi";
import { ScheduleDropdown } from "./ScheduleDropdown";

import { IWidgetsSelection } from "../../interfaces";
import { ObjRef, objRefToString } from "@gooddata/sdk-model";

const ICON_SIZE_BUTTON = 18;
const ICON_SIZE = 24;

export interface IAttachmentsSelectionDropdownOwnProps {
    dashboardTitle: string;
    dashboardSelected: boolean;
    insightWidgets: IInsightWidget[];
    widgetsSelected: { [widgetUri: string]: boolean };
    onApply(dashboardSelected: boolean, widgetsSelected: IWidgetsSelection): void;
    theme?: ITheme;
}

export type IAttachmentsSelectionDropdownProps = IAttachmentsSelectionDropdownOwnProps &
    WrappedComponentProps;

const AttachmentsSelectionDropdownComponent: React.FC<IAttachmentsSelectionDropdownProps> = (props) => {
    const { intl, theme, dashboardTitle, insightWidgets = [], onApply } = props;

    const [dashboardSelected, setDashboardSelected] = useState(props.dashboardSelected);
    const [widgetsSelected, setWidgetsSelected] = useState(props.widgetsSelected);

    const handleWidgetSelectedChange = useCallback(
        (widgetRef: ObjRef) => {
            const widgetRefKey = objRefToString(widgetRef);
            setWidgetsSelected({
                ...widgetsSelected,
                [widgetRefKey]: !widgetsSelected[widgetRefKey],
            });
        },
        [widgetsSelected],
    );

    const handleOnApply = useCallback(() => {
        onApply(dashboardSelected, widgetsSelected);
    }, [onApply, dashboardSelected, widgetsSelected]);
    const handleOnCancel = useCallback(() => {
        setDashboardSelected(props.dashboardSelected);
        setWidgetsSelected(props.widgetsSelected);
    }, [props.dashboardSelected, props.widgetsSelected]);

    const canApply =
        (dashboardSelected || Object.values(widgetsSelected).some(identity)) &&
        (dashboardSelected != props.dashboardSelected ||
            JSON.stringify(widgetsSelected) !== JSON.stringify(props.widgetsSelected));

    return (
        <ScheduleDropdown
            title={intl.formatMessage({ id: "dialogs.schedule.email.attachment.select" })}
            applyDisabled={!canApply}
            onApply={handleOnApply}
            onCancel={handleOnCancel}
            iconComponent={
                <Icon.AttachmentClip
                    color={theme?.palette?.complementary?.c6}
                    width={ICON_SIZE_BUTTON}
                    height={ICON_SIZE_BUTTON}
                />
            }
            contentComponent={
                <div className="gd-attachments-selection-dropdown">
                    <Typography tagName="h3">
                        <FormattedMessage id="dialogs.schedule.email.attachment.select.dashboard.header" />
                    </Typography>
                    <div>
                        <label className="input-checkbox-label">
                            <input
                                type="checkbox"
                                className="input-checkbox"
                                checked={dashboardSelected}
                                onChange={(event) => setDashboardSelected(event.target.checked)}
                            />
                            <Icon.Dashboard
                                color={theme?.palette?.complementary?.c6}
                                width={ICON_SIZE}
                                height={ICON_SIZE}
                            />
                            <span title={dashboardTitle} className="input-label-text">
                                {dashboardTitle}
                            </span>
                        </label>
                    </div>
                    <Typography tagName="h3">
                        <FormattedMessage id="dialogs.schedule.email.attachment.select.widgets.header" />
                    </Typography>
                    {insightWidgets.map((widget) => (
                        <div key={objRefToString(widget)}>
                            <label className="input-checkbox-label">
                                <input
                                    type="checkbox"
                                    className="input-checkbox"
                                    checked={widgetsSelected[objRefToString(widget)]}
                                    onChange={() => handleWidgetSelectedChange(widget)}
                                />
                                <Icon.Chart
                                    color={theme?.palette?.complementary?.c6}
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                />
                                <span title={widget.title} className="input-label-text">
                                    {widget.title}
                                </span>
                            </label>
                        </div>
                    ))}
                </div>
            }
        />
    );
};

export const AttachmentsSelectionDropdown = injectIntl(withTheme(AttachmentsSelectionDropdownComponent));