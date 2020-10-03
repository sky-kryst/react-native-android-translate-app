/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

const {height} = Dimensions.get('window');

const App = () => {
  const [languages, setLanguages] = useState(['German', 'English']);
  const [languageCodes, setLanguageCodes] = useState(['de', 'en']);
  const [toBeConvertedText, setToBeConvertedText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [loading, setLoading] = useState(null);

  const toggleLanguage = useCallback(() => {
    setLanguages((pS) => [pS[1], pS[0]]);
    setLanguageCodes((pS) => [pS[1], pS[0]]);
    convertedText === ''
      ? setConvertedText('')
      : setConvertedText(toBeConvertedText);
    convertedText === ''
      ? setToBeConvertedText('')
      : setToBeConvertedText(convertedText);
  }, [convertedText, toBeConvertedText]);

  const onReset = () => {
    setToBeConvertedText('');
    setConvertedText('');
  };

  useEffect(() => {
    toBeConvertedText === '' && convertedText !== '' && setConvertedText('');
  }, [toBeConvertedText, convertedText]);

  const fetchTranslation = () => {
    setLoading(true);
    Keyboard.dismiss();
    const key = 'AIzaSyCvfXHDEUTzb9wwtgHWiWpcrTpl6ewtsvA';

    fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${key}&target=${languageCodes[1]}&source=${languageCodes[0]}&format=text&q=${toBeConvertedText}`,
      {
        method: 'POST',
      },
    )
      .then((response) => response.text())
      .then((r) => JSON.parse(r))
      .then((result) => {
        setLoading(null);
        setConvertedText(result.data.translations[0].translatedText);
      })
      .catch((error) => {
        setLoading(null);
        Alert.alert('Error', `${error.message}`);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.Main}>
        <View style={styles.Header}>
          <Text style={styles.Title}>Translator App</Text>
        </View>
        <View style={styles.Content}>
          <KeyboardAvoidingView behavior="position">
            <TextInput
              onChangeText={(t) => setToBeConvertedText(t)}
              style={styles.Text}
              multiline={true}
              placeholder={languages[0]}
              value={toBeConvertedText}
            />
          </KeyboardAvoidingView>
          <View style={styles.Button}>
            <TouchableOpacity
              activeOpacity={0.1}
              style={styles.button}
              onPress={onReset}>
              <Text style={{color: 'white'}}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.1}
              style={styles.button}
              onPress={fetchTranslation}>
              <Text style={{color: 'white'}}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.1}
              style={styles.button}
              onPress={toggleLanguage}>
              <Text style={{color: 'white'}}>Exchange</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator color="#999999" size="large" />
            </View>
          ) : (
            <View
              style={{
                ...styles.Text,
                paddingVertical: '3.5%',
              }}>
              <Text
                style={{
                  color:
                    convertedText !== '' && toBeConvertedText !== ''
                      ? 'black'
                      : 'grey',
                  paddingHorizontal: 2,
                }}>
                {convertedText !== '' && toBeConvertedText !== ''
                  ? convertedText
                  : languages[1]}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  Text: {
    borderWidth: 1,
    borderColor: 'black',
    width: '98%',
    alignSelf: 'center',
    marginVertical: '1%',
    overflow: 'visible',
  },
  Main: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  Content: {
    justifyContent: 'center',
    height: '92%',
  },
  Button: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: '1%',
    flexDirection: 'row',
    marginHorizontal: '1%',
  },
  loader: {
    marginVertical: '3%',
  },
  button: {
    backgroundColor: '#00bfff',
    width: '28%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '2.5%',
  },
  Header: {
    paddingVertical: '3%',
    width: '100%',
    backgroundColor: '#00bfff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: '5%',
  },
  Title: {
    color: 'white',
    fontSize: 20,
  },
});

export default App;
