import type React from "react";
import { GameCanvas } from "./ui";
import Scorecard from "./ui/components/Scorecard";

const App: React.FC = () => {
  return (
    <>
      <Scorecard />
      <GameCanvas />
    </>
  );
};

export default App;
