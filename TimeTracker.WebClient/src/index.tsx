import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./behaviour/store";
import { ConfigProvider } from "antd";
import en_GB from "antd/lib/locale-provider/en_GB";
import "moment/locale/en-gb";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <ConfigProvider locale={en_GB}>
                <App />
            </ConfigProvider>
        </Provider>
    </BrowserRouter>
);