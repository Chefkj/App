import {Str} from 'expensify-common';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import {setColumnName} from '@libs/actions/ImportSpreadsheet';
import CONST from '@src/CONST';
import ButtonWithDropdownMenu from './ButtonWithDropdownMenu';
import Text from './Text';

const findColumnName = (header: string) => {
    let attribute = '';
    const formattedHeader = Str.removeSpaces(String(header).toLowerCase().trim());
    switch (formattedHeader) {
        case 'email':
        case 'emailaddress':
        case 'emailaddresses':
        case 'e-mail':
        case 'e-mailaddress':
        case 'e-mailaddresses':
            attribute = CONST.CSV_IMPORT_COLUMNS.EMAIL;
            break;

        case 'category':
        case 'categories':
            attribute = CONST.CSV_IMPORT_COLUMNS.EMAIL;
            break;

        case 'glcode':
        case 'gl':
            attribute = CONST.CSV_IMPORT_COLUMNS.GL_CODE;
            break;

        case 'tag':
        case 'tags':
        case 'project':
        case 'projectcode':
        case 'customer':
        case 'name':
            attribute = 'name';
            break;

        case 'submitto':
        case 'submitsto':
            attribute = CONST.CSV_IMPORT_COLUMNS.SUBMIT_TO;
            break;

        case 'approveto':
        case 'approvesto':
            attribute = CONST.CSV_IMPORT_COLUMNS.APPROVE_TO;
            break;

        case 'payroll':
        case 'payrollid':
        case 'payrolls':
        case 'payrol':
        case 'customfield2':
            attribute = CONST.CSV_IMPORT_COLUMNS.CUSTOM_FIELD_2;
            break;

        case 'userid':
        case 'customfield1':
            attribute = CONST.CSV_IMPORT_COLUMNS.CUSTOM_FIELD_1;
            break;

        case 'role':
            attribute = CONST.CSV_IMPORT_COLUMNS.ROLE;
            break;

        case 'total':
        case 'threshold':
        case 'reporttotal':
        case 'reporttotalthreshold':
        case 'approvallimit':
            attribute = CONST.CSV_IMPORT_COLUMNS.REPORT_THRESHHOLD;
            break;

        case 'alternate':
        case 'alternateapprove':
        case 'alternateapproveto':
        case 'overlimitforwardsto':
            attribute = CONST.CSV_IMPORT_COLUMNS.APPROVE_TO_ALTERNATE;

            break;

        case 'destination':
            attribute = CONST.CSV_IMPORT_COLUMNS.NAME;
            break;

        case 'subrate':
            attribute = CONST.CSV_IMPORT_COLUMNS.SUBRATE;
            break;

        case 'amount':
            attribute = CONST.CSV_IMPORT_COLUMNS.AMOUNT;
            break;

        case 'currency':
            attribute = CONST.CSV_IMPORT_COLUMNS.CURRENCY;
            break;

        case 'rateid':
            attribute = CONST.CSV_IMPORT_COLUMNS.RATE_ID;
            break;

        case 'enabled':
        case 'enable':
            attribute = CONST.CSV_IMPORT_COLUMNS.ENABLED;
            break;

        default:
            break;
    }

    return attribute;
};

type ColumnRole = {
    text: string;
    value: string;
    description?: string;
    isRequired?: boolean;
};

type ImportColumnProps = {
    column: string[];
    containsHeader: boolean;
    columnName: string;
    columnRoles: ColumnRole[];
    columnIndex: number;
};

function ImportColumn({column, containsHeader, columnName, columnRoles, columnIndex}: ImportColumnProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();

    const options = columnRoles.map((item) => ({
        text: item.text,
        value: item.value,
        description: item.description ?? (item.isRequired ? translate('common.required') : undefined),
    }));

    const columnValuesString = column
        .slice(containsHeader ? 1 : 0, 6)
        .join(', ')
        .concat(column.length > 6 ? '...' : '');

    const colName = findColumnName(column[0]);
    const defaultSelectedIndex = columnRoles.findIndex((item) => item.value === colName);

    useEffect(() => {
        if (defaultSelectedIndex === -1) {
            return;
        }
        setColumnName(columnIndex, colName);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we don't want this effect to run again
    }, []);

    return (
        <View style={[styles.importColumnCard, styles.mt4]}>
            <Text style={styles.textSupporting}>{containsHeader ? column[0] : translate('spreadsheet.column', columnName)}</Text>
            <View style={[styles.flexRow, styles.alignItemsCenter, styles.mt2]}>
                <Text style={[styles.flex1, styles.flexWrap]}>{columnValuesString}</Text>

                <View style={styles.ml2}>
                    <ButtonWithDropdownMenu
                        onPress={() => {}}
                        isSplitButton={false}
                        onOptionSelected={(option) => {
                            setColumnName(columnIndex, option.value);
                        }}
                        defaultSelectedIndex={defaultSelectedIndex}
                        options={options}
                    />
                </View>
            </View>
        </View>
    );
}

export type {ColumnRole};
export default ImportColumn;
