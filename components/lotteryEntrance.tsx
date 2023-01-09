import { useCallback, useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useNotification } from "@web3uikit/core";
import { ethers } from "ethers";
import { contractAddresses, abi } from "../constants";
export const LotteryEntrance = () => {
  const [entranceFee, setEntranceFee] = useState<string>("0");
  const [numOfPlayers, setNumOfPlayers] = useState<string>("0");
  const [recentWinner, setRecentWinner] = useState<string>("");
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const dispatch = useNotification();
  const chainId = chainIdHex ? parseInt(chainIdHex) : undefined;
  const raffleAddress =
    chainId && chainId in contractAddresses ? (contractAddresses as Record<string, string[]>)[chainId][0] : undefined;
  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const updateUI = useCallback(async () => {
    const entranceFee = (await getEntranceFee()) as number;
    const noOfPlayers = (await getNumberOfPlayers()) as string;
    const rWinner = (await getRecentWinner()) as string;
    setNumOfPlayers(noOfPlayers.toString());
    setEntranceFee(entranceFee.toString());
    setRecentWinner(rWinner.toString());
  }, [getEntranceFee, getNumberOfPlayers, getRecentWinner]);

  const handleEnterRaffle = useCallback(async () => {
    await enterRaffle({
      onSuccess: async (transaction: any) => {
        await transaction.wait(1);
        dispatch({ type: "info", message: "Transaction complete", title: "Tx Notification", position: "topR" });
        updateUI();
      },
      onError(error) {
        console.error("Error === ", error);
      },
    });
  }, [dispatch, enterRaffle, updateUI]);

  useEffect(() => {
    if (isWeb3Enabled && raffleAddress) {
      updateUI();
    }
  }, [isWeb3Enabled, raffleAddress, updateUI]);
  return (
    <div className="w-full pt-4">
      {raffleAddress ? (
        <div className="lg:w-1/3 lg:mx-auto p-4 bg-gray-200 rounded-md space-y-2">
          <div className="text-center border-b border-gray-100 pb-2">
            <div className="font-bold">Recent Winner:</div>
            <div>{recentWinner}</div>
          </div>
          <div className="text-center border-b border-gray-100 pb-2">
            <div className="font-bold">Number of Players:</div>
            <div>{numOfPlayers}</div>
          </div>
          <div className="text-center border-b border-gray-100 pb-2">
            <button className="h-10 px-6 font-semibold rounded-md bg-black text-white" onClick={handleEnterRaffle}>
              Enter Raffle with {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            </button>
          </div>
        </div>
      ) : (
        <div>No Raffle address detected</div>
      )}
    </div>
  );
};
