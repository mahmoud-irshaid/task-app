import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './components/Login';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Login />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
