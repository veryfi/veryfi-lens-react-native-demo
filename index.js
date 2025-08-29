/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import HelpView from './HelpView';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('HelpView', () => HelpView);
