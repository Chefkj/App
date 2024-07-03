import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import FullScreenLoadingIndicator from '@components/FullscreenLoadingIndicator';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import Modal from '@components/Modal';
import ScreenWrapper from '@components/ScreenWrapper';
import useThemeStyles from '@hooks/useThemeStyles';
import Navigation from '@libs/Navigation/Navigation';
import * as PaymentMethods from '@userActions/PaymentMethods';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import CONFIG from '@src/CONFIG';

type CardAuthenticationModalProps = {
    /** Title shown in the header of the modal */
    headerTitle?: string;
};
function CardAuthenticationModal({headerTitle}: CardAuthenticationModalProps) {
    const styles = useThemeStyles();
    const [authenticationLink] = useOnyx(ONYXKEYS.VERIFY_3DS_SUBSCRIPTION);
    const [privateStripeCustomerID] = useOnyx(ONYXKEYS.NVP_PRIVATE_STRIPE_CUSTOMER_ID);
    const [isLoading, setIsLoading] = useState(true);
    const [session] = useOnyx(ONYXKEYS.SESSION);
 
    useEffect(() => {
        if (privateStripeCustomerID?.status !== CONST.STRIPE_GBP_AUTH_STATUSES.SUCCEEDED) {
            return;
        }
        PaymentMethods.clearPaymentCard3dsVerification();
        Navigation.navigate(ROUTES.SETTINGS_SUBSCRIPTION);
    }, [privateStripeCustomerID]);

    useEffect(() => {
        if (!session) {
            return;
        }
        document.cookie = `authToken=${session.authToken}; domain=${CONFIG.EXPENSIFY.SECURE_EXPENSIFY_URL}; path=/;`;
        document.cookie = `email=${session.email}; domain=${CONFIG.EXPENSIFY.SECURE_EXPENSIFY_URL}; path=/;`;
    }, [session]);

    // useEffect(() => {
    //     if (!session) {
    //         return;
    //     }
    //     // Ensure cookies are marked as Secure and set SameSite=None for cross-domain compatibility
    //     document.cookie = `authToken=${session.authToken}; domain=.expensify.com.dev; path=/; SameSite=None; Secure`;
    //     document.cookie = `email=${session.email}; domain=.expensify.com.dev; path=/; SameSite=None; Secure`;
    // }, [session]);
    

    const onModalClose = () => {
        PaymentMethods.clearPaymentCard3dsVerification();
    };

    const url = `${CONFIG.EXPENSIFY.SECURE_EXPENSIFY_URL}iframe_authenticate_billing.php?authToken=${session?.authToken}&authenticationLink=${authenticationLink}`;

    return (
        <Modal
            type={CONST.MODAL.MODAL_TYPE.CENTERED_UNSWIPEABLE}
            isVisible={!!authenticationLink}
            onClose={onModalClose}
            onModalHide={onModalClose}
        >
            <ScreenWrapper
                style={styles.pb0}
                includePaddingTop={false}
                includeSafeAreaPaddingBottom={false}
                testID={CardAuthenticationModal.displayName}
            >
                <HeaderWithBackButton
                    title={headerTitle}
                    shouldShowBorderBottom
                    shouldShowCloseButton
                    onCloseButtonPress={onModalClose}
                    shouldShowBackButton={false}
                />
                {isLoading && <FullScreenLoadingIndicator />}
                <View style={[styles.flex1]}>
                    <iframe
                        src={url}
                        title="Statements"
                        height="100%"
                        width="100%"
                        seamless
                        style={{border: 'none'}}
                        onLoad={() => {
                            setIsLoading(false);
                        }}
                    />
                </View>
            </ScreenWrapper>
        </Modal>
    );
}

CardAuthenticationModal.displayName = 'CardAuthenticationModal';

export default CardAuthenticationModal;
