import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ApolloProvider from "./apolloProvider/apolloProvider";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ApolloProvider>
        <App />
      </ApolloProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
