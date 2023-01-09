import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { ConnectButton } from "@web3uikit/web3";
export const MoralisConnectButton = () => {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [enableWeb3, isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (!account) {
        localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, [Moralis, deactivateWeb3]);

  const handleConnect = async () => {
    await enableWeb3();
    localStorage.setItem("connected", "injected");
  };
  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
        </div>
      ) : (
        <button disabled={isWeb3EnableLoading} onClick={handleConnect}>
          Connect
        </button>
      )}
    </div>
  );
};

export const Header = ({ variant = "web3kit" }: { variant: "web3kit" | "moralis" }) => {
  return (
    <div className="flex justify-between border-b border-gray-100 p-2">
      <h1 className="text-lg font-bold">Smart Contract Lottery</h1>
      {variant === "web3kit" ? <ConnectButton /> : <MoralisConnectButton />}
    </div>
  );
};
