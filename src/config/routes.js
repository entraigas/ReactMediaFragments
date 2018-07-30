import React from "react";
import { Switch, Route } from "react-router-dom";

import VideoIndex from "../pages/video/videoIndex";
import VideoForm from "../pages/video/videoForm";

const Routes = () => {
  return (
		<Switch>
      <Route path="/add" component={VideoForm} />
			<Route path="/edit" component={VideoForm} />
      <Route path="/" component={VideoIndex} />
    </Switch>
  );
}

export default Routes;
