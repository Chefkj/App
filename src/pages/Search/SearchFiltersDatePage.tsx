import React from 'react';
import {useOnyx} from 'react-native-onyx';
import FullPageNotFoundView from '@components/BlockingViews/FullPageNotFoundView';
import DatePicker from '@components/DatePicker';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormOnyxValues} from '@components/Form/types';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import ScreenWrapper from '@components/ScreenWrapper';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import {updateAdvancedFilters} from '@libs/actions/Search';
import Navigation from '@libs/Navigation/Navigation';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import INPUT_IDS from '@src/types/form/SearchAdvancedFiltersForm';

function SearchFiltersDatePage() {
    const styles = useThemeStyles();
    const {translate} = useLocalize();

    const [searchAdvancedFiltersForm] = useOnyx(ONYXKEYS.FORMS.SEARCH_ADVANCED_FILTERS_FORM);
    const dateAfter = searchAdvancedFiltersForm?.[INPUT_IDS.DATE_AFTER];
    const dateBefore = searchAdvancedFiltersForm?.[INPUT_IDS.DATE_BEFORE];

    const updateDateFilter = (values: FormOnyxValues<typeof ONYXKEYS.FORMS.SEARCH_ADVANCED_FILTERS_FORM>) => {
        updateAdvancedFilters(values);
        Navigation.goBack(ROUTES.SEARCH_ADVANCED_FILTERS);
    };

    return (
        <ScreenWrapper
            testID={SearchFiltersDatePage.displayName}
            shouldShowOfflineIndicatorInWideScreen
            offlineIndicatorStyle={styles.mtAuto}
        >
            <FullPageNotFoundView shouldShow={false}>
                <HeaderWithBackButton title={translate('common.date')} />
                <FormProvider
                    style={[styles.flex1, styles.ph5]}
                    formID={ONYXKEYS.FORMS.SEARCH_ADVANCED_FILTERS_FORM}
                    onSubmit={updateDateFilter}
                    submitButtonText={translate('common.save')}
                    enabledWhenOffline
                >
                    <InputWrapper
                        InputComponent={DatePicker}
                        inputID={INPUT_IDS.DATE_AFTER}
                        label={translate('search.filters.date.after')}
                        defaultValue={dateAfter}
                        maxDate={CONST.CALENDAR_PICKER.MAX_DATE}
                        minDate={CONST.CALENDAR_PICKER.MIN_DATE}
                    />
                    <InputWrapper
                        InputComponent={DatePicker}
                        inputID={INPUT_IDS.DATE_BEFORE}
                        label={translate('search.filters.date.before')}
                        defaultValue={dateBefore}
                        maxDate={CONST.CALENDAR_PICKER.MAX_DATE}
                        minDate={CONST.CALENDAR_PICKER.MIN_DATE}
                    />
                </FormProvider>
            </FullPageNotFoundView>
        </ScreenWrapper>
    );
}

SearchFiltersDatePage.displayName = 'SearchFiltersDatePage';

export default SearchFiltersDatePage;
