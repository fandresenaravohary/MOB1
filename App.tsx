import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const isAuthorized = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (isAuthorized) {
          console.log('Permission granted');
          const token = await messaging().getToken();
          console.log('FCM Token:', token);
        }
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
    };

    const handleForegroundNotification = messaging().onMessage(async message => {
      Alert.alert('notification received', JSON.stringify(message.notification));
    });

    const handleBackgroundNotification = messaging().onNotificationOpenedApp(message => {
      Alert.alert('Notification', JSON.stringify(message.notification));
    });

    messaging()
      .getInitialNotification()
      .then(message => {
        if (message) {
          Alert.alert('Notification on start', JSON.stringify(message.notification));
        }
      });

    initializeFirebase();

    return () => handleForegroundNotification();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello World</Text>
    </View>
  );
};

export default App;
