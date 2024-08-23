/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import {
  VERYFI_CLIENT_ID,
  VERYFI_USERNAME,
  VERYFI_API_KEY,
  VERYFI_URL,
} from '@env';

import {
  findNodeHandle,
  Image,
  NativeEventEmitter,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import InfoView from './InfoView.tsx';
import VeryfiLens from '@veryfi/react-native-veryfi-lens';

const veryfiLensCredentials = {
  url: VERYFI_URL,
  clientId: VERYFI_CLIENT_ID,
  userName: VERYFI_USERNAME,
  apiKey: VERYFI_API_KEY,
};

const veryfiLensSettings = {
  autoLightDetectionIsOn: false,
  documentTypes: ['receipt', 'other'],
  showDocumentTypes: true,
  dataExtractionEngine: 'api',
  backupDocsToGallery: false,
  autoRotateIsOn: false,
  autoDocDetectionAndCropIsOn: true,
  blurDetectionIsOn: true,
  autoSkewCorrectionIsOn: false,
  autoCropGalleryIsOn: false,
  fraudDetectionIsOn: true,
  saveLogsIsOn: true,
  autoCaptureIsOn: true,
  moreMenuIsOn: false,
  multiplePagesCaptureIsOn: false,
  autoSubmitDocumentOnCapture: false,
  multipleDocumentsIsOn: false,
  closeCameraOnSubmit: true,
  returnStitchedPDF: true,
  stitchIsOn: false,
  stitchOtherIsOn: true,
  stitchTitleIsOn: false,
  allowSubmitUndetectedDocsIsOn: false,
  cleanBorderIsOn: false,
  autoCropBrowserIsOn: true,
  dewarpingIsOn: false,
  detectBlurResponseIsOn: true,
  manualCropIsOn: true,
  gpuIsOn: true, // Be cautious with GPU settings
  autoDeleteAfterProcessing: false,
  showStitchCounterNumber: true,
  galleryOtherIsOn: false,
  browseOtherIsOn: false,
  galleryIcon: true,
  undoIsOn: false,
  moreSettingsMenuIsOn: false,
  pdfPreviewIsOn: true,
  pdfEditIsOn: false,
  showLCDIsNotAllowed: true,
  packageMaxScans: 10,
  shareLogsIsOn: true, // Turn off for live environments
  galleryMultipleSelectionIsOn: true,
  customLensStrings: {
    en: {
      RECEIPT: 'Short Receipt',
      OTHER: 'Multi Page',
    },
  },
  reactTagInfoView: 0,
};

const VeryfiLensEmitter = new NativeEventEmitter(VeryfiLens.NativeModule);

let isCameraReady = false;

const App = () => {
  const infoViewRef = useRef<View>(null);
  useEffect(() => {
    if (infoViewRef.current) {
      const infoViewTag = findNodeHandle(infoViewRef.current);
      if (infoViewTag) {
        setupListeners();
        veryfiLensSettings.reactTagInfoView = infoViewTag;
        VeryfiLens.configureWithCredentials(
          veryfiLensCredentials,
          veryfiLensSettings,
          () => {
            isCameraReady = true;
          },
        );
      } else {
        console.error('Error: Unable to find infoViewTag');
      }
    }
  }, []);

  const [log, setLog] = useState(
    "   Here you will see JSON results from a scan's data extraction performed by the Veryfi API.\n\n   Look carefully, there are 30+ fields (inc. line items) extracted and understood by Veryfi's AI.\n\n   Before you begin, please find a receipt, bill or invoice. Then when ready, press the green COLLECT button below. This will start the Veryfi Lens camera used to capture, preprocess and prepared the document for real-time data extraction.\n\n If you need help, please contact support@veryfi.com\n\n",
  );

  const [thumbnail, setThumbnail] = useState(
    'https://avatars.githubusercontent.com/u/64030334?s=200&v=4',
  );
  const updateLog = (event: any) => {
    setLog(_log => _log + '\n\n' + JSON.stringify(event, null, ' '));
    if ('msg' in event && event.msg === 'img_original_path') {
      setThumbnail(
        _thumbnail => 'file://' + event.data + '?d=' + event.package_id,
      );
      VeryfiLens.getFileBase64(
        event.data,
        (error: any) => {
          console.error(`Error found! ${error}`);
        },
        (dataBase64: any) => {
          console.log(`dataBase64 ${dataBase64} returned`);
        },
      );
    }
  };
  const setupListeners = () => {
    VeryfiLensEmitter.removeAllListeners(VeryfiLens.Events.onVeryfiLensClose);
    VeryfiLensEmitter.removeAllListeners(VeryfiLens.Events.onVeryfiLensUpdate);
    VeryfiLensEmitter.removeAllListeners(VeryfiLens.Events.onVeryfiLensError);
    VeryfiLensEmitter.removeAllListeners(VeryfiLens.Events.onVeryfiLensSuccess);
    VeryfiLensEmitter.addListener(
      VeryfiLens.Events.onVeryfiLensClose,
      updateLog,
    );
    VeryfiLensEmitter.addListener(
      VeryfiLens.Events.onVeryfiLensUpdate,
      updateLog,
    );
    VeryfiLensEmitter.addListener(
      VeryfiLens.Events.onVeryfiLensError,
      updateLog,
    );
    VeryfiLensEmitter.addListener(
      VeryfiLens.Events.onVeryfiLensSuccess,
      updateLog,
    );
  };

  const showCamera = () => {
    if (isCameraReady) {
      VeryfiLens.showCamera();
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.background}>
        <Text style={styles.title}> {'Welcome to Veryfi Lens Demo'} </Text>
        <Image style={styles.thumbnail} source={{uri: thumbnail}} />
        <View style={styles.logBox}>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Text style={styles.logText}>{log}</Text>
          </ScrollView>
        </View>
        <View style={styles.veryfiButton}>
          <TouchableOpacity onPress={showCamera}>
            <Text style={styles.textBoldCenter}>COLLECT</Text>
          </TouchableOpacity>
        </View>
        {/* Hidden InfoView component */}
        <View style={{ width: 50, height: 50}}>
          <InfoView ref={infoViewRef} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  logBox: {
    margin: 16,
    backgroundColor: '#ADD8E6',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
  },
  logText: {
    margin: 16,
    textAlign: 'left',
    fontSize: 17,
    fontWeight: '300',
  },
  veryfiButton: {
    borderColor: '#3FCD8D',
    borderWidth: 2,
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 32,
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: '500',
  },
  container: {
    paddingTop: 50,
  },
  thumbnail: {
    alignSelf: 'center',
    width: 200,
    height: 200,
  },
  textBoldCenter: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 2,
  },
});

export default App;