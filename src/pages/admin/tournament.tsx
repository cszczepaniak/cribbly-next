import { Button } from "@components/styled-button";
import { NextPage } from "next";

const Tournament: NextPage = () => {
  return (
    <div className="w-full flex flex-col items-center p-4">
      <h1 className="text-5xl font-semibold pt-8 pb-8 text-center">
        Tournament
      </h1>
      <Button className="max-w-md mb-8">Generate Prelim Games</Button>
    </div>
  );
};

export default Tournament;
